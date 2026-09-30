"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";

export function LibraryPrompt({ path }: { path: string }) {
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [copySequence, setCopySequence] = useState(0);
  const reduceMotion = useReducedMotion();
  const magneticZone = useRef<HTMLDivElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const zone = magneticZone.current;
    const button = copyButton.current;
    if (!zone || !button || !text) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const xTo = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out", overwrite: "auto" });
      const yTo = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out", overwrite: "auto" });
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        // Measure the stationary wrapper so the moving button cannot shift its own target.
        const bounds = zone.getBoundingClientRect();
        xTo(gsap.utils.clamp(-12, 12, (event.clientX - bounds.left - bounds.width / 2) * 0.25));
        yTo(gsap.utils.clamp(-8, 8, (event.clientY - bounds.top - bounds.height / 2) * 0.25));
      };
      const reset = () => { xTo(0); yTo(0); };
      zone.addEventListener("pointermove", move);
      zone.addEventListener("pointerleave", reset);
      zone.addEventListener("pointercancel", reset);
      window.addEventListener("blur", reset);
      return () => {
        zone.removeEventListener("pointermove", move);
        zone.removeEventListener("pointerleave", reset);
        zone.removeEventListener("pointercancel", reset);
        window.removeEventListener("blur", reset);
      };
    }, zone);
    return () => media.revert();
  }, [text]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(path, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Prompt unavailable");
        return response.text();
      })
      .then(setText)
      .catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [path]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
      setCopySequence((sequence) => sequence + 1);
    } catch { setCopyError(true); }
  }

  return (
    <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">提示词</h3>
        <div ref={magneticZone} className="relative shrink-0">
          <div role="status" className="absolute bottom-full right-0 mb-2 whitespace-nowrap text-xs" style={{ color: copyError ? "#DC2626" : "#16A34A" }}>
            <AnimatePresence mode="wait">
              {(copyError || copied) && <motion.div
                key={copyError ? "error" : copySequence}
                initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-1"
              >
                {!copyError && copied ? <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                {copyError ? "复制失败，请选中文字复制。" : "提示词已复制"}
              </motion.div>}
            </AnimatePresence>
          </div>
          <button ref={copyButton} type="button" disabled={!text} onClick={copy} className="cursor-pointer rounded-xl border border-[var(--border-subtle)] px-4 py-2 text-sm disabled:opacity-40">
            {copied ? "已复制" : "复制提示词"}
          </button>
        </div>
      </div>
      {error ? <p className="mt-3 text-sm">提示词暂时无法读取，请刷新后重试。</p> : (
        <pre className="site-muted-text mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap break-words font-sans text-sm leading-7">{text || "正在读取提示词…"}</pre>
      )}
    </section>
  );
}
