"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { openProjectWithCurtain } from "@/components/PortfolioRouteCurtain";
import { createCardCurl } from "./portfolioCardCurl";

type ShowcaseItem = {
  slug: string;
  title: string;
  english: string;
  summary: string;
  role: string;
  category: string;
  cover: string | null;
};

const INDEX_ROW_HEIGHT = 124;
const WHEEL_SWITCH_THRESHOLD = 150;
const WHEEL_GESTURE_PAUSE = 240;
const WHEEL_DECAY_DURATION = 1;
const FAST_WHEEL_DISTANCE = 140;
const FAST_WHEEL_INTERVAL = 32;
const FAST_WHEEL_IMPULSE = 260;
const FAST_WHEEL_MIN_EVENT = 45;
const FAST_SNAP_PULL = 0.1;
const FAST_SETTLE_DURATION = 0.6;
export function PortfolioShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const artworks = useRef<HTMLDivElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const activeItem = items[active];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const gallery = artworks.current;
        if (!gallery) return;
        const mobile = window.innerWidth <= 650;
        if (!mobile) {
          const maxScroll = gallery.scrollHeight - gallery.clientHeight;
          const position = maxScroll > 0 ? (gallery.scrollTop / maxScroll) * (items.length - 1) : 0;
          setProgress(position);
          setActive(Math.round(position));
          return;
        }
        const center = mobile
          ? window.innerHeight * 0.49
          : gallery.getBoundingClientRect().top + gallery.clientHeight * 0.49;
        const centers = sections.current.map((section) => {
          if (!section) return center;
          const bounds = section.getBoundingClientRect();
          return bounds.top + bounds.height / 2;
        });
        let position = 0;
        if (center >= centers[centers.length - 1]) {
          position = centers.length - 1;
        } else {
          for (let index = 0; index < centers.length - 1; index++) {
            if (center <= centers[index + 1]) {
              position = index + Math.max(0, Math.min(1, (center - centers[index]) / (centers[index + 1] - centers[index])));
              break;
            }
          }
        }
        setProgress(position);
        setActive(Math.round(position));
      });
    };
    update();
    const gallery = artworks.current;
    gallery?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      gallery?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  useEffect(() => {
    let disposed = false;
    let removeWheel: (() => void) | undefined;
    let cancelAnimation: (() => void) | undefined;
    let accumulated = 0;
    let lastWheelDirection = 0;
    let lastWheelAt = 0;
    let fastGesture = false;
    let targetPosition: number | null = null;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    void import("gsap").then(({ gsap }) => {
      if (disposed) return;

      const moveToTarget = (duration = WHEEL_DECAY_DURATION) => {
        const gallery = artworks.current;
        if (!gallery || targetPosition === null) return;

        const maxScroll = gallery.scrollHeight - gallery.clientHeight;
        const step = maxScroll / Math.max(1, items.length - 1);
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(gallery, {
          scrollTop: targetPosition * step,
          duration: reducedMotion ? 0 : duration,
          ease: "power3.out",
          overwrite: true,
        });
      };

      const switchOnWheel = (event: WheelEvent) => {
        const gallery = artworks.current;
        if (!gallery || window.innerWidth <= 650 || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        event.preventDefault();

        // Pixel-mode trackpads use about 100 px per card. Line/page wheels keep
        // their magnitude, so faster gestures can advance several cards at once.
        const delta = event.deltaMode === 0
          ? event.deltaY
          : event.deltaY * WHEEL_SWITCH_THRESHOLD;
        if (delta === 0) return;
        const now = performance.now();
        const newGesture = lastWheelAt === 0 || now - lastWheelAt > WHEEL_GESTURE_PAUSE;
        const interval = newGesture ? Number.POSITIVE_INFINITY : now - lastWheelAt;
        const inputMagnitude = event.deltaMode === 0
          ? Math.abs(event.deltaY)
          : Math.abs(event.deltaY) * 50;
        const fastInput = inputMagnitude >= FAST_WHEEL_IMPULSE
          || (interval <= FAST_WHEEL_INTERVAL && inputMagnitude >= FAST_WHEEL_MIN_EVENT);
        lastWheelAt = now;
        if (newGesture) fastGesture = fastInput;
        else fastGesture ||= fastInput;

        const direction = Math.sign(delta);
        const maxScroll = gallery.scrollHeight - gallery.clientHeight;
        const step = maxScroll / Math.max(1, items.length - 1);
        const currentPosition = step > 0 ? gallery.scrollTop / step : 0;
        const changedDirection = direction !== lastWheelDirection;
        if (changedDirection) {
          accumulated = 0;
          targetPosition = fastGesture ? currentPosition : Math.round(currentPosition);
          gsap.killTweensOf(gallery, "scrollTop");
          lastWheelDirection = direction;
        } else if (newGesture || !gsap.isTweening(gallery) || targetPosition === null) {
          targetPosition = fastGesture ? currentPosition : Math.round(currentPosition);
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          const settleTarget = fastGesture && targetPosition !== null
            ? Math.round(targetPosition)
            : null;
          accumulated = 0;
          fastGesture = false;
          lastWheelAt = 0;
          if (settleTarget !== null) {
            targetPosition = settleTarget;
            moveToTarget(FAST_SETTLE_DURATION);
          }
        }, WHEEL_GESTURE_PAUSE);

        if (fastGesture) {
          accumulated = 0;
          const freePosition = Math.max(0, Math.min(items.length - 1, (targetPosition ?? currentPosition) + delta / FAST_WHEEL_DISTANCE));
          const nearestCard = Math.round(freePosition);
          targetPosition = freePosition + (nearestCard - freePosition) * FAST_SNAP_PULL;
          moveToTarget();
          return;
        }

        accumulated += delta;
        const steps = Math.trunc(accumulated / WHEEL_SWITCH_THRESHOLD);
        if (steps === 0) return;
        targetPosition = Math.max(0, Math.min(items.length - 1, Math.round(targetPosition ?? currentPosition) + steps));
        accumulated -= steps * WHEEL_SWITCH_THRESHOLD;
        moveToTarget();
      };
      document.addEventListener("wheel", switchOnWheel, { passive: false });
      removeWheel = () => document.removeEventListener("wheel", switchOnWheel);
      cancelAnimation = () => { if (artworks.current) gsap.killTweensOf(artworks.current, "scrollTop"); };
    });
    return () => {
      disposed = true;
      removeWheel?.();
      cancelAnimation?.();
      clearTimeout(resetTimer);
    };
  }, [items.length]);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function setupScrollDeck() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed || !artworks.current || !deck.current) return;

      gsap.registerPlugin(ScrollTrigger);
      const gallery = artworks.current;
      const cardDeck = deck.current;
      const stage = cardDeck.parentElement;
      const cards = sections.current.filter((card): card is HTMLElement => card !== null);
      const motion = gsap.matchMedia();

      motion.add("(min-width: 651px)", () => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const canTilt = !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        gsap.set(cards, { xPercent: -50, yPercent: -50, transformOrigin: "center center", force3D: true });
        gsap.set(cardDeck, {
          perspective: "none",
          transformPerspective: 1500,
          transformOrigin: "47.5% 50%",
          force3D: true,
        });

        const tiltXTo = gsap.quickTo(cardDeck, "rotationX", { duration: 0.65, ease: "power3.out" });
        const tiltYTo = gsap.quickTo(cardDeck, "rotationY", { duration: 0.65, ease: "power3.out" });
        const shiftXTo = gsap.quickTo(cardDeck, "x", { duration: 0.65, ease: "power3.out" });
        const shiftYTo = gsap.quickTo(cardDeck, "y", { duration: 0.65, ease: "power3.out" });
        const clampPointer = gsap.utils.clamp(-1, 1);

        const resetPointerTilt = () => {
          tiltXTo(0);
          tiltYTo(0);
          shiftXTo(0);
          shiftYTo(0);
        };

        const updatePointerTilt = (event: PointerEvent) => {
          if (!stage) return;
          const bounds = stage.getBoundingClientRect();
          const x = clampPointer(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
          const y = clampPointer(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);

          tiltXTo(y * -5);
          tiltYTo(x * 5);
          shiftXTo(x * 20);
          shiftYTo(y * 5);
        };

        if (canTilt && stage) {
          stage.addEventListener("pointermove", updatePointerTilt, { passive: true });
          stage.addEventListener("pointerleave", resetPointerTilt);
        }

        const surfaces = cards
          .map((card) => card.querySelector<HTMLElement>(".portfolio-stage-skew"))
          .filter((surface): surface is HTMLElement => surface !== null);
        const velocityProxy = { skew: 0 };
        const curls = reducedMotion ? [] : cards.map(createCardCurl);
        let deckPosition = 0;
        function renderCurl() {
          const amount = velocityProxy.skew / 12;
          curls.forEach((curl, index) => curl?.render(amount, Math.abs(index - deckPosition) < 3.5));
        }
        const setVelocitySkew = gsap.quickSetter(surfaces, "skewX", "deg");
        const clampVelocitySkew = gsap.utils.clamp(-12, 12);
        let velocityTween: ReturnType<typeof gsap.to> | undefined;

        gsap.set(surfaces, {
          skewX: 0,
          transformOrigin: "center top",
          force3D: true,
        });

        function placeCards(position: number) {
          deckPosition = position;
          const width = gallery.clientWidth;
          const height = gallery.clientHeight;
          cards.forEach((card, index) => {
            const distance = index - position;
            const depth = Math.abs(distance);
            if (depth >= 3.5) {
              card.style.visibility = "hidden";
              card.style.pointerEvents = "none";
              return;
            }
            const direction = Math.sign(distance);
            const travel = Math.min(depth, 1);
            const extra = Math.max(0, depth - 1);
            // Ease orientation into a parallel stack without a kink at its edge.
            const tilt = travel * travel * (3 - 2 * travel);
            // Parallel stacks follow the reference's upper-right / lower-left diagonal.
            const stackOffset = 0.57;
            const x = -direction * (width * 0.39 * travel + extra * width * 0.065);
            const y = direction * (height * stackOffset * travel + extra * height * 0.065);
            // Upper stack: nearest card in front. Lower stack: later cards
            // overlap earlier ones as they enter from the lower-left corner.
            const layerDirection = direction > 0 ? 1 : -1;
            // Identical local projection keeps both stacks visually parallel.
            const z = 0;
            const rotationX = reducedMotion ? 0 : 20 * tilt;
            const rotationY = reducedMotion ? 0 : 18 * tilt;
            const rotation = reducedMotion ? 0 : 7 * tilt;

            card.style.zIndex = String(100 + layerDirection * Math.round(depth * 10));
            card.style.pointerEvents = "auto";
            card.style.visibility = depth < 3.5 ? "visible" : "hidden";
            const values = { x, y, z, rotationX, rotationY, rotation, transformPerspective: 0 };
            // Scroll position already has a timed tween. A second tween here caused
            // position, angle and stacking order to drift apart during each switch.
            gsap.set(card, values);
          });
        }

        function updateVelocitySkew(velocity: number) {
          if (reducedMotion) return;
          // The GSAP demo uses velocity-driven skew. Anchoring the top edge and
          // skewing X makes the lower edge trail the vertical scroll direction.
          const skew = clampVelocitySkew(velocity / -450);
          if (Math.abs(skew) <= Math.abs(velocityProxy.skew)) return;

          velocityProxy.skew = skew;
          velocityTween?.kill();
          velocityTween = gsap.to(velocityProxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3",
            overwrite: true,
            onUpdate: () => {
              setVelocitySkew(velocityProxy.skew);
              renderCurl();
            },
            onComplete: renderCurl,
          });
        }

        const trigger = ScrollTrigger.create({
          scroller: gallery,
          trigger: gallery,
          start: 0,
          end: () => Math.max(1, gallery.scrollHeight - gallery.clientHeight),
          onUpdate: (self) => {
            placeCards(self.progress * (cards.length - 1));
            updateVelocitySkew(self.getVelocity());
          },
          onRefresh: (self) => {
            velocityProxy.skew = 0;
            setVelocitySkew(0);
            renderCurl();
            placeCards(self.progress * (cards.length - 1));
          },
        });
        placeCards(trigger.progress * (cards.length - 1));

        const openingIndex = Math.round(trigger.progress * (cards.length - 1));
        const openingCards = cards
          .map((card, index) => ({ card, index }))
          .filter(({ index }) => Math.abs(index - openingIndex) < 3.5)
          .sort((a, b) => Math.abs(a.index - openingIndex) - Math.abs(b.index - openingIndex))
          .map(({ card }) => card.querySelector<HTMLElement>(".portfolio-stage-artwork"))
          .filter((artwork): artwork is HTMLElement => artwork !== null);
        const entrance = reducedMotion ? null : gsap.fromTo(openingCards,
          { autoAlpha: 0, y: 38, scale: 0.94 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.09,
            delay: 0.08,
            ease: "power3.out",
            onComplete: () => gsap.set(openingCards, { clearProps: "opacity,visibility,transform" }),
          },
        );

        return () => {
          entrance?.kill();
          gsap.set(openingCards, { clearProps: "opacity,visibility,transform" });
          stage?.removeEventListener("pointermove", updatePointerTilt);
          stage?.removeEventListener("pointerleave", resetPointerTilt);
          velocityTween?.kill();
          curls.forEach((curl) => curl?.destroy());
          gsap.killTweensOf(velocityProxy);
          gsap.killTweensOf(cardDeck);
          gsap.set(cardDeck, { clearProps: "transform,transformOrigin,perspective" });
          gsap.set(surfaces, { clearProps: "transform,transformOrigin" });
          trigger.kill();
          gsap.killTweensOf(cards);
          gsap.set(cards, { clearProps: "transform,opacity,visibility" });
          cards.forEach((card) => {
            card.style.removeProperty("z-index");
            card.style.removeProperty("pointer-events");
          });
        };
      });
      motion.add("(max-width: 650px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const firstCard = cards[0]?.querySelector<HTMLElement>(".portfolio-stage-artwork");
        if (!firstCard) return;
        const entrance = gsap.fromTo(firstCard,
          { autoAlpha: 0, y: 24, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            onComplete: () => gsap.set(firstCard, { clearProps: "opacity,visibility,transform" }),
          },
        );
        return () => {
          entrance.kill();
          gsap.set(firstCard, { clearProps: "opacity,visibility,transform" });
        };
      });
      cleanup = () => motion.revert();
    }

    void setupScrollDeck();
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  function goTo(index: number) {
    const gallery = artworks.current;
    if (gallery && window.innerWidth > 650) {
      gallery.scrollTo({ top: ((gallery.scrollHeight - gallery.clientHeight) * index) / Math.max(1, items.length - 1), behavior: "smooth" });
    } else {
      sections.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setActive(index);
  }

  return (
    <main className="portfolio-stage">
      <div className="portfolio-stage-rail" aria-hidden="true">
        <span className="portfolio-stage-monogram">WORK</span>
        <span>Selected work · 2026</span>
      </div>

      <aside className="portfolio-stage-info" aria-live="polite">
        <div className="portfolio-stage-info-inner">
          <div className="portfolio-stage-kicker">Selected work <span>/{String(items.length).padStart(2, "0")}</span></div>
          <div key={active} className="portfolio-stage-facts">
            <span>Role</span><strong>{activeItem.role}</strong>
            <span>Field</span><strong>{activeItem.category}</strong>
            <span>Focus</span><strong>{activeItem.summary}</strong>
          </div>
          <p className="portfolio-stage-scroll">↓ &nbsp; Scroll to explore</p>
        </div>
      </aside>

      <div ref={artworks} className="portfolio-stage-artworks" tabIndex={0} aria-label="滚动浏览项目封面">
        <div className="portfolio-stage-scroll-track" style={{ height: `calc(${Math.max(0, items.length - 1) * 68}dvh + 100dvh - 76px)` }} aria-hidden="true" />
      </div>

      <div ref={deck} className="portfolio-stage-deck">
        {items.map((item, index) => (
          <section
            key={item.slug}
            ref={(node) => { sections.current[index] = node; }}
            data-index={index}
            className={`portfolio-stage-slide ${active === index ? "is-active" : ""} ${Math.abs(progress - index) < 0.08 ? "is-centered" : ""}`}
            aria-label={`${index + 1}. ${item.title}`}
          >
            <div className="portfolio-stage-skew">
              <Link
                href={`/projects/${item.slug}`}
                className="portfolio-stage-artwork group"
                aria-label={`切换或查看项目：${item.title}`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  if (window.innerWidth > 650 && Math.abs(progress - index) >= 0.08) {
                    goTo(index);
                  } else {
                    openProjectWithCurtain(`/projects/${item.slug}`, item.title, item.english);
                  }
                }}
              >
                {item.cover ? (
                  <span className="portfolio-stage-image">
                    <Image
                      src={item.cover}
                      alt={`${item.title}项目封面`}
                      fill
                      sizes="(max-width: 700px) 90vw, (max-width: 1200px) 52vw, 46vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </span>
                ) : (
                  <span className="portfolio-stage-placeholder"><small>{item.category}</small><span>{item.title}</span><em>封面待补</em></span>
                )}
                <span className="portfolio-stage-artwork-arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
            <span className="portfolio-stage-slide-label">{String(index + 1).padStart(2, "0")} / {item.english || item.title}</span>
          </section>
        ))}
      </div>

      <div className="portfolio-stage-counter" aria-hidden="true">
        <span className="portfolio-stage-counter-label">Selected work</span>
        <span className="portfolio-stage-counter-total">/{items.length}</span>
      </div>
      <span
        key={active}
        className="portfolio-stage-counter-number"
        role="status"
        aria-live="polite"
        aria-label={`当前项目 ${active + 1}，共 ${items.length} 个`}
      >
        {String(active + 1).padStart(2, "0")}
      </span>

      <aside className="portfolio-stage-index" aria-label="作品目录">
        <div className="portfolio-stage-index-inner">
          <p className="portfolio-stage-index-heading">WORK INDEX <span>{String(items.length).padStart(2, "0")}</span></p>
          <div className="portfolio-stage-index-list">
            <div className="portfolio-stage-index-track" style={{ transform: `translateY(${-INDEX_ROW_HEIGHT / 2 - (items.length + progress) * INDEX_ROW_HEIGHT}px)` }}>
              {[0, 1, 2].map((copy) => (
                <div
                  key={copy}
                  className={`portfolio-stage-index-cycle ${copy === 1 ? "portfolio-stage-index-cycle-current" : ""}`}
                  aria-hidden={copy === 1 ? undefined : true}
                >
                  {items.map((item, index) => (
                    <button
                      key={`${copy}-${item.slug}`}
                      type="button"
                      tabIndex={copy === 1 ? 0 : -1}
                      onClick={() => goTo(index)}
                      className={`portfolio-stage-index-item ${copy === 1 && active === index ? "is-active" : ""}`}
                      aria-current={copy === 1 && active === index ? "true" : undefined}
                    >
                      <span className="portfolio-stage-index-count">{String(index + 1).padStart(2, "0")}</span>
                      <span><small>{item.category}</small><strong>{item.title}</strong><em>{item.summary}</em></span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link
            className="portfolio-stage-current-link"
            href={`/projects/${activeItem.slug}`}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              openProjectWithCurtain(`/projects/${activeItem.slug}`, activeItem.title, activeItem.english);
            }}
          >进入当前项目 <span>↗</span></Link>
        </div>
      </aside>
    </main>
  );
}
