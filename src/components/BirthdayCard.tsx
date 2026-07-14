import React, { useState } from "react";
import { Heart, Sparkles, ChevronLeft, ChevronRight, Check, Copy, Palette, MailOpen, BookOpen, Star, Sparkle } from "lucide-react";

interface PrewrittenWish {
  title: string;
  poem: string;
  author: string;
  emoji: string;
}

const PREWRITTEN_WISHES: PrewrittenWish[] = [
  {
    title: "काव्यात्मक दुआ • Celestial Harmony",
    poem: "खुशियों की महक से महकता रहे जीवन तुम्हारा,\nहर तारा तुम्हारी राहों को रोशन करे सारा।\nतुम वो खूबसूरत एहसास हो इस जहाँ का,\nजिसकी हँसी देख मुस्कुराए ये आसमाँ सारा। ✨\n\nजन्मदिन की अनंत और असीम शुभकामनाएं, दिव्यांशी!",
    author: "दिल की कलम से",
    emoji: "🌙"
  },
  {
    title: "Starlight Blessings • तारों का आशीर्वाद",
    poem: "Like the warm golden glow of a quiet bonfire,\nMay your presence always inspire.\nMay your laughter ring through every beautiful hour,\nAnd your dreams unfold like a magnificent flower.\n\nHappy Birthday, Divyanshi! May you shine forever.",
    author: "Written in the Stars",
    emoji: "✨"
  },
  {
    title: "चुलबुली और प्यारी चंचल बातें",
    poem: "हमेशा यूँ ही मुस्कुराती रहना,\nनाराज़गी की बातों पर बस हँसती रहना।\nतुम वो खुशबूदार बहार हो सबके जीवन की,\nजिसके बिना ये दुनिया लगती है सूनी और बेरंग!\n\nहैप्पी बर्थडे टू द मोस्ट अमेजिंग दिव्यांशी! 🎂",
    author: "आपकी मुस्कान से",
    emoji: "🌸"
  },
  {
    title: "Infinite Joy • अनंत खुशियाँ",
    poem: "May your kindness be rewarded with infinite grace,\nAnd may sorrow never find a path to your face.\nTo a soul so rare, gentle, and divine,\nMay this brand new year beautifully align!\n\nCelebrate your magic today, dear Divyanshi! 💫",
    author: "With Love & Light",
    emoji: "💝"
  }
];

