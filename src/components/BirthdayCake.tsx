import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Flame, Cake, RefreshCw, Volume2 } from "lucide-react";

interface BirthdayCakeProps {
  onAllCandlesBlown: () => void;
}

export function BirthdayCake({ onAllCandlesBlown }: BirthdayCakeProps) {
  const [candles, setCandles] = useState([
    { id: 1, lit: true, angle: -15, height: 45 },
    { id: 2, lit: true, angle: -5, height: 55 },
    { id: 3, lit: true, angle: 5, height: 50 },
    { id: 4, lit: true, angle: 15, height: 55 },
    { id: 5, lit: true, angle: 25, height: 45 },
  ]);

  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState("");
  const [blowLevel, setBlowLevel] = useState(0);
  const [cakeEaten, setCakeEaten] = useState(false);
  const [wishesPrompt, setWishesPrompt] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check if all candles are blown
  const allBlown = candles.every((c) => !c.lit);

  useEffect(() => {
    if (allBlown && !cakeEaten) {
      setWishesPrompt(true);
      playFanfareSound();
      onAllCandlesBlown();
      stopMicrophone();
    }
  }, [candles, allBlown]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, []);

  // Simple Synthesized Sound Effects
  const playBlowSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Slide frequency down to sound like a breath/puff
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  };

  const playFanfareSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [261.63, 329.63, 392.00, 523.25]; // C Major chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });
    } catch (e) {}
  };

  // Blow out candle handler
  const blowCandle = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id === id && c.lit) {
          playBlowSound();
          return { ...c, lit: false };
        }
        return c;
      })
    );
  };

  const blowAllCandles = () => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.lit) playBlowSound();
        return { ...c, lit: false };
      })
    );
  };

  const resetCandles = () => {
    setCandles([
      { id: 1, lit: true, angle: -15, height: 45 },
      { id: 2, lit: true, angle: -5, height: 55 },
      { id: 3, lit: true, angle: 5, height: 50 },
      { id: 4, lit: true, angle: 15, height: 55 },
      { id: 5, lit: true, angle: 25, height: 45 },
    ]);
    setCakeEaten(false);
    setWishesPrompt(false);
  };

  // Microphone Control
  const startMicrophone = async () => {
    try {
      setMicError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      source.connect(analyser);

      setMicActive(true);
      monitorBlowing();
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setMicError("Microphone permission denied. Try clicking on the flames to blow them out!");
      setMicActive(false);
    }
  };

  const stopMicrophone = () => {
    setMicActive(false);
    setBlowLevel(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  // Monitor microphone sound volume
  const monitorBlowing = () => {
    if (!analyserRef.current || !micActive) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkBlow = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate simple average frequency magnitude
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      
      // Map to blowing scale (0 to 100)
      const mappedLevel = Math.min(100, Math.floor((average / 120) * 100));
      setBlowLevel(mappedLevel);

      // If average volume matches high blowing threshold
      if (mappedLevel > 55) {
        // Find the first lit candle and blow it out
        setCandles((prev) => {
          const firstLit = prev.find((c) => c.lit);
          if (firstLit) {
            playBlowSound();
            return prev.map((c) => (c.id === firstLit.id ? { ...c, lit: false } : c));
          }
          return prev;
        });
      }

      animationFrameRef.current = requestAnimationFrame(checkBlow);
    };

    animationFrameRef.current = requestAnimationFrame(checkBlow);
  };

  // Toggle microphone
  const toggleMic = () => {
    if (micActive) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-md w-full relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-4 left-4 text-amber-300 opacity-40 animate-pulse text-xl">✨</div>
      <div className="absolute bottom-6 right-6 text-pink-300 opacity-30 animate-pulse text-lg">🌸</div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-normal font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0d8d0] to-[#bca380]">
          {allBlown ? "Make a Wish, Divyanshi! 💫" : "Divyanshi's Birthday Cake 🎂"}
        </h3>
        <p className="text-xs text-white/50 mt-1.5 font-light">
          {allBlown 
            ? "All candles are blown out! A sweet, magical year awaits." 
            : "Blow into your mic or click on the flames to blow them out!"}
        </p>
      </div>

      {/* Cake Stage */}
      <div className="w-full aspect-[4/3] flex items-end justify-center relative select-none pb-4">
        {/* Dynamic Candles Container */}
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 w-48 h-28 flex items-end justify-between px-2 z-20">
          {candles.map((c) => (
            <div
              key={c.id}
              onClick={() => blowCandle(c.id)}
              className="flex flex-col items-center cursor-pointer transform hover:scale-115 transition-all duration-300"
              style={{
                transform: `translateX(${(c.id - 3) * 6}px) rotate(${c.angle}deg)`,
                height: `${c.height}px`,
              }}
            >
              {/* Flame element */}
              {c.lit ? (
                <div className="relative w-5 h-8 -mt-8 flex justify-center items-end animate-bounce">
                  <div className="absolute w-3 h-6 bg-amber-500 rounded-full blur-[1px] animate-pulse" />
                  <div className="absolute w-2.5 h-4.5 bg-yellow-300 rounded-full" />
                  <div className="absolute w-1.5 h-2 bg-orange-400 rounded-full" />
                  <Flame className="absolute text-yellow-100 h-6 w-6 stroke-1 scale-110 opacity-70 animate-pulse" />
                </div>
              ) : (
                /* Smoke effect */
                <div className="relative w-1 h-8 -mt-8 bg-transparent">
                  <div className="absolute top-0 left-0 w-2 h-6 bg-slate-300/20 rounded-full animate-smoke-rise blur-[2px]" />
                </div>
              )}

              {/* Candle Stick */}
              <div
                className={`w-3.5 rounded-t-sm h-full shadow-inner border-r border-white/5 ${
                  c.id % 2 === 0
                    ? "bg-gradient-to-t from-[#c8a27d] to-[#fef08a]"
                    : "bg-gradient-to-t from-[#92400e] to-[#c8a27d]"
                }`}
                style={{
                  backgroundSize: "100% 12px",
                  backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 6px)",
                }}
              />
              {/* Wick */}
              <div className="w-0.5 h-2.5 bg-zinc-800" />
            </div>
          ))}
        </div>

        {/* Beautiful Multi-tier Cake SVG Graphic */}
        <div className="w-64 z-10 transition-transform duration-500 transform hover:scale-[1.02]">
          <svg viewBox="0 0 200 160" className="w-full h-auto drop-shadow-xl">
            {/* Cake Base Stand */}
            <ellipse cx="100" cy="142" rx="90" ry="12" fill="#1f1a16" />
            <ellipse cx="100" cy="140" rx="85" ry="10" fill="#2d251f" />
            <rect x="35" y="140" width="130" height="4" fill="#bca380" />

            {/* Bottom Tier */}
            <rect x="30" y="90" width="140" height="48" rx="8" fill="#211310" /> {/* Dark Velvet */}
            <ellipse cx="100" cy="90" rx="70" ry="8" fill="#3d211a" />
            <ellipse cx="100" cy="138" rx="70" ry="8" fill="#2e1a16" />
            
            {/* Frosting Drops bottom tier */}
            <path d="M 30,90 Q 40,104 50,90 Q 60,105 70,90 Q 80,105 90,90 Q 100,106 110,90 Q 120,104 130,90 Q 140,105 150,90 Q 160,104 170,90" fill="#3d211a" />
            
            {/* Top Tier */}
            <rect x="50" y="50" width="100" height="40" rx="6" fill="#31191a" /> {/* Rich Burgundy Chocolate */}
            <ellipse cx="100" cy="50" rx="50" ry="6" fill="#c8a27d" /> {/* Gold Caramel Cream */}
            <ellipse cx="100" cy="90" rx="50" ry="6" fill="#452426" />
            
            {/* Frosting Drops top tier */}
            <path d="M 50,50 Q 60,60 70,50 Q 80,62 90,50 Q 100,60 110,50 Q 120,62 130,50 Q 140,60 150,50" fill="#c8a27d" />
            
            {/* Sprinkles on Top */}
            <circle cx="65" cy="52" r="2" fill="#eab308" />
            <circle cx="85" cy="51" r="1.5" fill="#fbcfe8" />
            <circle cx="105" cy="53" r="2" fill="#ffffff" />
            <circle cx="125" cy="51" r="1.5" fill="#c8a27d" />
            <circle cx="135" cy="52" r="2" fill="#eab308" />

            <circle cx="70" cy="92" r="2" fill="#eab308" />
            <circle cx="95" cy="93" r="1.8" fill="#ffffff" />
            <circle cx="120" cy="91" r="2.2" fill="#c8a27d" />
            <circle cx="145" cy="93" r="1.5" fill="#eab308" />
          </svg>
        </div>
      </div>

      {/* Mic Blowing Level Meter */}
      {micActive && !allBlown && (
        <div className="w-full mt-2 mb-4 px-4">
          <div className="flex justify-between items-center text-xs text-[#c8a27d] mb-1">
            <span className="flex items-center gap-1">
              <Volume2 className="h-3.5 w-3.5 animate-pulse text-amber-400" />
              Blow Intensity:
            </span>
            <span className="font-mono">{blowLevel}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-75 ${
                blowLevel > 55 ? "bg-amber-400" : "bg-gradient-to-r from-amber-600 to-[#c8a27d]"
              }`}
              style={{ width: `${blowLevel}%` }}
            />
          </div>
        </div>
      )}

      {/* Controls Container */}
      <div className="flex flex-col items-center w-full gap-3 mt-4">
        {micError && (
          <p className="text-[10px] text-amber-300 text-center bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-900/50">
            {micError}
          </p>
        )}

        <div className="flex justify-center gap-3 w-full">
          {!allBlown ? (
            <>
              {/* Mic Toggle Button */}
              <button
                id="mic-btn"
                onClick={toggleMic}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                  micActive
                    ? "bg-rose-900/80 hover:bg-rose-800 text-white border border-rose-700/50"
                    : "bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
                }`}
              >
                {micActive ? (
                  <>
                    <Mic className="h-3.5 w-3.5 animate-pulse" /> Stop Mic
                  </>
                ) : (
                  <>
                    <MicOff className="h-3.5 w-3.5" /> Use Mic Blow
                  </>
                )}
              </button>

              {/* Instant Blow Button */}
              <button
                id="instant-blow"
                onClick={blowAllCandles}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-gradient-to-r from-amber-600 to-[#c8a27d] hover:brightness-110 text-black shadow-lg shadow-amber-950/20 transition-all duration-300 cursor-pointer"
              >
                <Flame className="h-3.5 w-3.5" /> Blow All
              </button>
            </>
          ) : (
            /* Reset button when blown out */
            <button
              id="reset-cake-btn"
              onClick={resetCandles}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/80 border border-white/15 transition-all duration-300 shadow-sm cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Light Candles Again
            </button>
          )}
        </div>

        {/* Celebrate slice offering */}
        {allBlown && (
          <div className="mt-4 p-3 bg-white/[0.02] rounded-2xl border border-white/10 flex items-center gap-3 w-full animate-fade-in animate-scale-up">
            <Cake className="h-10 w-10 text-amber-400 flex-shrink-0 animate-bounce" />
            <div className="text-left">
              <h5 className="text-sm font-semibold text-[#c8a27d] font-serif">Here's your virtual slice! 🍰</h5>
              <p className="text-[11px] text-white/60 leading-relaxed font-light">
                Sweet like golden honey caramel, soft like rich chocolate velvet. May your year ahead be sweet, Divyanshi!
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes smoke-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-40px) scale(2.5);
            opacity: 0;
          }
        }
        .animate-smoke-rise {
          animation: smoke-rise 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-up {
          animation: fade-in-scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
