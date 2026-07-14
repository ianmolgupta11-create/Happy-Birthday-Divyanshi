import React, { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number; // percentage left
  y: number; // initial top offset
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star";
  delay: number; // seconds
  duration: number; // seconds
  rotation: number; // degrees
}

const SHAPES = ["circle", "square", "triangle", "star"] as const;
const COLORS = [
  "#ec4899", // pink-500
  "#f43f5e", // rose-500
  "#3b82f6", // blue-500
  "#eab308", // yellow-500
  "#a855f7", // purple-500
  "#22c55e", // green-500
  "#f97316", // orange-500
  "#06b6d4"  // cyan-500
];

export function ConfettiRain({ active, durationMs = 5000 }: { active: boolean; durationMs?: number }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      
      // Generate 120 confetti particles
      const newPieces: ConfettiPiece[] = Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20, // start above viewport
        size: Math.random() * 12 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: Math.random() * 2.5, // staggered entry
        duration: Math.random() * 3 + 3, // speed
        rotation: Math.random() * 360
      }));
      setPieces(newPieces);

      // Auto stop generating after duration
      const timer = setTimeout(() => {
        setVisible(false);
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [active, durationMs]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => {
        const shapeStyle =
          p.shape === "circle"
            ? "rounded-full"
            : p.shape === "triangle"
            ? "clip-triangle"
            : p.shape === "star"
            ? "clip-star"
            : "";

        return (
          <div
            key={p.id}
            className={`absolute animate-confetti-fall ${shapeStyle}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.shape !== "triangle" && p.shape !== "star" ? p.color : undefined,
              borderColor: p.shape === "triangle" || p.shape === "star" ? p.color : undefined,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.85,
            }}
          />
        );
      })}
      
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 1;
          }
          50% {
            translateX: 15px;
          }
          100% {
            transform: translateY(115vh) rotate(720deg) translateX(-15px);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
        
        /* Inline shapes using clip-path */
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background-color: var(--tw-border-opacity, currentColor);
        }
        .clip-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          background-color: var(--tw-border-opacity, currentColor);
        }
      `}</style>
    </div>
  );
}