export function BirthdayCard() {
  const [activeTab, setActiveTab] = useState<"deck" | "letter">("deck");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState("#c8a27d"); // Gold theme by default
  const [sealSelected, setSealSelected] = useState("💖");
  const [sealRevealed, setSealRevealed] = useState(false);

  const customLetter = "Dear Divyanshi,\n\nYou are a rare and sparkling soul—a beautiful mix of stardust, kindness, and infinite magic. Your presence lights up every room, and your warm smile brings genuine joy to everyone around you.\n\nOn this beautiful day, may the universe align to grant your deepest desires, may your path be paved with infinite laughter, and may you always continue to shine with your radiant light.\n\nHappy Birthday! ✨";

  const SEALS = [
    { emoji: "💖", label: "Heart Seal" },
    { emoji: "✨", label: "Stardust Seal" },
    { emoji: "🌙", label: "Moonlit Seal" },
    { emoji: "🌸", label: "Floral Seal" },
    { emoji: "👑", label: "Royal Seal" }
  ];

  const THEME_COLORS = [
    { name: "Celestial Gold", hex: "#c8a27d" },
    { name: "Blossom Rose", hex: "#f43f5e" },
    { name: "Twilight Violet", hex: "#8b5cf6" },
    { name: "Cosmic Amber", hex: "#f59e0b" },
    { name: "Forest Emerald", hex: "#10b981" }
  ];

  const copyWish = () => {
    const current = PREWRITTEN_WISHES[currentIndex];
    const fullText = `✨ ${current.title} ✨\n\n${current.poem}\n\n— ${current.author}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playSfx("sparkle");
  };

  const playSfx = (type: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "sparkle") {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleTabChange = (tab: "deck" | "letter") => {
    setActiveTab(tab);
    playSfx("tab");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-500">
        
        {/* Animated glowing backdrops matching current card theme color */}
        <div 
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-1000 animate-pulse" 
          style={{ backgroundColor: `${cardTheme}20` }}
        />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-light font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e2d9cf] to-[#bca380] flex items-center justify-center gap-2">
            <MailOpen className="h-6 w-6 text-amber-400 animate-pulse" /> The Interactive Birthday Deck 💌
          </h3>
          <p className="text-xs text-white/50 mt-2 font-light max-w-md mx-auto">
            Flip through heartfelt blessings, custom style the envelope, and reveal the beautiful handwritten letter for Divyanshi.
          </p>
        </div>

        {/* Premium Sliding Navigation Tabs */}
        <div className="flex p-1 bg-black/40 border border-white/10 rounded-2xl mb-8 max-w-sm mx-auto">
          <button
            onClick={() => handleTabChange("deck")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "deck"
                ? "bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 text-amber-300 shadow-lg font-medium"
                : "text-white/60 hover:text-white"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Blessings Deck
          </button>
          <button
            onClick={() => handleTabChange("letter")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-serif tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "letter"
                ? "bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/30 text-amber-300 shadow-lg font-medium"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📜</span> Handwritten Letter
          </button>
        </div>

        {/* SECTION 1: PRE-WRITTEN CARD FLIPPER DECK */}
        {activeTab === "deck" && (
          <div className="animate-fade-in">
            {/* Funny Hinglish recommendation card */}
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3.5 text-xs text-amber-200/90 shadow-[0_4px_20px_rgba(245,158,11,0.05)] animate-pulse">
              <span className="text-xl shrink-0">🚨</span>
              <div className="flex-1 leading-relaxed">
                <span className="font-bold text-amber-300">सख्त चेतावनी (Strict Warning):</span> ये pre-written wishes तो बस एक ट्रेलर हैं! असली इमोशनल ब्लॉकबस्टर और ढेर सारा सीक्रेट प्यार तो ऊपर वाले <button onClick={() => handleTabChange("letter")} className="underline font-bold text-white hover:text-amber-300 transition-all cursor-pointer inline-flex items-center gap-0.5">Handwritten Letter 📜</button> वाले tab में छिपा है! जल्दी से वहाँ क्लिक करो वरना सारी stardust गायब हो जाएगी! 😉✨
              </div>
            </div>

            <div className="flex justify-between items-center mb-3.5 px-1">
              <span className="text-xs font-serif text-amber-200/80 flex items-center gap-1.5">
                <Star className="h-3 w-3 text-amber-400 fill-current animate-spin" style={{ animationDuration: "12s" }} /> Interactive Blessings Deck
              </span>
              <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                Card {currentIndex + 1} of {PREWRITTEN_WISHES.length}
              </span>
            </div>

            {/* Main Interactive Deck Card Wrapper */}
            <div className="p-1 rounded-3xl bg-white/[0.01] border border-white/5 shadow-inner group">
              <div 
                className="p-6 md:p-8 bg-gradient-to-b from-[#16110e]/95 to-[#0b0705]/98 border-l-4 rounded-2xl relative transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl overflow-hidden min-h-[220px] flex flex-col justify-between"
                style={{ borderLeftColor: cardTheme }}
              >
                {/* Micro twinkling stars backdrop */}
                <div className="absolute top-4 left-1/4 text-amber-400/20 text-xs animate-ping">✦</div>
                <div className="absolute bottom-6 right-1/4 text-amber-200/10 text-sm animate-pulse">★</div>

                {/* Card Top Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{PREWRITTEN_WISHES[currentIndex].emoji}</span>
                    <h4 className="text-sm font-medium text-white font-serif tracking-wide">
                      {PREWRITTEN_WISHES[currentIndex].title}
                    </h4>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={copyWish}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono"
                    title="Copy this blessing to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-amber-400" /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Poem Content */}
                <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 my-4 relative shadow-inner">
                  <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base leading-relaxed font-sans font-light text-center italic tracking-wide">
                    {PREWRITTEN_WISHES[currentIndex].poem}
                  </p>
                </div>

                {/* Author Details & Watermark decoration */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5 text-[11px] text-white/30 font-serif">
                  <span className="italic flex items-center gap-1">
                    <Sparkle className="h-3 w-3 text-amber-400 animate-pulse" /> Sparkled with joy
                  </span>
                  <span className="italic font-medium text-amber-100">
                    — {PREWRITTEN_WISHES[currentIndex].author}
                  </span>
                </div>
              </div>
            </div>

            {/* Pagination Controls with Slide Dots */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => {
                  setCurrentIndex((p) => (p === 0 ? PREWRITTEN_WISHES.length - 1 : p - 1));
                  playSfx("click");
                }}
                className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {/* Elegant Dots Progress */}
              <div className="flex gap-1.5">
                {PREWRITTEN_WISHES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      playSfx("click");
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentIndex === idx ? "w-6" : "w-1.5 bg-white/20"
                    }`}
                    style={{ backgroundColor: currentIndex === idx ? cardTheme : undefined }}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setCurrentIndex((p) => (p === PREWRITTEN_WISHES.length - 1 ? 0 : p + 1));
                  playSfx("click");
                }}
                className="px-4 py-2 rounded-xl text-[11px] font-semibold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: HANDWRITTEN CELESTIAL LETTER */}
        {activeTab === "letter" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-3.5 px-1">
              <span className="text-xs font-serif text-amber-200/80 flex items-center gap-1.5">
                <span>📜</span> The Handwritten Stardust Letter
              </span>
              <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">
                Confidential & Heartfelt
              </span>
            </div>

            {/* Elegant Envelope Envelope Wrapper */}
            <div 
              className="p-1 rounded-3xl border transition-all duration-500 shadow-2xl relative"
              style={{ 
                borderColor: `${cardTheme}35`,
                background: `linear-gradient(to bottom, rgba(19, 13, 10, 0.75), rgba(0, 0, 0, 0.95))`,
                boxShadow: `0 15px 40px -15px ${cardTheme}20`
              }}
            >
              {/* Envelope Stamp Detail */}
              <div 
                className="absolute top-5 right-5 text-[9px] px-2 py-1 border border-dashed rounded font-mono tracking-widest select-none uppercase opacity-60"
                style={{ color: cardTheme, borderColor: `${cardTheme}40` }}
              >
                📬 VIP POSTAGE
              </div>

              {/* Envelope Header info */}
              <div className="p-6 pb-2">
                <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Dedicated to the lovely,</span>
                <h4 className="text-xl md:text-2xl font-serif font-normal text-white mt-1 tracking-wider">
                  Divyanshi ✨
                </h4>
              </div>

              {/* Dynamic Revealable Letter Container */}
              <div className="px-6 pb-6 pt-2">
                {!sealRevealed ? (
                  /* Sealed Envelope View - Highly Aesthetic Wax Seal click-to-open */
                  <div className="py-12 border-t border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-white/50 mb-6 italic max-w-sm">
                      This letter has been sealed with a customizable cosmic wax seal. Tap the seal to break it open and read the blessings!
                    </p>

                    {/* Highly stylized Wax Seal stamp indicator */}
                    <button
                      onClick={() => {
                        setSealRevealed(true);
                        playSfx("sparkle");
                      }}
                      className="w-20 h-20 rounded-full border-4 flex items-center justify-center text-3xl font-serif font-bold shadow-2xl relative transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group"
                      style={{ 
                        backgroundColor: cardTheme,
                        borderColor: `${cardTheme}cc`,
                        boxShadow: `0 0 25px ${cardTheme}60`
                      }}
                    >
                      <span className="animate-pulse">{sealSelected}</span>
                      
                      {/* Wax Seal outer dynamic text decoration */}
                      <span className="absolute -inset-1 border border-dashed rounded-full border-white/40 group-hover:rotate-45 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-white/10 rounded-full mix-blend-overlay" />
                    </button>

                    <span 
                      onClick={() => {
                        setSealRevealed(true);
                        playSfx("sparkle");
                      }}
                      className="text-[11px] text-amber-300 font-serif italic mt-5 hover:underline cursor-pointer tracking-wider block"
                    >
                      Click Seal to Open Letter 🔒
                    </span>
                  </div>
                ) : (
                  /* Revealed Opened Letter View */
                  <div className="border-t border-white/10 pt-5 animate-scale-up">
                    <p className="text-white/95 text-sm md:text-base font-sans font-light leading-relaxed whitespace-pre-wrap italic pl-4 border-l-2 border-amber-400/40 tracking-wide">
                      {customLetter}
                    </p>

                    {/* Reseal controller */}
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => {
                          setSealRevealed(false);
                          playSfx("click");
                        }}
                        className="text-[10px] text-white/30 hover:text-amber-300 hover:underline font-mono uppercase tracking-wider cursor-pointer"
                      >
                        ↩️ Re-Seal Letter
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Seal customizable option deck at the bottom */}
              <div className="bg-black/60 px-6 py-4 rounded-b-3xl border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider">Choose Seal Stamp:</span>
                  <div className="flex gap-1">
                    {SEALS.map((s) => (
                      <button
                        key={s.emoji}
                        onClick={() => {
                          setSealSelected(s.emoji);
                          playSfx("click");
                        }}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${
                          sealSelected === s.emoji
                            ? "bg-white/15 border border-white/30 scale-110"
                            : "bg-transparent hover:bg-white/5 border border-transparent"
                        }`}
                        title={s.label}
                      >
                        {s.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wax Seal Visualizer Status */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Seal Status:</span>
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1 shadow-lg border"
                    style={{ 
                      color: cardTheme, 
                      borderColor: `${cardTheme}35`,
                      backgroundColor: `${cardTheme}10` 
                    }}
                  >
                    {sealRevealed ? "🔓 Opened" : `🔒 ${sealSelected} Sealed`}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Envelope Theme Color Changer */}
            <div className="mt-5 flex items-center justify-between bg-white/[0.01] p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-white/40 flex items-center gap-1 uppercase tracking-wider">
                <Palette className="h-3.5 w-3.5" style={{ color: cardTheme }} /> Envelope Theme Color
              </span>
              <div className="flex gap-2.5">
                {THEME_COLORS.map((tc) => (
                  <button
                    key={tc.name}
                    onClick={() => {
                      setCardTheme(tc.hex);
                      playSfx("click");
                    }}
                    className="w-5.5 h-5.5 rounded-full border border-white/20 transition-transform hover:scale-110 active:scale-90 relative cursor-pointer"
                    style={{ backgroundColor: tc.hex }}
                    title={tc.name}
                  >
                    {cardTheme === tc.hex && (
                      <div className="absolute inset-1 bg-white rounded-full mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
