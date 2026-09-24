"use client";

import { CardPattern } from "@/components/CardPattern";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ANCHOR_W = 1496;
const ANCHOR_H = 611;
const CONTENT_RELATIVE_SCALE = 0.8;

const SPRING = {
  type: "spring" as const,
  stiffness: 180,
  damping: 18.3,
};

const CARDS = [
  {
    bg: "bg-[#FF6B22]",
    title: "AI 探索项目",
    href: "/ai",
    subtitle: "Hero Project: The Future Concept",
    description: "从 ComfyUI 工作流到 AIGC 概念设计，探索新工具如何进入真实的创作与交付过程。",
    tone: "light" as const,
    layout: { x: -558, y: -40, rotate: -5, zIndex: 1 },
  },
  {
    bg: "bg-[#F2EFE6]",
    title: "商业落地项目",
    href: "/business",
    subtitle: "Industry Experience: AI-Augmented",
    description: "面向大型活动与能源场景，展示数据可视化、指挥平台和企业产品的落地实践。",
    tone: "dark" as const,
    layout: { x: -280, y: 50, rotate: 5, zIndex: 2 },
  },
  {
    bg: "bg-[#2E9AFE]",
    title: "跨维度视觉探索",
    href: "/visual",
    subtitle: "Spatial & Motion Graphics",
    description: "以三维场景、空间叙事和动态表达，探索更立体、更有感知力的视觉体验。",
    tone: "light" as const,
    layout: { x: 0, y: -40, rotate: -5, zIndex: 3 },
  },
  {
    bg: "bg-[#4ADE80]",
    title: "设计工程化",
    href: "/engineering",
    subtitle: "Workflow & Efficiency",
    description: "把组件、设计变量与协作流程沉淀为可复用的系统，支持持续而高效的设计交付。",
    tone: "dark" as const,
    layout: { x: 280, y: 50, rotate: +5, zIndex: 4 },
  },
  {
    bg: "project-other-card",
    title: "其他",
    href: "/other",
    subtitle: "Other",
    description: "记录设计知识分享、跨领域练习与持续学习过程中值得保留的发现。",
    tone: "light" as const,
    layout: { x: 558, y: -40, rotate: 0, zIndex: 5 },
  },
] as const;

const CARD_PATTERNS = ["orange-waves", "beige-grid", "blue-lines", "green-wireframe", "black-barcode"] as const;

