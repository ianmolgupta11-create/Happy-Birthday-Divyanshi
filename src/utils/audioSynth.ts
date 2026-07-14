/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Fully customizable, polyphonic Web Audio API Synthesizer for "Happy Birthday" song
 */

export type SynthStyle = "chime" | "retro" | "ambient";

interface Note {
  pitch: string;
  freq: number;
  duration: number; // in beats
  chord?: number[]; // harmonic frequencies to play softly
}

// Map note names to frequencies (Octave 4 & 5)
const FREQS: Record<string, number> = {
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63,
  "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00,
  "A#4": 466.16, "B4": 493.88, "C5": 523.25, "C#5": 554.37, "D5": 587.33,
  "D#5": 622.25, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00
};

// Harmony frequencies
const CHORDS = {
  F_MAJ: [174.61, 220.00, 261.63], // F3, A3, C4
  C_MAJ: [130.81, 164.81, 196.00], // C3, E3, G3
  Bb_MAJ: [146.83, 185.00, 220.00], // Bb3, D3, F3
  D_MIN: [146.83, 174.61, 220.00]  // D3, F3, A3
};

// Happy Birthday melody notes
const MELODY: Note[] = [
  // Phrase 1: Happy Birthday to You
  { pitch: "C4", freq: FREQS["C4"], duration: 0.75, chord: CHORDS.F_MAJ },
  { pitch: "C4", freq: FREQS["C4"], duration: 0.25 },
  { pitch: "D4", freq: FREQS["D4"], duration: 1.0 },
  { pitch: "C4", freq: FREQS["C4"], duration: 1.0 },
  { pitch: "F4", freq: FREQS["F4"], duration: 1.0, chord: CHORDS.F_MAJ },
  { pitch: "E4", freq: FREQS["E4"], duration: 2.0 },

  // Phrase 2: Happy Birthday to You
  { pitch: "C4", freq: FREQS["C4"], duration: 0.75, chord: CHORDS.C_MAJ },
  { pitch: "C4", freq: FREQS["C4"], duration: 0.25 },
  { pitch: "D4", freq: FREQS["D4"], duration: 1.0 },
  { pitch: "C4", freq: FREQS["C4"], duration: 1.0 },
  { pitch: "G4", freq: FREQS["G4"], duration: 1.0, chord: CHORDS.C_MAJ },
  { pitch: "F4", freq: FREQS["F4"], duration: 2.0 },

  // Phrase 3: Happy Birthday Dear Divyanshi
  { pitch: "C4", freq: FREQS["C4"], duration: 0.75, chord: CHORDS.F_MAJ },
  { pitch: "C4", freq: FREQS["C4"], duration: 0.25 },
  { pitch: "C5", freq: FREQS["C5"], duration: 1.0 },
  { pitch: "A4", freq: FREQS["A4"], duration: 1.0, chord: CHORDS.Bb_MAJ },
  { pitch: "F4", freq: FREQS["F4"], duration: 1.0 },
  { pitch: "E4", freq: FREQS["E4"], duration: 1.0 },
  { pitch: "D4", freq: FREQS["D4"], duration: 2.0, chord: CHORDS.D_MIN },

  // Phrase 4: Happy Birthday to You
  { pitch: "A#4", freq: FREQS["A#4"], duration: 0.75, chord: CHORDS.Bb_MAJ },
  { pitch: "A#4", freq: FREQS["A#4"], duration: 0.25 },
  { pitch: "A4", freq: FREQS["A4"], duration: 1.0 },
  { pitch: "F4", freq: FREQS["F4"], duration: 1.0, chord: CHORDS.C_MAJ },
  { pitch: "G4", freq: FREQS["G4"], duration: 1.0 },
  { pitch: "F4", freq: FREQS["F4"], duration: 3.0, chord: CHORDS.F_MAJ }
];

