"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { FavoriteStar } from "@/components/icons/FavoriteStar";

const BURST = { count: 16, duration: 1.05, minVelocity: 110, maxVelocity: 240, gravity: 420 };

export function FavoriteBurst({ id, onComplete }: { id: number; onComplete: (id: number) => void }) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(Physics2DPlugin);
    const context = gsap.context(() => {
      const stars = gsap.utils.toArray<HTMLElement>(".favorite-burst-particle", rootRef.current);
      const timeline = gsap.timeline({ onComplete: () => onComplete(id) });
      stars.forEach((star, index) => {
        const size = gsap.utils.random(9, 17);
        gsap.set(star, { width: size, height: size, xPercent: -50, yPercent: -50, opacity: 1, scale: 0.65, force3D: true });
        timeline.to(star, {
          physics2D: {
            angle: (index / BURST.count) * 360 + gsap.utils.random(-12, 12),
            velocity: gsap.utils.random(BURST.minVelocity, BURST.maxVelocity),
            gravity: BURST.gravity,
          },
          rotation: gsap.utils.random(-240, 240),
          duration: BURST.duration,
          ease: "none",
        }, 0);
        timeline.to(star, { scale: 1, duration: 0.15, ease: "power2.out" }, 0);
        timeline.to(star, { opacity: 0, scale: 0.4, duration: 0.4, ease: "power2.in" }, BURST.duration - 0.4);
      });
      timeline.fromTo(".favorite-burst-center", { opacity: 0, scale: 0.25 }, { opacity: 1, scale: 1.2, duration: 0.2, ease: "back.out(2)" }, 0)
        .to(".favorite-burst-center", { opacity: 0, scale: 0.75, duration: 0.25 }, 0.3);
    }, rootRef);
    return () => context.revert();
  }, [id, onComplete]);

  return (
    <span ref={rootRef} className="pointer-events-none absolute inset-0 z-30 overflow-visible" aria-hidden="true">
      <span className="favorite-burst-center absolute inset-0 flex items-center justify-center text-white"><FavoriteStar className="size-7" /></span>
      {Array.from({ length: BURST.count }, (_, index) => (
        <span key={index} className={`favorite-burst-particle absolute left-1/2 top-1/2 block ${index % 3 === 0 ? "text-white" : "text-[#E74E44]"}`}>
          <FavoriteStar className="h-full w-full" />
        </span>
      ))}
    </span>
  );
}
