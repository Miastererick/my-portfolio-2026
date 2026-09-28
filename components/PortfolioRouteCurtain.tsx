"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const NAVIGATE_EVENT = "portfolio:open-project";

export function openProjectWithCurtain(href: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: href }));
}

export function PortfolioRouteCurtain() {
  const pathname = usePathname();
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const destination = useRef<string | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const node = curtain.current;
    if (!node) return;

    const reset = () => {
      gsap.killTweensOf(node);
      gsap.set(node, { yPercent: 100, autoAlpha: 0, pointerEvents: "none" });
      destination.current = null;
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    };

    const navigate = (event: Event) => {
      const href = (event as CustomEvent<string>).detail;
      if (!href?.startsWith("/projects/") || destination.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      destination.current = href;
      gsap.set(node, { yPercent: 100, autoAlpha: 1, pointerEvents: "auto" });
      gsap.to(node, {
        yPercent: 0,
        duration: 0.62,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          // A failed navigation must not leave the page permanently covered.
          releaseTimer.current = setTimeout(reset, 8000);
        },
      });
    };

    window.addEventListener(NAVIGATE_EVENT, navigate);
    return () => {
      window.removeEventListener(NAVIGATE_EVENT, navigate);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      gsap.killTweensOf(node);
    };
  }, [router]);

  useEffect(() => {
    const node = curtain.current;
    if (!node || !destination.current || pathname !== destination.current) return;

    // Let the destination paint behind the panel before sliding it away.
    const frame = requestAnimationFrame(() => {
      gsap.to(node, {
        yPercent: -100,
        duration: 0.66,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(node, { yPercent: 100, autoAlpha: 0, pointerEvents: "none" });
          destination.current = null;
          if (releaseTimer.current) clearTimeout(releaseTimer.current);
          releaseTimer.current = null;
        },
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      ref={curtain}
      className="portfolio-route-curtain"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#171717",
        borderTop: "4px solid #e9510e",
        visibility: "hidden",
        pointerEvents: "none",
        transform: "none",
        willChange: "transform",
      }}
    />
  );
}
