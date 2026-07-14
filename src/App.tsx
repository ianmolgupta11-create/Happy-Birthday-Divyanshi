/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Mail, Heart, Sparkles, Star, Calendar, Music, Cake, Gift } from "lucide-react";
import { BirthdaySynth } from "./utils/audioSynth";
import { ConfettiRain } from "./components/Confetti";
import { BirthdayCake } from "./components/BirthdayCake";
import { GiftBoxes } from "./components/GiftBoxes";
import { BirthdayCard } from "./components/BirthdayCard";
import { MusicPlayer } from "./components/MusicPlayer";

interface Balloon {
  id: number;
  left: number;
  size: number;
  opacity: number;
  delay: number;
  speed: number;
  colorIndex: number;
  popped: boolean;
}

interface PopIndicator {
  id: number;
  x: number;
  y: number;
}

const BALLOON_COLORS = [
  { bg: "from-pink-500 to-rose-400", shadow: "shadow-pink-500/20", light: "bg-pink-300/40", string: "bg-pink-500/30" },
  { bg: "from-amber-500 to-yellow-400", shadow: "shadow-amber-500/20", light: "bg-amber-300/40", string: "bg-amber-500/30" },
  { bg: "from-violet-500 to-purple-400", shadow: "shadow-violet-500/20", light: "bg-violet-300/40", string: "bg-violet-500/30" },
  { bg: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/20", light: "bg-emerald-300/40", string: "bg-emerald-500/30" },
  { bg: "from-sky-500 to-blue-400", shadow: "shadow-sky-500/20", light: "bg-sky-300/40", string: "bg-sky-500/30" },
  { bg: "from-red-500 to-rose-500", shadow: "shadow-red-500/20", light: "bg-red-300/40", string: "bg-red-500/30" },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAutoplayTriggered, setIsAutoplayTriggered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [popCount, setPopCount] = useState(() => {
    return parseInt(localStorage.getItem("balloon_pop_count") || "0", 10);
  });
  const [popIndicators, setPopIndicators] = useState<PopIndicator[]>([]);
  
  // Singleton instance of BirthdaySynth
  const synthRef = useRef<BirthdaySynth>(new BirthdaySynth());

  // Set up balloon generation and interval
  useEffect(() => {
    // Generate initial set of beautiful balloons
    const list: Balloon[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 85 + 5, // keep away from edges
      size: Math.random() * 15 + 42, // size between 42px and 57px
      opacity: Math.random() * 0.25 + 0.65, // gorgeous translucent glow
      delay: Math.random() * 6,
      speed: Math.random() * 5 + 7, // rise time 7 to 12s
      colorIndex: Math.floor(Math.random() * BALLOON_COLORS.length),
      popped: false,
    }));
    setBalloons(list);

    // Continuous interval to spawn new balloons if count gets lower
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const now = Date.now();
        // Self-clean old offscreen balloons (older than 22 seconds)
        const active = prev.filter((b) => !b.popped && (now - b.id < 22000));
        
        if (active.length < 12) {
          const newBalloon: Balloon = {
            id: Date.now() + Math.random(),
            left: Math.random() * 85 + 5,
            size: Math.random() * 15 + 42,
            opacity: Math.random() * 0.25 + 0.65,
            delay: 0,
            speed: Math.random() * 5 + 7,
            colorIndex: Math.floor(Math.random() * BALLOON_COLORS.length),
            popped: false,
          };
          return [...active, newBalloon];
        }
        return active;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const playPopSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Fun bubble pop frequency transition
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePopBalloon = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    playPopSound();
    
    // Set pop location indicator
    const newIndicator: PopIndicator = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setPopIndicators((prev) => [...prev, newIndicator]);
    
    // Clear pop indicator
    setTimeout(() => {
      setPopIndicators((prev) => prev.filter((ind) => ind.id !== newIndicator.id));
    }, 800);

    // Trigger local splash of confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 800);

    // Update balloon state
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Save popped score
    setPopCount((prev) => {
      const next = prev + 1;
      localStorage.setItem("balloon_pop_count", next.toString());
      return next;
    });
  };

  const handleOpenCelebration = () => {
    setShowConfetti(true);
    setIsOpen(true);
    setIsAutoplayTriggered(true);
    
    // Auto reset confetti after 6 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const handleCakeBlown = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white relative overflow-x-hidden font-sans select-none">
      
      {/* Elegant Dark Background Ambient Spot Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Warm Wine/Rose-gold Ambient Glow Top-Left */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,_#3a1510_0%,_transparent_70%)] opacity-70 blur-3xl" />
        {/* Soft Violet/Indigo Ambient Glow Bottom-Right */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,_#140d2e_0%,_transparent_70%)] opacity-55 blur-3xl" />
        
        {/* Sparkle background stars */}
        <div className="absolute top-[20%] right-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#fff]" />
        <div className="absolute top-[40%] left-[10%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_6px_#fff] opacity-60" />
        <div className="absolute bottom-[30%] right-[40%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff] opacity-80" />
        <div className="absolute top-[60%] left-[60%] w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_#fff]" />
      </div>

      {/* Floating Balloons (Click to Pop!) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {balloons.map((b) => (
          <div
            key={b.id}
            onClick={(e) => handlePopBalloon(b.id, e)}
            className="absolute bottom-0 cursor-pointer pointer-events-auto select-none transition-transform hover:scale-110 active:scale-95 animate-balloon-rise"
            style={{
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.speed}s`,
              opacity: b.popped ? 0 : b.opacity,
              pointerEvents: b.popped ? "none" : "auto",
            }}
          >
            <div 
              className={`relative rounded-full bg-gradient-to-tr ${BALLOON_COLORS[b.colorIndex].bg} border border-white/10 shadow-lg ${BALLOON_COLORS[b.colorIndex].shadow}`}
              style={{
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
              }}
            >
              {/* Shine Highlight */}
              <div className={`absolute top-2 left-2 w-3 h-4 ${BALLOON_COLORS[b.colorIndex].light} rounded-full blur-[1px]`} />
              
              {/* Translucent triangle string-tie at bottom */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-[6px] border-l-transparent border-r-transparent border-t-white/40" />
              
              {/* Balloon string dangling */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[1.5px] h-14 ${BALLOON_COLORS[b.colorIndex].string}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Floating "+1 🎈" Pop Indicators */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {popIndicators.map((ind) => (
          <div
            key={ind.id}
            className="absolute text-xs font-bold text-amber-300 font-mono select-none animate-float-up-fade"
            style={{
              left: `${ind.x}px`,
              top: `${ind.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            🎈 Pop! +1
          </div>
        ))}
      </div>

      {/* Confetti Controller */}
      <ConfettiRain active={showConfetti} durationMs={6000} />

      {/* COVER / LETTER SCREEN */}
      {!isOpen ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 z-10 relative">
          
          {/* Pulsing decorative stars */}
          <div className="absolute top-20 left-12 text-[#f59e0b] opacity-40 animate-pulse text-2xl">✨</div>
          <div className="absolute bottom-24 right-16 text-[#fda4af] opacity-40 animate-pulse text-xl">🌸</div>
          <div className="absolute top-1/3 right-1/4 text-purple-300 opacity-45 animate-pulse text-lg">💫</div>

          <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl text-center flex flex-col items-center relative animate-fade-in-up">
            
            <div className="absolute -top-10 bg-gradient-to-tr from-[#3a1510] to-[#ec4899] text-white p-4 rounded-3xl shadow-lg border border-white/10 animate-bounce">
              <Mail className="h-10 w-10 stroke-1" />
            </div>

            <div className="mt-8 mb-6">
              <h2 className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase font-mono">Special Invitation</h2>
              <h1 className="text-4xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ccc] mt-3 tracking-tight">
                Divyanshi
              </h1>
              <p className="text-xs text-rose-300/70 mt-2 font-medium tracking-wide">
                A customized stargazing starry window of wishes is waiting to unfold...
              </p>
            </div>

            {/* Letter graphic */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-inner text-slate-300 text-center mb-6 leading-relaxed">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-pink-400 font-mono">Unfolding Letter</p>
              <h3 className="text-sm font-bold text-white mt-1.5 mb-2 font-serif">Happy Birthday, Divyanshi!</h3>
              <p className="text-xs font-light text-white/70 leading-relaxed">
                "To the one who brings light into every room. Today is a celebration of the grace, intelligence, and kindness you share."
              </p>
            </div>

            {/* Sound Prompt & Open Buttons */}
            <div className="w-full flex flex-col gap-3">
              <p className="text-[10px] font-mono text-amber-200/80 flex items-center justify-center gap-1.5 uppercase tracking-widest mb-1 animate-pulse">
                <span>🔊</span> Recommendation: Turn on sound for full magic!
              </p>
              
              <button
                id="open-letter-sound-btn"
                onClick={() => {
                  synthRef.current.init();
                  handleOpenCelebration();
                }}
                className="w-full py-3.5 rounded-2xl font-bold text-xs tracking-widest uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Music className="h-4 w-4 text-white animate-bounce" /> Enable Music & Enter 💖
              </button>
              
              <button
                id="open-letter-silent-btn"
                onClick={() => {
                  setIsOpen(true);
                  setIsAutoplayTriggered(false);
                }}
                className="w-full py-2.5 rounded-2xl font-semibold text-[10px] tracking-widest uppercase bg-white/5 hover:bg-white/10 text-white/50 border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>🔇</span> Enter Silently
              </button>
            </div>
            
          </div>
        </div>
      ) : (
        /* MAIN DASHBOARD SCREEN */
        <div className="max-w-6xl mx-auto px-6 py-12 z-10 relative flex flex-col min-h-screen">
          
          {/* Header */}
          <div className="text-center mb-14 flex flex-col items-center animate-fade-in">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/[0.04] text-white/70 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] mb-4 shadow-sm animate-pulse">
              <Calendar className="h-3.5 w-3.5 text-rose-400" /> Special Edition • July 14
            </div>
            
            <div className="mb-2">
              <span className="text-[#e0d8d0] italic text-2xl font-serif font-light opacity-80">Happy Birthday</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-normal tracking-tight bg-gradient-to-b from-white via-white to-[#999] bg-clip-text text-transparent select-text">
              Divyanshi
            </h1>

            <p className="text-xs text-white/50 mt-4 max-w-md font-light leading-relaxed">
              Today is a celebration of the grace, intelligence, and kindness you share with the world. May your year be as extraordinary as you are.
            </p>

            {/* Elegant Column Dividers and Interactive Popper HUD */}
            <div className="flex flex-wrap gap-6 md:gap-12 items-center justify-center mt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-white opacity-25"></div>
                <div className="text-[9px] tracking-[0.25em] uppercase opacity-50 font-medium">Elegance</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-white opacity-25"></div>
                <div className="text-[9px] tracking-[0.25em] uppercase opacity-50 font-medium">Brilliance</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-white opacity-25"></div>
                <div className="text-[9px] tracking-[0.25em] uppercase opacity-50 font-medium">Joy</div>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl px-5 py-2 transition-all shadow-lg animate-fade-in-up">
                <div className="text-[#f59e0b] font-mono text-sm font-extrabold flex items-center gap-1.5">
                  🎈 {popCount}
                </div>
                <div className="text-[8px] tracking-[0.15em] uppercase opacity-70 font-semibold text-amber-300">Popped Balloons</div>
              </div>
            </div>
          </div>

          {/* Bento Grid Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
            
            {/* Left Column: Cake Blowing Ritual */}
            <div className="flex justify-center w-full animate-fade-in" style={{ animationDelay: "150ms" }}>
              <BirthdayCake onAllCandlesBlown={handleCakeBlown} />
            </div>

            {/* Right Column: Music Player Controls */}
            <div className="flex justify-center w-full animate-fade-in" style={{ animationDelay: "300ms" }}>
              <MusicPlayer
                synth={synthRef.current}
                isAutoplayTriggered={isAutoplayTriggered}
              />
            </div>

            {/* Birthday Card - Full width span for elegant presentation */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "450ms" }}>
              <BirthdayCard />
            </div>

            {/* Gifts Dashboard - Full width span */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <GiftBoxes />
            </div>

          </div>

          {/* Premium elegant footer */}
          <footer className="mt-auto text-center pt-8 border-t border-white/5 text-[10px] text-white/40 font-mono tracking-[0.15em] uppercase">
            <p className="flex items-center justify-center gap-1.5">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-current animate-pulse" /> Created with love for you
            </p>
          </footer>
        </div>
      )}

      <style>{`
        /* Floating swaying balloons rise */
        @keyframes balloon-rise {
          0% {
            transform: translateY(105vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          35% {
            transform: translateY(65vh) translateX(12px) rotate(3deg);
          }
          65% {
            transform: translateY(35vh) translateX(-12px) rotate(-3deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
        }
        .animate-balloon-rise {
          animation-name: balloon-rise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        /* Float up fade for pop indicators */
        @keyframes float-up-fade {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(0.85);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-65px) scale(1.15);
            opacity: 0;
          }
        }
        .animate-float-up-fade {
          animation: float-up-fade 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Generic fade-in animation */
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Envelope card entry */
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}

