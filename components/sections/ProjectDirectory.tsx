"use client";

import { CardPattern } from "@/components/CardPattern";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const ANCHOR_W = 1496;
const ANCHOR_H = 611;
const CONTENT_RELATIVE_SCALE = 0.8;

const SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 22,
};

const CARDS = [
  {
    bg: "bg-[#FF6B22]",
    title: "AI 探索项目",
    subtitle: "Hero Project: The Future Concept",
    tone: "light" as const,
    layout: { x: -558, y: -40, rotate: -5, zIndex: 1 },
  },
  {
    bg: "bg-[#F2EFE6]",
    title: "商业落地项目",
    subtitle: "Industry Experience: AI-Augmented",
    tone: "dark" as const,
    layout: { x: -280, y: 50, rotate: 5, zIndex: 2 },
  },
  {
    bg: "bg-[#2E9AFE]",
    title: "跨维度视觉探索",
    subtitle: "Spatial & Motion Graphics",
    tone: "light" as const,
    layout: { x: 0, y: -40, rotate: -5, zIndex: 3 },
  },
  {
    bg: "bg-[#4ADE80]",
    title: "设计工程化",
    subtitle: "Workflow & Efficiency",
    tone: "dark" as const,
    layout: { x: 280, y: 50, rotate: +5, zIndex: 4 },
  },
  {
    bg: "bg-[#262626]",
    title: "其他",
    subtitle: "Other",
    tone: "light" as const,
    layout: { x: 558, y: -40, rotate: 0, zIndex: 5 },
  },
] as const;

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function useCardFloatParams() {
  return useMemo(
    () =>
      CARDS.map(() => ({
        ampY: randomInRange(3, 5),
        duration: randomInRange(4.5, 6.5),
        delay: randomInRange(0, 1.2),
      })),
    []
  );
}

function useAnchorScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = vw / ANCHOR_W;
      const sy = vh / ANCHOR_H;
      setScale(Math.min(1, sx, sy));
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

function CardPatternSlot({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute left-[30px] right-[30px] top-[30px] z-0 h-[229px] overflow-hidden"
      aria-hidden
    >
      <div className="h-full w-full">{children}</div>
    </div>
  );
}

export function ProjectDirectory() {
  const scale = useAnchorScale();
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion ? { duration: 0 } : SPRING;
  const floatParams = useCardFloatParams();
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const displayScale = scale * CONTENT_RELATIVE_SCALE;
  const scaledW = ANCHOR_W * displayScale;
  const scaledH = ANCHOR_H * displayScale;

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#000101] isolate">
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div
          className="relative shrink-0 overflow-visible"
          style={{ width: scaledW, height: scaledH }}
        >
          <div
            className="relative h-[611px] w-[1496px]"
            style={{
              transform: `scale(${displayScale})`,
              transformOrigin: "top left",
            }}
          >
            {CARDS.map((card, i) => {
              const L = card.layout;
              const isOrange = card.bg === "bg-[#FF6B22]";
              const isBlue = card.bg === "bg-[#2E9AFE]";
              const isGreen = card.bg === "bg-[#4ADE80]";
              const isBlack = card.bg === "bg-[#262626]";
              const f = floatParams[i];
              const isHovered = hoveredCardIndex === i;

              const yKeyframes = reduceMotion
                ? L.y
                : [L.y, L.y - f.ampY, L.y + f.ampY * 0.35, L.y - f.ampY * 0.35, L.y];

              const yTarget = reduceMotion || isHovered ? L.y : yKeyframes;

              return (
                <div
                  key={card.title}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: isHovered ? 100 : L.zIndex }}
                >
                  <motion.article
                    className={`pointer-events-auto relative h-[480px] w-[380px] overflow-hidden rounded-[24px] border border-white/15 ${card.bg} shadow-4xl shadow-black/20`}
                    style={{ transformOrigin: "center bottom" }}
                    initial={{ x: L.x, y: L.y, rotate: L.rotate, scale: 1 }}
                    animate={{
                      x: L.x,
                      y: yTarget,
                      rotate: L.rotate,
                      scale: 1,
                    }}
                    transition={
                      reduceMotion
                        ? instant
                        : {
                            x: SPRING,
                            rotate: SPRING,
                            scale: SPRING,
                            y: isHovered
                              ? { type: "spring", stiffness: 320, damping: 28 }
                              : {
                                  duration: f.duration,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: f.delay,
                                },
                          }
                    }
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.1, transition: SPRING }
                    }
                    onHoverStart={() => setHoveredCardIndex(i)}
                    onHoverEnd={() =>
                      setHoveredCardIndex((current) => (current === i ? null : current))
                    }
                  >
                    <CardPatternSlot>
                      {i === 0 && <CardPattern variant="orange-waves" />}
                      {i === 1 && <CardPattern variant="beige-grid" />}
                      {i === 2 && <CardPattern variant="blue-lines" />}
                      {i === 3 && <CardPattern variant="green-wireframe" />}
                      {i === 4 && <CardPattern variant="black-barcode" />}
                    </CardPatternSlot>

                    <div
                      className={`relative z-10 flex h-full w-full flex-col items-start justify-end p-6 text-left ${
                        card.tone === "dark"
                          ? "text-neutral-900"
                          : isBlue
                            ? "text-[rgb(171,252,254)]"
                            : "text-white"
                      }`}
                    >
                      <h3
                        className={`font-card-cn max-w-[20rem] ${
                          isBlack
                            ? "text-[#EEE3D2]"
                            : isGreen
                            ? "text-[#035406]"
                            : isOrange
                              ? "text-[rgba(253,251,190,1)]"
                              : ""
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={`font-card-en mt-3 max-w-[21rem] ${
                          isBlack
                            ? "text-[#EEE3D2]"
                            : isGreen
                            ? "text-[#035406]"
                            : card.tone === "dark"
                            ? "text-neutral-600"
                            : isOrange
                              ? "text-[rgba(253,251,190,1)]"
                              : isBlue
                                ? "text-[rgba(171,252,254,0.9)]"
                                : "text-white/90"
                        }`}
                      >
                        {card.subtitle}
                      </p>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="pointer-events-none absolute bottom-8 left-0 right-0 z-[60] flex flex-col gap-2 px-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <span className="shrink-0">
          Portfolio 2026 : From Execution to AI Orchestration
        </span>
        <span className="shrink-0 sm:text-right">
          Email: rowscn@gmail.com &nbsp; 手机/微信: 13001977736
        </span>
      </footer>
    </div>
  );
}
