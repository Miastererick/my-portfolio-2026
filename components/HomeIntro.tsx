"use client";

import { useCallback, useEffect, useState } from "react";
import "./HomeIntro.css";

let introPlayed = false;
export const HOME_INTRO_DONE_EVENT = "portfolio:home-intro-done";
export const hasHomeIntroPlayed = () => introPlayed;

export function HomeIntro() {
  const [done, setDone] = useState(() => introPlayed);
  const finishIntro = useCallback(() => {
    if (introPlayed) return;
    introPlayed = true;
    window.dispatchEvent(new Event(HOME_INTRO_DONE_EVENT));
    setDone(true);
  }, []);

  useEffect(() => {
    if (introPlayed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setDone(true), 0);
      return () => window.clearTimeout(timer);
    }
    // CSS animation completion starts the cards; the timer only covers a missed event.
    const timer = window.setTimeout(finishIntro, 5500);
    return () => window.clearTimeout(timer);
  }, [finishIntro]);

  if (done) return null;

  return (
    <div
      className="home-intro"
      role="status"
      aria-label="作品集正在载入"
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#fff" }}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finishIntro();
      }}
    >
      <div className="home-intro-name" aria-hidden="true">
        <span>WANG</span>
        <span>MINGQI</span>
      </div>
      <div className="home-intro-curtain" aria-hidden="true" />
    </div>
  );
}