function useAnchorScale() {
  const [viewport, setViewport] = useState({ scale: 1, height: 900 });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sx = vw / ANCHOR_W;
      const sy = vh / ANCHOR_H;
      setViewport({ scale: Math.min(1, sx, sy), height: vh });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return viewport;
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
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const { scale, height: viewportHeight } = useAnchorScale();
  const reduceMotion = useReducedMotion();
  const instant = { duration: 0 };
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = directoryRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      const isMostlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.75;
      setIsVisible(isMostlyVisible && document.visibilityState === "visible");
      if (isMostlyVisible) setHasBeenVisible(true);
    }, { threshold: [0, 0.75] });
    observer.observe(element);

    const updateVisibility = () => {
      const bounds = element.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      const visibleRatio = visibleHeight / Math.max(bounds.height, 1);
      setIsVisible(document.visibilityState === "visible" && visibleRatio >= 0.75);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(() => setHasBeenVisible(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => setHasBeenVisible(true), 500);
    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (selectedCardIndex === null) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCardIndex(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedCardIndex]);

  const shouldAnimate = isVisible && !reduceMotion;

  const displayScale = scale * CONTENT_RELATIVE_SCALE;
  const scaledW = ANCHOR_W * displayScale;
  const scaledH = ANCHOR_H * displayScale;
  const focusedScale = 1.2;
  const focusedHeight = 480 * displayScale * focusedScale;
  const focusedTop = Math.max(72, viewportHeight * 0.1);
  const focusedY = (focusedTop + focusedHeight / 2 - viewportHeight / 2) / displayScale;
  const stackScale = Math.min(0.95, Math.max(0.36, viewportHeight * 0.24 / (480 * displayScale)));
  const stackHeight = 480 * displayScale * stackScale;
  const stackY = (viewportHeight * 0.58 + stackHeight / 2 - viewportHeight / 2) / displayScale;
  const stackStep = 380 * stackScale * 0.48;

  const toggleCard = (index: number) => {
    setHoveredCardIndex(null);
    setSelectedCardIndex((current) => current === index ? null : index);
  };

  return (
    <div
      ref={directoryRef}
      data-animations-paused={!shouldAnimate}
      onClick={(event) => {
        if (selectedCardIndex === null) return;
        const target = event.target;
        if (target instanceof Element && target.closest("[data-project-card]")) return;
        setSelectedCardIndex(null);
      }}
      className="project-directory relative z-10 flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#000101] isolate"
    >
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-xl flex-col justify-center gap-3 px-5 pb-20 pt-24 md:hidden">
        <p className="mb-2 text-xs tracking-[0.3em] text-white/50">CATALOG / 项目目录</p>
        {CARDS.map((card, index) => (
          <div key={card.title} data-project-card className={`project-directory-card overflow-hidden rounded-2xl ${card.bg} ${card.tone === "dark" ? "text-neutral-900" : "text-white"}`}>
            <button
              type="button"
              onClick={() => toggleCard(index)}
              aria-expanded={selectedCardIndex === index}
              className="flex min-h-24 w-full items-center justify-between px-6 py-4 text-left"
            >
              <span className="text-xl font-semibold">{card.title}</span>
              <span className="text-sm" aria-hidden>0{index + 1} {selectedCardIndex === index ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {selectedCardIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.34 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-sm leading-relaxed">
                    <p>{card.description}</p>
                    <Link href={card.href} className="mt-4 inline-flex border-b border-current pb-1 font-semibold">查看项目 ↗</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
              const isBlack = card.bg === "project-other-card";
              const isFocused = selectedCardIndex === i;
              const hasFocus = selectedCardIndex !== null;
              const isHovered = shouldAnimate && !hasFocus && hoveredCardIndex === i;
              const stackIndex = hasFocus
                ? CARDS.map((_, index) => index).filter((index) => index !== selectedCardIndex).indexOf(i)
                : -1;

              const yTarget = isFocused
                ? focusedY
                : hasFocus
                  ? stackY + Math.abs(stackIndex - 1.5) * 7
                  : L.y;

              return (
                <div
                  key={card.title}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: isFocused ? 100 : hasFocus ? 20 + stackIndex : L.zIndex }}
                >
                  <motion.article
                    data-project-card
                    className={`project-directory-card pointer-events-auto relative h-[480px] w-[380px] overflow-hidden rounded-[24px] border border-white/15 ${card.bg}`}
                    style={{ transformOrigin: "center center" }}
                    initial={{ x: L.x, y: L.y, rotate: L.rotate, scale: 1 }}
                    animate={{
                      x: isFocused ? 0 : hasFocus ? (stackIndex - 1.5) * stackStep : L.x,
                      y: yTarget,
                      rotate: isFocused ? 0 : hasFocus ? (stackIndex - 1.5) * 5 : L.rotate,
                      scale: isFocused ? focusedScale : hasFocus ? stackScale : isHovered ? 1.08 : 1,
                    }}
                    transition={shouldAnimate ? { x: SPRING, y: SPRING, rotate: SPRING, scale: SPRING } : instant}
                    onHoverStart={() => { if (!hasFocus) setHoveredCardIndex(i); }}
                    onHoverEnd={() =>
                      setHoveredCardIndex((current) => (current === i ? null : current))
                    }
                  >
                    <button
                      type="button"
                      onClick={() => toggleCard(i)}
                      className="absolute inset-0 z-20 rounded-[24px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-white"
                      aria-expanded={isFocused}
                      aria-label={isFocused ? `收起${card.title}` : `展开${card.title}介绍`}
                    />
                    <CardPatternSlot>
                      {hasBeenVisible && <CardPattern variant={CARD_PATTERNS[i]} />}
                    </CardPatternSlot>

                    {isFocused ? (
                      <motion.div
                        id={`card-details-${i}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.34, delay: reduceMotion ? 0 : 0.19 }}
                        className={`absolute inset-x-0 top-[290px] z-30 px-6 text-left ${card.tone === "dark" ? "text-neutral-900" : isBlack ? "text-[#EEE3D2]" : isBlue ? "text-[#ABFCFE]" : "text-[#FDFBBE]"}`}
                      >
                        <h3 className="font-card-cn">{card.title}</h3>
                        <p className="mt-3 text-[16px] leading-[1.55]">{card.description}</p>
                        <Link href={card.href} className="mt-4 inline-flex border-b border-current pb-1 text-[14px] font-semibold tracking-[0.04em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-current">
                          查看项目 ↗
                        </Link>
                      </motion.div>
                    ) : (
                      <div
                        className={`relative z-10 flex h-full w-full flex-col items-start justify-end p-6 text-left ${
                          card.tone === "dark" ? "text-neutral-900" : isBlue ? "text-[rgb(171,252,254)]" : "text-white"
                        }`}
                      >
                        <h3 className={`font-card-cn max-w-[20rem] ${isBlack ? "!text-[#EEE3D2]" : isGreen ? "text-[#035406]" : isOrange ? "text-[rgba(253,251,190,1)]" : ""}`}>
                          {card.title}
                        </h3>
                        <p className={`font-card-en mt-3 max-w-[21rem] ${isBlack ? "!text-[#EEE3D2]" : isGreen ? "text-[#035406]" : card.tone === "dark" ? "text-neutral-600" : isOrange ? "text-[rgba(253,251,190,1)]" : isBlue ? "text-[rgba(171,252,254,0.9)]" : "text-white/90"}`}>
                          {card.subtitle}
                        </p>
                      </div>
                    )}
                  </motion.article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <PortfolioFooter placement="overlay" flushBottom />
    </div>
  );
}
