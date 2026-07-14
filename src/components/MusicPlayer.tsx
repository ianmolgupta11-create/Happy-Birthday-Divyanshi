import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Music, Sliders, Disc } from "lucide-react";
import { BirthdaySynth, SynthStyle } from "../utils/audioSynth";

interface MusicPlayerProps {
  synth: BirthdaySynth;
  isAutoplayTriggered: boolean;
}

export function MusicPlayer({ synth, isAutoplayTriggered }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [style, setStyle] = useState<SynthStyle>("chime");
  const [tempo, setTempo] = useState(105);
  const [activeNote, setActiveNote] = useState<string>("");

  useEffect(() => {
    // Listen for synthesizer notes to trigger visual animations
    synth.onNote((noteName) => {
      setActiveNote(noteName);
      // Automatically clear after short delay
      setTimeout(() => {
        setActiveNote((prev) => (prev === noteName ? "" : prev));
      }, 250);
    });

    synth.onStop(() => {
      setIsPlaying(false);
    });

    return () => {
      synth.stop();
    };
  }, [synth]);

  // Handle autoplay trigger from cover page
  useEffect(() => {
    if (isAutoplayTriggered) {
      synth.setStyle(style);
      synth.setTempo(tempo);
      synth.play();
      setIsPlaying(true);
    }
  }, [isAutoplayTriggered]);

  const togglePlay = () => {
    if (isPlaying) {
      synth.stop();
      setIsPlaying(false);
    } else {
      synth.setStyle(style);
      synth.setTempo(tempo);
      synth.play();
      setIsPlaying(true);
    }
  };

  const handleStyleChange = (newStyle: SynthStyle) => {
    setStyle(newStyle);
    synth.setStyle(newStyle);
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value);
    setTempo(newTempo);
    synth.setTempo(newTempo);
  };

  // Preloaded list of keys for visualizer
  const VISUAL_KEYS = ["C4", "D4", "E4", "F4", "G4", "A4", "A#4", "B4", "C5"];

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col items-center relative overflow-hidden">
      
      {/* Decorative sparkling elements */}
      <div className="absolute top-4 right-4 text-amber-300 opacity-40 animate-pulse text-sm">✨</div>
      <div className="absolute bottom-4 left-4 text-pink-300 opacity-30 animate-pulse text-xs">💫</div>

      <div className="text-center mb-4">
        <h3 className="text-xl font-normal font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0d8d0] to-[#bca380] flex items-center justify-center gap-2">
          <Music className="h-5 w-5 text-amber-400 animate-pulse" /> Birthday Harmonies 🎵
        </h3>
        <p className="text-[11px] text-white/50 mt-1 font-light">
          Listen to the synthesized melodies of "Happy Birthday to You"
        </p>
      </div>

      {/* Cassette Tape / Record Visualizer */}
      <div className="w-full h-32 bg-[#130d0a] rounded-2xl relative shadow-inner overflow-hidden border border-white/5 flex flex-col items-center justify-center mb-5 select-none">
        
        {/* Cassette Label Decor */}
        <div className="absolute top-2 left-6 right-6 h-6 bg-amber-500/10 border-b border-amber-500/20 text-[9px] font-mono text-[#c8a27d] flex items-center justify-between px-3 uppercase tracking-wider">
          <span>Dolby B/C NR</span>
          <span>Divyanshi Edition 💖</span>
        </div>

        {/* Rotational spindles inside Cassette */}
        <div className="flex gap-10 mt-6 justify-center items-center z-10">
          <div className="relative">
            <Disc
              className={`h-12 w-12 text-[#2d251f] ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#130d0a] border border-white/10 shadow-inner" />
          </div>
          <div className="relative">
            <Disc
              className={`h-12 w-12 text-[#2d251f] ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#130d0a] border border-white/10 shadow-inner" />
          </div>
        </div>

        {/* Glowing notes bar */}
        <div className="absolute bottom-2 left-4 right-4 h-5 flex justify-between px-2 items-end">
          {VISUAL_KEYS.map((key) => {
            const isActive = activeNote.startsWith(key);
            return (
              <div
                key={key}
                className={`w-3.5 rounded-t-sm transition-all duration-100 ${
                  isActive
                    ? "bg-gradient-to-t from-amber-600 to-yellow-400 h-6 shadow-[0_-2px_10px_rgba(245,158,11,0.6)] scale-110"
                    : "bg-white/5 h-1.5"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Synthesis Style Selector */}
      <div className="flex gap-1.5 w-full mb-4">
        {(["chime", "retro", "ambient"] as const).map((styleName) => (
          <button
            key={styleName}
            onClick={() => handleStyleChange(styleName)}
            className={`flex-1 py-1.5 rounded-xl text-[10px] font-semibold transition-all duration-300 border uppercase cursor-pointer ${
              style === styleName
                ? "bg-gradient-to-r from-amber-600 to-[#c8a27d] text-black border-none shadow-md"
                : "bg-white/5 hover:bg-white/10 text-white border-white/10 shadow-sm"
            }`}
          >
            {styleName === "chime" ? "🔔 Celeste" : styleName === "retro" ? "👾 Retro" : "☁️ Ambient"}
          </button>
        ))}
      </div>

      {/* Main Play / Volume Slider Controls */}
      <div className="flex flex-col items-center w-full gap-3 bg-white/[0.01] p-4 rounded-2xl border border-white/5 shadow-inner">
        <div className="flex items-center gap-4 w-full">
          
          {/* Play / Pause Toggle Button */}
          <button
            id="play-music-btn"
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
              isPlaying
                ? "bg-white hover:bg-slate-100 text-black shadow-lg"
                : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
            }`}
          >
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
          </button>

          {/* Tempo slider control */}
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between items-center text-[10px] font-medium text-white/70">
              <span className="flex items-center gap-1 font-light">
                <Sliders className="h-3 w-3 text-[#c8a27d]" /> Melody Tempo:
              </span>
              <span className="font-semibold text-[#c8a27d]">{tempo} BPM</span>
            </div>
            <input
              type="range"
              min="80"
              max="150"
              value={tempo}
              onChange={handleTempoChange}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
