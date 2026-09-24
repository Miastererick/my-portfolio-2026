"use client";

import { CardPattern } from "@/components/CardPattern";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

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
    href: "/ai",
    subtitle: "Hero Project: The Future Concept",
    tone: "light" as const,
    layout: { x: -558, y: -40, rotate: -5, zIndex: 1 },
  },
  {
    bg: "bg-[#F2EFE6]",
    title: "商业落地项目",
    href: "/business",
    subtitle: "Industry Experience: AI-Augmented",
    tone: "dark" as const,
    layout: { x: -280, y: 50, rotate: 5, zIndex: 2 },
  },
  {
    bg: "bg-[#2E9AFE]",
    title: "跨维度视觉探索",
    href: "/visual",
    subtitle: "Spatial & Motion Graphics",
    tone: "light" as const,
    layout: { x: 0, y: -40, rotate: -5, zIndex: 3 },
  },
  {
    bg: "bg-[#4ADE80]",
    title: "设计工程化",
    href: "/engineering",
    subtitle: "Workflow & Efficiency",
    tone: "dark" as const,
    layout: { x: 280, y: 50, rotate: +5, zIndex: 4 },
  },
  {
    bg: "bg-[#262626]",
    title: "其他",
    href: "/other",
    subtitle: "Other",
    tone: "light" as const,
    layout: { x: 558, y: -40, rotate: 0, zIndex: 5 },
  },
] as const;

function variation(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function useCardFloatParams() {
  return useMemo(
    () =>
      CARDS.map((_, index) => ({
        ampY: 3 + variation(index, 1) * 2,
        duration: 4.5 + variation(index, 2) * 2,
        delay: variation(index, 3) * 1.2,
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
  const directoryRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const scale = useAnchorScale();
  const reduceMotion = useReducedMotion();
  const instant = { duration: 0 };
  const floatParams = useCardFloatParams();
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = directoryRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && document.visibilityState === "visible");
      if (entry.isIntersecting) setHasBeenVisible(true);
    }, { threshold: 0.01 });
    observer.observe(element);

    const updateVisibility = () => {
      const bounds = element.getBoundingClientRect();
      setIsVisible(document.visibilityState === "visible" && bounds.bottom > 0 && bounds.top < window.innerHeight);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const shouldAnimate = isVisible && !reduceMotion;

  const displayScale = scale * CONTENT_RELATIVE_SCALE;
  const scaledW = ANCHOR_W * displayScale;
  const scaledH = ANCHOR_H * displayScale;

  return (
    <div ref={directoryRef} data-animations-paused={!shouldAnimate} className="project-directory relative z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#000101] isolate">
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-xl flex-col justify-center gap-3 px-5 pb-20 pt-24 md:hidden">
        <p className="mb-2 text-xs tracking-[0.3em] text-white/50">CATALOG / 项目目录</p>
        {CARDS.map((card, index) => (
          <Link key={card.title} href={card.href} className={`flex min-h-24 items-center justify-between rounded-2xl px-6 py-4 transition-transform hover:translate-x-1 ${card.bg} ${card.tone === "dark" ? "text-neutral-900" : "text-white"}`}>
            <span className="text-xl font-semibold">{card.title}</span>
            <span className="text-sm" aria-hidden>0{index + 1} ↗</span>
          </Link>
        ))}
      </div>

      <div className="relative z-10 hidden h-full w-full items-center justify-center md:flex">
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

              const yKeyframes = !shouldAnimate
                ? L.y
                : [L.y, L.y - f.ampY, L.y + f.ampY * 0.35, L.y - f.ampY * 0.35, L.y];

              const yTarget = !shouldAnimate || isHovered ? L.y : yKeyframes;

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
                      !shouldAnimate
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
                      shouldAnimate ? { scale: 1.1, transition: SPRING } : undefined
                    }
                    onHoverStart={() => setHoveredCardIndex(i)}
                    onHoverEnd={() =>
                      setHoveredCardIndex((current) => (current === i ? null : current))
                    }
                  >
                    <Link href={card.href} className="absolute inset-0 z-20 rounded-[24px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white" aria-label={`浏览${card.title}`} />
                    <CardPatternSlot>
                      {hasBeenVisible && i === 0 && <CardPattern variant="orange-waves" />}
                      {hasBeenVisible && i === 1 && <CardPattern variant="beige-grid" />}
                      {hasBeenVisible && i === 2 && <CardPattern variant="blue-lines" />}
                      {hasBeenVisible && i === 3 && <CardPattern variant="green-wireframe" />}
                      {hasBeenVisible && i === 4 && <CardPattern variant="black-barcode" />}
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

      <PortfolioFooter placement="overlay" />
    </div>
  );
}
