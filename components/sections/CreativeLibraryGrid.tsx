"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { CreativeLibraryItem } from "@/lib/creative-library";

const FAVORITES_STORAGE_KEY = "creative-library-favorites-v1";
const LIBRARY_TABS = [
  { label: "全部", href: "/library", key: "all" },
  { label: "提示词", href: "/prompts", key: "prompts" },
  { label: "Skills", href: "/skills", key: "skills" },
] as const;

export function CreativeLibraryGrid({ items, section }: { items: CreativeLibraryItem[]; section: "all" | "prompts" | "skills" }) {
  const [columnCount, setColumnCount] = useState<number | null>(null);
  const [selected, setSelected] = useState<CreativeLibraryItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [panelScrolled, setPanelScrolled] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [celebration, setCelebration] = useState<{ url: string; key: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const readFavorites = () => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
        setFavorites(Array.isArray(saved) ? saved.filter((value): value is string => typeof value === "string") : []);
      } catch {
        setFavorites([]);
      }
    };
    readFavorites();
    window.addEventListener("storage", readFavorites);
    return () => window.removeEventListener("storage", readFavorites);
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumnCount(width >= 1280 ? 6 : width >= 1024 ? 4 : width >= 768 ? 3 : 2);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const lockPageScroll = window.innerWidth < 1024;
    if (lockPageScroll) document.body.style.overflow = "hidden";
    panelRef.current?.scrollTo({ top: 0, behavior: "auto" });
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      if (lockPageScroll) document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [selected]);

  const images = selected
    ? selected.images ?? (selected.cover && selected.width && selected.height
      ? [{ src: selected.cover, width: selected.width, height: selected.height, alt: `${selected.name}效果图` }]
      : [])
    : [];
  const activeImage = images[imageIndex];
  const visibleItems = favoritesOnly ? items.filter((item) => favorites.includes(item.githubUrl)) : items;
  const layoutColumns = selected && columnCount !== null ? Math.min(columnCount, columnCount >= 6 ? 4 : 3) : columnCount;
  const visibleColumns = layoutColumns === null ? null : Math.max(1, Math.min(layoutColumns, visibleItems.length));

  function toggleFavorite(item: CreativeLibraryItem) {
    const wasFavorite = favorites.includes(item.githubUrl);
    const nextFavorites = wasFavorite
      ? favorites.filter((url) => url !== item.githubUrl)
      : [...favorites, item.githubUrl];
    setFavorites(nextFavorites);
    if (!wasFavorite && !reduceMotion) setCelebration({ url: item.githubUrl, key: Date.now() });
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
    } catch {
      // The current tab can still show the updated state when storage is unavailable.
    }
    if (favoritesOnly && !nextFavorites.includes(item.githubUrl) && selected?.githubUrl === item.githubUrl) setSelected(null);
  }

  function openItem(item: CreativeLibraryItem, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    if (selected?.githubUrl === item.githubUrl) {
      setSelected(null);
      return;
    }
    setImageIndex(0);
    setPanelScrolled(false);
    setSelected(item);
  }

  function renderCard(item: CreativeLibraryItem) {
    const isFavorite = favorites.includes(item.githubUrl);
    const isCelebrating = celebration?.url === item.githubUrl;
    return (
      <div
        key={item.githubUrl}
        className={`creative-library-card group relative w-full rounded-2xl text-left transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.025] focus-within:z-10 focus-within:scale-[1.025] ${item.cover ? "creative-library-card-image" : "creative-library-card-empty"}`}
      >
        <button
          type="button"
          onClick={(event) => openItem(item, event.currentTarget)}
          className="block w-full cursor-pointer rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E54F10]"
          aria-label={`查看${item.name}详情`}
          aria-expanded={selected?.githubUrl === item.githubUrl}
          aria-controls="creative-library-details"
        >
          {item.cover && item.width && item.height ? (
            <span className="creative-library-cover relative block overflow-hidden rounded-2xl">
              <Image src={item.cover} alt="" width={item.width} height={item.height} sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" unoptimized={process.env.NODE_ENV === "development"} className="h-auto w-full" />
              <span className="creative-library-open pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#E54F10] text-lg text-white shadow-lg" aria-hidden="true">↗</span>
              </span>
            </span>
          ) : null}
          <span className={`${item.cover ? "mt-3 px-1" : "creative-library-name-empty min-h-[76px] rounded-xl px-4 py-3"} creative-library-name block`}>
            <span className={`block text-[13px] font-medium leading-5 transition-colors duration-200 group-hover:text-[#E54F10] sm:text-sm ${item.cover ? "" : "truncate"}`}>{item.name}</span>
            <span className={`site-muted-text mt-1 block text-xs leading-5 sm:text-[13px] ${item.cover ? "" : "truncate"}`}>{item.styleDescription}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(item)}
          className={`creative-library-save absolute right-2 top-2 z-20 flex min-h-9 items-center justify-center rounded-[20px] px-4 py-2 text-[14px] font-semibold leading-none text-white shadow-lg transition-[background-color,opacity,transform] hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E54F10] ${isCelebrating ? "creative-library-save-celebrating" : ""} ${isFavorite ? "bg-[#111] hover:bg-[#2a2a2a]" : "bg-[#E54F10] hover:bg-[#c8430c]"}`}
          aria-label={`${isFavorite ? "取消收藏" : "收藏"}${item.name}`}
          aria-pressed={isFavorite}
          title={isFavorite ? "取消收藏" : "收藏"}
        >
          {isFavorite ? "已保存" : "保存"}
          <AnimatePresence>
            {isCelebrating && celebration ? (
              <motion.span
                key={celebration.key}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.3, 1.1, 1.45] }}
                transition={{ duration: 0.65, times: [0, 0.25, 0.6, 1] }}
                onAnimationComplete={() => setCelebration((current) => current?.key === celebration.key ? null : current)}
                aria-hidden="true"
              >
                <span className="text-2xl text-white drop-shadow-md">♥</span>
                {Array.from({ length: 6 }, (_, index) => {
                  const angle = (index * Math.PI) / 3;
                  return <motion.span key={index} className="absolute size-1.5 rounded-full bg-[#ffb47f]" initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }} animate={{ x: Math.cos(angle) * 42, y: Math.sin(angle) * 42, opacity: 0, scale: 1 }} transition={{ duration: 0.55, ease: "easeOut" }} />;
                })}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
        <div>
          <p className="text-xs tracking-[0.28em] text-[#E54F10]">CREATIVE LIBRARY</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">创作资源</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex items-center gap-2" aria-label="创作资源分类">
            {LIBRARY_TABS.map((tab) => (
              <Link key={tab.key} href={tab.href} aria-current={section === tab.key ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm transition-colors ${section === tab.key ? "border-[#E54F10] bg-[#E54F10] text-white" : "site-border-subtle site-muted-text hover:border-[#E54F10] hover:text-[#E54F10]"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>
          <button type="button" onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${favoritesOnly ? "border-[#E54F10] bg-[#E54F10] text-white" : "site-border-subtle site-muted-text hover:border-[#E54F10] hover:text-[#E54F10]"}`}>
            <svg viewBox="0 0 48 48" width="16" height="16" fill="none" className="size-4 shrink-0" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M16.8712 33.0437L15.9976 44.7037C15.9362 45.5231 16.6646 46.0874 17.3161 45.7222C21.9289 43.1384 36.3783 33.6481 43.7017 12.7901C44.0376 11.8333 43.1352 10.9699 42.3646 11.5096C38.0387 14.5391 28.5846 20.8008 22.7421 21.9935C22.7421 21.9935 26.4836 19.3948 28.7231 15.4055C28.9426 15.0144 28.9244 14.5138 28.6796 14.1608L20.5127 2.38942C20.0287 1.69163 19.0354 1.98074 18.8606 2.87019L16.3181 15.8074L4.38437 26.2228C3.78602 26.7448 3.90808 27.7998 4.5989 28.0792L16.8712 33.0437Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M37.9745 28.4481C37.2188 29.5026 35.5908 31.6718 34.0876 32.9975C33.7871 33.2625 33.8276 33.707 34.1724 33.9235L42.1145 38.9092C42.5926 39.2092 43.2384 38.853 43.1576 38.3325C42.7882 35.9498 41.7237 30.982 39.0328 28.3743C38.7322 28.0832 38.2142 28.1138 37.9745 28.4481Z" fill="currentColor" />
            </svg>
            我的画板
          </button>
        </div>
      </header>
      <div className={`creative-library-results transition-[padding-right] duration-300 ease-out ${selected ? "lg:pr-[min(32vw,560px)]" : ""}`}>
      {visibleItems.length === 0 ? (
        <p className="site-muted-text py-20 text-center text-sm">我的画板还是空的。点击卡片上的「保存」即可添加作品。</p>
      ) : visibleColumns === null ? (
        <div className="creative-library-grid creative-library-enter grid grid-cols-2 items-start gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6">
          {visibleItems.map(renderCard)}
        </div>
      ) : (
        <div className="creative-library-grid creative-library-enter grid gap-5 xl:gap-6" style={{ gridTemplateColumns: `repeat(${visibleColumns}, minmax(0, 1fr))` }}>
          {Array.from({ length: visibleColumns }, (_, columnIndex) => (
            <div key={columnIndex} className="flex min-w-0 flex-col gap-5 xl:gap-6">
              {visibleItems.filter((_, itemIndex) => itemIndex % visibleColumns === columnIndex).map(renderCard)}
            </div>
          ))}
        </div>
      )}
      </div>

      <AnimatePresence>
        {selected ? (
        <motion.aside
          ref={panelRef}
          id="creative-library-details"
          aria-labelledby="creative-library-details-title"
          className="fixed inset-y-0 right-0 z-[60] flex h-dvh w-full flex-col overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--background)] text-[var(--foreground)] shadow-[-24px_0_60px_rgba(0,0,0,0.24)] lg:w-[min(32vw,560px)]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
          onScroll={(event) => setPanelScrolled(event.currentTarget.scrollTop > 100)}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--background)] px-6 py-4 sm:px-8 lg:px-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={panelScrolled ? selected.name : "library"}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
                className={panelScrolled ? "truncate text-sm font-semibold" : "text-xs tracking-[0.25em] text-[#E54F10]"}
              >
                {panelScrolled ? selected.name : "CREATIVE LIBRARY"}
              </motion.span>
            </AnimatePresence>
            <button ref={closeButtonRef} type="button" onClick={() => setSelected(null)} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-xl transition-colors hover:border-[#E54F10] hover:text-[#E54F10] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E54F10]" aria-label="关闭作品详情">×</button>
          </div>

          <div className="px-6 pb-10 pt-8 sm:px-8 lg:px-10">
            <h2 id="creative-library-details-title" className="text-2xl font-semibold leading-snug sm:text-3xl">{selected.name}</h2>
            <p className="site-muted-text mt-2 text-sm">{selected.styleDescription}</p>

            <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <h3 className="text-sm font-semibold">介绍</h3>
              <p className="site-muted-text mt-3 text-sm leading-7 sm:text-base">{selected.description}</p>
            </section>
            <section className="mt-7 border-t border-[var(--border-subtle)] pt-6">
              <h3 className="text-sm font-semibold">适用范围</h3>
              <p className="site-muted-text mt-3 text-sm leading-7 sm:text-base">{selected.useCases}</p>
            </section>
            <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E54F10] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E54F10]">前往 GitHub <span aria-hidden="true">↗</span></a>

            {activeImage ? (
              <section className="mt-10" aria-label="作品效果图">
                <p className="mb-4 text-sm font-semibold">效果图</p>
                <div className="creative-library-preview relative h-[min(56dvh,620px)] overflow-hidden rounded-xl">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeImage.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
                      <Image src={activeImage.src} alt={activeImage.alt} fill sizes="(min-width: 1024px) 44vw, 100vw" unoptimized={process.env.NODE_ENV === "development"} className="object-contain object-center" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                {images.length > 1 ? (
                  <div className="mt-5 flex max-w-full items-center justify-center gap-2">
                    <button type="button" onClick={() => setImageIndex((index) => (index - 1 + images.length) % images.length)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-sm hover:border-[#E54F10]" aria-label="上一张效果图">←</button>
                    <div className="flex max-w-[min(60vw,320px)] gap-2 overflow-x-auto py-1">
                      {images.map((image, index) => (
                        <button key={image.src} type="button" onClick={() => setImageIndex(index)} className={`flex h-[72px] w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 ${index === imageIndex ? "border-[#E54F10]" : "border-transparent"}`} aria-label={`查看第 ${index + 1} 张效果图`} aria-current={index === imageIndex ? "true" : undefined}>
                          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="56px" unoptimized={process.env.NODE_ENV === "development"} className="h-full w-full object-contain" />
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setImageIndex((index) => (index + 1) % images.length)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-sm hover:border-[#E54F10]" aria-label="下一张效果图">→</button>
                  </div>
                ) : null}
              </section>
            ) : null}
            </div>
        </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
