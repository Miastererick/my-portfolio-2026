"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./PortfolioRouteCurtain.css";

const NAVIGATE_EVENT = "portfolio:open-project";

type ProjectDestination = { href: string; title: string; english?: string };

export function openProjectWithCurtain(href: string, title: string, english?: string) {
  window.dispatchEvent(new CustomEvent<ProjectDestination>(NAVIGATE_EVENT, { detail: { href, title, english } }));
}

export function PortfolioRouteCurtain() {
  const pathname = usePathname();
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const destination = useRef<string | null>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coverAnimation = useRef<gsap.core.Timeline | null>(null);
  const [project, setProject] = useState<ProjectDestination | null>(null);

  useEffect(() => {
    const node = curtain.current;
    const titleNode = heading.current;
    if (!node || !titleNode) return;

    const reset = () => {
      coverAnimation.current?.kill();
      coverAnimation.current = null;
      gsap.killTweensOf(node);
      gsap.killTweensOf(titleNode);
      gsap.set(node, { yPercent: 100, autoAlpha: 0, pointerEvents: "none" });
      gsap.set(titleNode, { autoAlpha: 0, y: 20 });
      destination.current = null;
      setProject(null);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    };

    const navigate = (event: Event) => {
      const selected = (event as CustomEvent<ProjectDestination>).detail;
      if (!selected?.href?.startsWith("/projects/") || destination.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(selected.href);
        return;
      }

      destination.current = selected.href;
      setProject(selected);
      gsap.set(node, { yPercent: 100, autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(titleNode, { autoAlpha: 0, y: 20 });
      coverAnimation.current = gsap.timeline({
        onComplete: () => {
          router.push(selected.href);
          // A failed navigation must not leave the page permanently covered.
          releaseTimer.current = setTimeout(reset, 8000);
        },
      })
        .to(node, { yPercent: 0, duration: 0.62, ease: "power3.inOut" })
        .to(titleNode, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" }, 0.43)
        .to({}, { duration: 0.18 });
    };

    window.addEventListener(NAVIGATE_EVENT, navigate);
    return () => {
      window.removeEventListener(NAVIGATE_EVENT, navigate);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
      coverAnimation.current?.kill();
      gsap.killTweensOf(node);
      gsap.killTweensOf(titleNode);
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
          setProject(null);
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
        borderTop: "4px solid #E74E44",
        visibility: "hidden",
        pointerEvents: "none",
        transform: "none",
        willChange: "transform",
      }}
    >
      <div ref={heading} className="portfolio-route-curtain-content">
        <strong className="portfolio-route-curtain-title">{project?.title}</strong>
        {project?.english && <span className="portfolio-route-curtain-english">{project.english}</span>}
      </div>
    </div>
  );
}
