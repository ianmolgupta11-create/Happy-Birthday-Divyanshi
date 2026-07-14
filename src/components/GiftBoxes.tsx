import React, { useState } from "react";
import { Gift, Heart, Star, Compass, Sparkles, BookOpen, X, ChevronRight, ChevronLeft } from "lucide-react";

interface ScrollWish {
  title: string;
  lines: string[];
}

const PRELOADED_SCROLLS: ScrollWish[] = [
  {
    title: "दुआओं की बहार 🌸",
    lines: [
      "फूलों की वादियों में बसेरा हो आपका,",
      "तारों के आंगन में सवेरा हो आपका.",
      "दुआ है हमारी किसी अपने की तरफ से,",
      "खुशियों से सदा भरा रहे दामन आपका.",
      "",
      "जन्मदिन की ढेरों मुबारकबाद Divyanshi! ✨"
    ]
  },
  {
    title: "Celestial Blossom 🌟",
    lines: [
      "May your laughter ring out like chime bells,",
      "May your paths be guided by golden stars.",
      "May you blossom into your dream-self,",
      "Free from worries, celebrating who you are.",
      "",
      "Happy Birthday to our brightest star, Divyanshi! 💫"
    ]
  },
  {
    title: "एक ख़ास शायरी 📝",
    lines: [
      "सदा मुस्कुराती रहे ये प्यारी सी सूरत,",
      "हर दिन लाए आपके जीवन में नई मूरत.",
      "खुदा करे आपको वो सब कुछ मिले,",
      "जिसकी भी दिल में आपके जागे ज़रुरत.",
      "",
      "Wishing you the sweetest birthday ever! 💖"
    ]
  }
];

const COMPLIMENTS = [
  { text: "Radiant Smile ✨", desc: "A smile that instantly lights up any room and brings endless warmth." },
  { text: "Kindest Heart 🌸", desc: "A gentle soul who always cares and brings comfort to people around her." },
  { text: "Dreamer Soul 🌙", desc: "An imaginative mind filled with starry hopes and beautiful creative thoughts." },
  { text: "Brilliant Mind 🧠", desc: "Wise, sharp, and talented in everything she sets her heart on." },
  { text: "Magical Aura 🌟", desc: "A sparkling, joyful presence that makes everyone feel happy and loved." },
  { text: "Uniquely You 🎨", desc: "Original, authentic, and carrying a quiet confidence that is truly majestic." }
];