export class BirthdaySynth {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private currentTimeout: number | null = null;
  private tempo: number = 100; // Beats per minute
  private style: SynthStyle = "chime";
  private isPlayingStatus: boolean = false;
  private onNoteCallback: ((noteName: string) => void) | null = null;
  private onStopCallback: (() => void) | null = null;
  private noteIndex: number = 0;

  constructor() {}

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setStyle(newStyle: SynthStyle) {
    this.style = newStyle;
  }

  public setTempo(newTempo: number) {
    this.tempo = Math.max(60, Math.min(200, newTempo));
  }

  public onNote(callback: (noteName: string) => void) {
    this.onNoteCallback = callback;
  }

  public onStop(callback: () => void) {
    this.onStopCallback = callback;
  }

  public isPlaying(): boolean {
    return this.isPlayingStatus;
  }

  public play() {
    this.init();
    if (this.isPlayingStatus) {
      this.stop();
    }
    this.isPlayingStatus = true;
    this.noteIndex = 0;
    this.playNextNote();
  }

  public stop() {
    this.isPlayingStatus = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
    this.activeNodes.forEach(node => {
      try {
        (node as any).stop?.();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    if (this.onStopCallback) {
      this.onStopCallback();
    }
  }

  private playNextNote() {
    if (!this.isPlayingStatus || !this.ctx) return;

    if (this.noteIndex >= MELODY.length) {
      // Loop the song
      this.noteIndex = 0;
    }

    const note = MELODY[this.noteIndex];
    const beatDuration = 60 / this.tempo;
    const durationSec = note.duration * beatDuration;

    // Call callback for visualizer
    if (this.onNoteCallback) {
      this.onNoteCallback(note.pitch);
    }

    // Play the melody node
    this.triggerOscillator(note.freq, durationSec, 0.4, false);

    // Play chord accompaniment if present
    if (note.chord) {
      note.chord.forEach(freq => {
        this.triggerOscillator(freq, durationSec * 1.2, 0.1, true);
      });
    }

    this.noteIndex++;
    
    // Schedule next note
    this.currentTimeout = window.setTimeout(() => {
      this.playNextNote();
    }, durationSec * 1000);
  }

  private triggerOscillator(freq: number, duration: number, volume: number, isChord: boolean) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Apply different synth styles
    if (this.style === "chime") {
      // High-quality Celeste Bell / Chime sound
      osc.type = "sine";
      
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      // Fast attack
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      // Gentle decay, long ring out
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      // Add a higher-frequency chime harmonic for sparkle
      if (!isChord) {
        const harmonicOsc = this.ctx.createOscillator();
        const harmonicGain = this.ctx.createGain();
        harmonicOsc.type = "sine";
        harmonicOsc.frequency.value = freq * 2; // Octave above
        harmonicOsc.connect(harmonicGain);
        harmonicGain.connect(this.ctx.destination);
        harmonicGain.gain.setValueAtTime(0, now);
        harmonicGain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.01);
        harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);
        harmonicOsc.start(now);
        harmonicOsc.stop(now + duration);
        this.activeNodes.push(harmonicOsc);
      }
    } else if (this.style === "retro") {
      // 8-bit classic arcade sound
      osc.type = "triangle";
      
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.7, now + 0.01);
      // Linear release
      gain.gain.linearRampToValueAtTime(0.001, now + duration);
    } else {
      // Ambient warm synth pad
      osc.type = "triangle";
      
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      // Slow attack
      gain.gain.linearRampToValueAtTime(volume * 0.8, now + 0.15);
      // Slow release
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration * 1.1);
    }

    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    const startTime = this.ctx.currentTime;
    osc.start(startTime);
    osc.stop(startTime + duration * 1.5);

    this.activeNodes.push(osc);

    // Periodic cleanup of completed nodes
    setTimeout(() => {
      this.activeNodes = this.activeNodes.filter(n => n !== osc);
    }, duration * 2000);
  }
}