export function GiftBoxes() {
  const [activeGift, setActiveGift] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [complimentIndex, setComplimentIndex] = useState<number | null>(null);

  // Play a simple synthesized sound when a gift is opened
  const playOpenSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  };

  const handleOpenGift = (giftId: number) => {
    playOpenSound();
    setActiveGift(giftId);
    if (giftId === 1) setScrollIndex(0);
    if (giftId === 3) setComplimentIndex(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-normal font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0d8d0] to-[#bca380] flex items-center justify-center gap-2">
          <Gift className="h-6 w-6 text-amber-400 animate-bounce" /> Gifts of Love & Wishes 💖
        </h3>
        <p className="text-xs text-white/50 mt-1.5 font-light">
          Divyanshi, click on each gift box to reveal the secret treasures prepared for you!
        </p>
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gift 1: Wishes Scroll */}
        <div
          id="gift-1"
          onClick={() => handleOpenGift(1)}
          className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 hover:bg-white/[0.06]"
        >
          <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400 group-hover:rotate-12 transition-all duration-300">
            <BookOpen className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-normal font-serif text-white">The Wish Scrolls</h4>
          <p className="text-xs text-white/50 mt-2 font-light leading-relaxed">
            A treasure chest of sweet, lyrical wishes and shayaris written from the heart.
          </p>
          <span className="mt-4 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 bg-pink-500/10 text-pink-300 rounded-full group-hover:bg-pink-500/20 transition-colors">
            Tap to Open ✨
          </span>
        </div>

        {/* Gift 2: Magical Starry Dreamscape */}
        <div
          id="gift-2"
          onClick={() => handleOpenGift(2)}
          className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 hover:bg-white/[0.06]"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 text-amber-400 group-hover:scale-110 transition-all duration-300">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
          <h4 className="text-lg font-normal font-serif text-white">Dream Lantern</h4>
          <p className="text-xs text-white/50 mt-2 font-light leading-relaxed">
            A beautiful, magical interactive visual dreamscape crafted especially for Divyanshi.
          </p>
          <span className="mt-4 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 bg-amber-500/10 text-amber-300 rounded-full group-hover:bg-amber-500/20 transition-colors">
            Tap to Open ✨
          </span>
        </div>

        {/* Gift 3: Compliments Jar */}
        <div
          id="gift-3"
          onClick={() => handleOpenGift(3)}
          className="group cursor-pointer bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-6 flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 hover:bg-white/[0.06]"
        >
          <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4 text-violet-400 group-hover:-translate-y-1 transition-all duration-300">
            <Heart className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-normal font-serif text-white">Jar of Compliments</h4>
          <p className="text-xs text-white/50 mt-2 font-light leading-relaxed">
            A magical jar of glowing orbs. Each orb describes a super cute trait of Divyanshi.
          </p>
          <span className="mt-4 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 bg-violet-500/10 text-violet-300 rounded-full group-hover:bg-violet-500/20 transition-colors">
            Tap to Open ✨
          </span>
        </div>
      </div>

      {/* POP-UPS */}
      {activeGift !== null && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-4">
          <div className="bg-[#0d0705] rounded-3xl border border-white/10 max-w-lg w-full overflow-hidden shadow-2xl relative animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveGift(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* POP-UP 1: Wish Scrolls */}
            {activeGift === 1 && (
              <div className="p-8 flex flex-col items-center bg-gradient-to-b from-amber-950/20 to-[#0d0705]">
                <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-normal text-white mb-6 font-serif tracking-tight text-center">
                  {PRELOADED_SCROLLS[scrollIndex].title}
                </h4>
                
                {/* Scroll Content Paper */}
                <div className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-6 min-h-[180px] shadow-inner text-center flex flex-col justify-center relative">
                  <div className="absolute top-2 left-2 text-[#c8a27d]/30">📜</div>
                  <div className="absolute bottom-2 right-2 text-[#c8a27d]/30">📜</div>
                  
                  {PRELOADED_SCROLLS[scrollIndex].lines.map((line, idx) => (
                    <p
                      key={idx}
                      className={`${
                        line === "" ? "my-2" : "my-0.5 text-sm font-light"
                      } text-white/90 font-sans tracking-wide leading-relaxed`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center w-full mt-6">
                  <button
                    disabled={scrollIndex === 0}
                    onClick={() => setScrollIndex((p) => p - 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-white/80 disabled:opacity-20 disabled:pointer-events-none hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-xs text-white/40 font-mono">
                    {scrollIndex + 1} of {PRELOADED_SCROLLS.length}
                  </span>
                  <button
                    disabled={scrollIndex === PRELOADED_SCROLLS.length - 1}
                    onClick={() => setScrollIndex((p) => p + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-white/80 disabled:opacity-20 disabled:pointer-events-none hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* POP-UP 2: Magical Starry Dreamscape */}
            {activeGift === 2 && (
              <div className="p-8 flex flex-col items-center bg-[#050302] text-white min-h-[400px] justify-between relative overflow-hidden">
                {/* Custom CSS/SVG Glowing Starry Night Garden */}
                <div className="absolute inset-0 opacity-45 pointer-events-none">
                  {/* Floating particles */}
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-75" />
                  <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-500" />
                  <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                </div>

                <div className="flex flex-col items-center text-center z-10 w-full">
                  <h4 className="text-xl font-normal font-serif text-amber-300 mb-2 flex items-center gap-1.5 justify-center">
                    <Star className="h-5 w-5 fill-current" /> Divyanshi's Dream Lantern ✨
                  </h4>
                  <p className="text-xs text-white/50 max-w-sm mb-6 font-light">
                    A celestial window showing warm glowing dreams under a protective, beautiful moon.
                  </p>

                  {/* Stunning Custom SVG Drawing */}
                  <div className="w-56 h-56 rounded-full bg-[#130d0a] border border-white/10 shadow-inner overflow-hidden relative flex items-center justify-center animate-pulse">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Starry stars */}
                      <circle cx="20" cy="15" r="0.8" fill="#fff" opacity="0.8" />
                      <circle cx="75" cy="20" r="0.6" fill="#fff" opacity="0.9" />
                      <circle cx="85" cy="45" r="0.8" fill="#fff" opacity="0.7" />
                      <circle cx="15" cy="55" r="0.5" fill="#fff" opacity="0.6" />
                      <circle cx="50" cy="35" r="0.7" fill="#fff" opacity="0.95" />

                      {/* Weeping Willow Lantern Silhouettes */}
                      <path d="M10,0 Q25,30 20,60 Q15,80 0,90" stroke="#000000" strokeWidth="2" fill="none" />
                      <path d="M90,0 Q75,25 80,55 Q85,75 100,85" stroke="#000000" strokeWidth="2" fill="none" />

                      {/* Glowing lantern line & bulb */}
                      <line x1="35" y1="0" x2="35" y2="45" stroke="#334155" strokeWidth="0.8" />
                      <ellipse cx="35" cy="45" rx="5" ry="7" fill="#fbbf24" opacity="0.3" className="animate-pulse" />
                      <rect x="32" y="42" width="6" height="8" rx="2" fill="#f59e0b" />
                      <circle cx="35" cy="46" r="3.5" fill="#fff" className="animate-pulse" />

                      {/* Second Hanging Lantern */}
                      <line x1="62" y1="0" x2="62" y2="35" stroke="#334155" strokeWidth="0.8" />
                      <ellipse cx="62" cy="35" rx="4" ry="6" fill="#ec4899" opacity="0.3" className="animate-pulse" />
                      <rect x="59.5" y="32.5" width="5" height="7" rx="1.5" fill="#db2777" />
                      <circle cx="62" cy="36" r="2.8" fill="#fff" />

                      {/* Beautiful Glowing Moon */}
                      <circle cx="50" cy="20" r="10" fill="#fef08a" opacity="0.25" />
                      <circle cx="50" cy="20" r="8" fill="#fef9c3" />
                      
                      {/* Hill and beautiful floral silhouette */}
                      <path d="M -10,95 Q 30,80 50,85 Q 70,90 110,80 L 110,110 L -10,110 Z" fill="#000000" />
                      <path d="M 15,85 Q 35,70 65,75 Q 85,80 110,70 L 110,110 L 15,110 Z" fill="#0c0705" opacity="0.8" />

                      {/* Glowing Fireflies */}
                      <circle cx="28" cy="72" r="1.5" fill="#a7f3d0" className="animate-ping" style={{ animationDuration: "3s" }} />
                      <circle cx="74" cy="65" r="1" fill="#fef08a" className="animate-ping" style={{ animationDuration: "2s" }} />
                      <circle cx="48" cy="60" r="1.2" fill="#c084fc" className="animate-ping" style={{ animationDuration: "4s" }} />
                    </svg>
                  </div>
                </div>

                <div className="z-10 mt-6 bg-white/[0.01] p-4 rounded-2xl border border-white/5 text-center max-w-sm">
                  <p className="text-xs text-amber-200/90 italic font-sans leading-relaxed font-light">
                    "Like this moonlit lantern, may you always stand strong, shining warm and radiant, guiding happiness into your own life and of those who cherish you, Divyanshi." 🌸
                  </p>
                </div>
              </div>
            )}

            {/* POP-UP 3: Compliments Jar */}
            {activeGift === 3 && (
              <div className="p-8 flex flex-col items-center bg-gradient-to-b from-violet-950/20 to-[#0d0705] min-h-[380px] justify-between">
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h4 className="text-2xl font-normal text-white mb-2 font-serif">Jar of Orbs ✨</h4>
                  <p className="text-xs text-white/50 max-w-xs mb-6 font-light leading-relaxed">
                    Click on any glowing orb inside Divyanshi's personality jar to release a sweet compliment!
                  </p>

                  {/* Orbs Selector */}
                  <div className="flex flex-wrap justify-center gap-2 max-w-sm mb-6">
                    {COMPLIMENTS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playOpenSound();
                          setComplimentIndex(idx);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 transform active:scale-95 border cursor-pointer ${
                          complimentIndex === idx
                            ? "bg-gradient-to-r from-violet-600 to-[#c8a27d] text-white border-none shadow-md scale-103"
                            : "bg-white/5 hover:bg-white/10 text-white border-white/10 shadow-sm"
                        }`}
                      >
                        🔮 Orb {idx + 1}: {item.text.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  {/* Display active Compliment */}
                  <div className="w-full min-h-[100px] flex items-center justify-center">
                    {complimentIndex !== null ? (
                      <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl text-center animate-scale-up w-full max-w-xs shadow-sm">
                        <Star className="h-5 w-5 text-violet-400 fill-current mx-auto mb-2 animate-bounce" />
                        <h5 className="text-sm font-medium text-violet-300 font-serif">{COMPLIMENTS[complimentIndex].text}</h5>
                        <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-light">{COMPLIMENTS[complimentIndex].desc}</p>
                      </div>
                    ) : (
                      <div className="text-xs text-white/30 italic font-light">
                        Select an orb from above to reveal its magic...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
