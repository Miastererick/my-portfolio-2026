"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useCallback, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FavoriteStar } from "@/components/icons/FavoriteStar";
import { FavoriteBurst } from "@/components/sections/FavoriteBurst";
import { LibraryPrompt } from "@/components/sections/LibraryPrompt";
import { SiteDropdown } from "@/components/layout/SiteDropdown";
import type { CreativeLibraryItem } from "@/lib/creative-library";
import { LIBRARY_CATEGORIES, getCreativeLibraryCategories, type LibraryCategory } from "@/lib/creative-library-filters";

const FAVORITES_STORAGE_KEY = "creative-library-favorites-v1";
const PAGE_SIZE = 24;
const LOAD_MORE_MARGIN = "400px 0px";
const CARD_REVEAL = { distance: 60, duration: 0.7, stagger: 0.1, start: "top 92%" };
const LIBRARY_TABS = [
  { label: "全部", href: "/library", key: "all" },
  { label: "提示词", href: "/prompts", key: "prompts" },
  { label: "Skills", href: "/skills", key: "skills" },
] as const;

export function CreativeLibraryGrid({ items, section, onPinnedChange }: { items: CreativeLibraryItem[]; section: "all" | "prompts" | "skills"; onPinnedChange?: (pinned: boolean) => void }) {
  const [columnCount, setColumnCount] = useState<number | null>(null);
  const [selected, setSelected] = useState<CreativeLibraryItem | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [panelScrolled, setPanelScrolled] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [category, setCategory] = useState<LibraryCategory>("全部");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [celebration, setCelebration] = useState<{ url: string; key: number } | null>(null);
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const toolbarSentinelRef = useRef<HTMLDivElement>(null);
  const revealedItemsRef = useRef(new Set<string>());

  useEffect(() => {
    const sentinel = toolbarSentinelRef.current;
    if (!sentinel || !onPinnedChange) return;
    const observer = new IntersectionObserver(([entry]) => {
      onPinnedChange(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onPinnedChange]);

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
    const onOutsidePointerDown = (event: PointerEvent) => {
      const panel = panelRef.current;
      const target = event.target;
      if (!panel || !(target instanceof Element) || panel.contains(target)) return;
      if (event.clientX >= panel.getBoundingClientRect().left) return;
      if (target.closest("button, a, input, select, textarea, label, summary, [role='button'], [role='link'], .creative-library-card")) return;
      setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutsidePointerDown);
    return () => {
      if (lockPageScroll) document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onOutsidePointerDown);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [selected]);

  const images = selected
    ? selected.images ?? (selected.cover && selected.width && selected.height
      ? [{ src: selected.cover, width: selected.width, height: selected.height, alt: `${selected.name}效果图` }]
      : [])
    : [];
  const activeImage = images[imageIndex];
  const taggedItems = useMemo(() => items.map((item) => ({ item, categories: getCreativeLibraryCategories(item) })), [items]);
  const searchQuery = query.trim().toLocaleLowerCase();
  const filteredItems = taggedItems.filter(({ item, categories }) =>
    (!favoritesOnly || favorites.includes(item.githubUrl)) &&
    (category === "全部" || categories.includes(category)) &&
    (!searchQuery || `${item.name} ${item.styleDescription} ${item.description} ${item.useCases} ${categories.join(" ")}`.toLocaleLowerCase().includes(searchQuery))
  ).map(({ item }) => item).sort((a, b) => {
    if (sortOrder === "name-asc") return a.name.localeCompare(b.name, "zh-CN", { numeric: true });
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name, "zh-CN", { numeric: true });
    if (sortOrder === "favorites") return Number(favorites.includes(b.githubUrl)) - Number(favorites.includes(a.githubUrl));
    return 0;
  });
  const visibleItems = filteredItems.slice(0, visibleCount);
  const layoutColumns = selected && columnCount !== null ? Math.min(columnCount, columnCount >= 6 ? 4 : 3) : columnCount;
  const visibleColumns = layoutColumns === null ? null : Math.max(1, Math.min(layoutColumns, visibleItems.length));
  const visibleItemKeys = JSON.stringify(visibleItems.map((item) => item.githubUrl));
  const categoryLimit = columnCount === null || columnCount >= 6 ? 14 : columnCount >= 4 ? 10 : columnCount >= 3 ? 6 : 4;
  const primaryCategories = LIBRARY_CATEGORIES.slice(0, categoryLimit);
  const moreCategories = LIBRARY_CATEGORIES.slice(categoryLimit);

  function selectCategory(label: LibraryCategory) {
    setCategory(label);
    setVisibleCount(PAGE_SIZE);
    setSelected(null);
  }

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= filteredItems.length) return;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!active || !entry.isIntersecting) return;
      active = false;
      observer.disconnect();
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredItems.length));
    }, { rootMargin: LOAD_MORE_MARGIN });
    observer.observe(target);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [visibleCount, filteredItems.length]);

  useLayoutEffect(() => {
    const root = resultsRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    let active = true;
    let refreshFrame = 0;
    const context = gsap.context(() => {}, root);
    context.add(() => {
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".creative-library-reveal"));
      const pending = cards.filter((card) => !revealedItemsRef.current.has(card.dataset.resource!));
      const shown = cards.filter((card) => revealedItemsRef.current.has(card.dataset.resource!));
      if (shown.length) gsap.set(shown.map((card) => card.firstElementChild), { opacity: 1, y: 0 });
      if (!pending.length) return;
      if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(pending.map((card) => card.firstElementChild), { opacity: 1, y: 0 });
        return;
      }
      gsap.set(pending.map((card) => card.firstElementChild), { opacity: 0, y: CARD_REVEAL.distance });
      // Record callback-created tweens in this context so route/filter changes clean them up.
      function reveal(batch: Element[]) {
        if (!active) return;
        context.add(() => {
          const ordered = [...batch].sort((a, b) => {
            const first = a.getBoundingClientRect();
            const second = b.getBoundingClientRect();
            return Math.abs(first.top - second.top) < 24 ? first.left - second.left : first.top - second.top;
          });
          ordered.forEach((card) => revealedItemsRef.current.add((card as HTMLElement).dataset.resource!));
          gsap.to(ordered.map((card) => card.firstElementChild), {
            opacity: 1, y: 0, duration: CARD_REVEAL.duration,
            stagger: CARD_REVEAL.stagger, ease: "power3.out", overwrite: "auto",
          });
        });
      }
      ScrollTrigger.batch(pending, {
        start: CARD_REVEAL.start,
        once: true,
        interval: 0.1,
        batchMax: visibleColumns ?? 6,
        onEnter: reveal,
        onEnterBack: reveal,
      });
    });
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    observer.observe(root);
    return () => {
      active = false;
      observer.disconnect();
      cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [visibleItemKeys, visibleColumns, reduceMotion]);

  const completeCelebration = useCallback((key: number) => {
    setCelebration((current) => current?.key === key ? null : current);
  }, []);

  function toggleFavorite(item: CreativeLibraryItem) {
    const wasFavorite = favorites.includes(item.githubUrl);
    const nextFavorites = wasFavorite
      ? favorites.filter((url) => url !== item.githubUrl)
      : [...favorites, item.githubUrl];
    setFavorites(nextFavorites);
    if (!wasFavorite && !reduceMotion) setCelebration({ url: item.githubUrl, key: Date.now() });
    if (wasFavorite && celebration?.url === item.githubUrl) setCelebration(null);
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
      <div key={item.githubUrl} className="creative-library-reveal relative w-full hover:z-10 focus-within:z-10" data-resource={item.githubUrl}>
      <div className="creative-library-reveal-content">
      <div
        className={`creative-library-card group relative w-full rounded-2xl text-left transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.025] focus-within:z-10 focus-within:scale-[1.025] ${item.cover ? "creative-library-card-image" : "creative-library-card-empty"}`}
      >
        <button
          type="button"
          onClick={(event) => openItem(item, event.currentTarget)}
          className="block w-full cursor-pointer rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E74E44]"
          aria-label={`查看${item.name}详情`}
          aria-expanded={selected?.githubUrl === item.githubUrl}
          aria-controls="creative-library-details"
        >
          {item.cover && item.width && item.height ? (
            <span className="creative-library-cover relative block overflow-hidden rounded-2xl">
              <Image src={item.cover} alt="" width={item.width} height={item.height} sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" unoptimized={process.env.NODE_ENV === "development" || item.cover.startsWith("/library/xxd/")} className="h-auto w-full" />
              <span className="creative-library-open pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#E74E44] text-lg text-white shadow-lg" aria-hidden="true">↗</span>
              </span>
            </span>
          ) : null}
          <span className={`${item.cover ? "mt-3 px-1" : "creative-library-name-empty min-h-[76px] rounded-xl px-4 py-3"} creative-library-name block`}>
            <span className={`creative-library-card-title block text-[13px] font-semibold leading-5 transition-colors duration-200 group-hover:text-[#E74E44] sm:text-sm ${item.cover ? "" : "truncate"}`}>{item.name}</span>
            <span className={`site-muted-text mt-1 block text-xs leading-5 ${item.cover ? "line-clamp-2" : "truncate"}`}>{item.styleDescription.replace(/^小小东\s*·\s*/, "")}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(item)}
          className={`creative-library-save absolute right-2 top-2 z-20 flex min-h-9 items-center justify-center rounded-[20px] px-4 py-2 text-[14px] font-semibold leading-none text-white shadow-lg transition-[background-color,filter,opacity,transform] hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E74E44] ${isCelebrating ? "creative-library-save-celebrating" : ""} ${isFavorite ? "bg-[#111] hover:bg-[#2a2a2a]" : "bg-[#E74E44] hover:brightness-90"}`}
          aria-label={`${isFavorite ? "取消收藏" : "收藏"}${item.name}`}
          aria-pressed={isFavorite}
          title={isFavorite ? "取消收藏" : "收藏"}
        >
          {isFavorite ? "已收藏" : "收藏"}
          {isCelebrating && celebration ? <FavoriteBurst key={celebration.key} id={celebration.key} onComplete={completeCelebration} /> : null}
        </button>
      </div>
      </div>
      </div>
    );
  }

  return (
    <>
      <div ref={toolbarSentinelRef} className="-mb-px h-px" aria-hidden="true" />
      <header className="mb-7 pt-4 sm:mb-8">
        <h1 className="text-3xl font-semibold tracking-[-0.025em] sm:text-5xl">创作资源</h1>
      </header>
      <div className="creative-library-toolbar sticky top-[68px] z-40 mb-6 bg-[var(--background)] lg:top-0">
        <div className="w-full">
          <div className="site-border-subtle flex min-h-14 items-stretch justify-between gap-6 border-b">
            <nav className="flex min-w-0 flex-1 items-stretch gap-6 overflow-x-auto" aria-label="资源内容分类">
              {primaryCategories.map((label) => (
                <button key={label} type="button" aria-pressed={category === label} onClick={() => selectCategory(label)} className={`shrink-0 cursor-pointer border-b-2 px-0 pb-4 pt-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E74E44] ${category === label ? "border-[var(--foreground)] text-[var(--foreground)]" : "site-muted-text border-transparent hover:text-[var(--foreground)]"}`}>
                  {label}
                </button>
              ))}
            </nav>
            {moreCategories.length > 0 && <SiteDropdown
              label={moreCategories.includes(category) ? category : "更多"}
              ariaLabel="更多资源分类"
              value={category}
              options={moreCategories.map((label) => ({ value: label, label }))}
              onSelect={selectCategory}
              triggerClassName={`flex h-full cursor-pointer items-center gap-2 border-b-2 pb-1 text-sm ${moreCategories.includes(category) ? "border-[var(--foreground)] text-[var(--foreground)]" : "site-muted-text border-transparent"}`}
            />}
          </div>
          <div className="creative-library-controls site-border-subtle flex flex-wrap items-center gap-3 border-b py-3">
            <nav className="site-border-subtle inline-flex rounded-xl border" style={{ borderRadius: 12 }} aria-label="创作资源类型">
              {LIBRARY_TABS.map((tab) => (
                <Link key={tab.key} href={tab.href} onClick={() => { setFavoritesOnly(false); setVisibleCount(PAGE_SIZE); }} aria-current={!favoritesOnly && section === tab.key ? "page" : undefined} style={{ borderRadius: 12, ...(!favoritesOnly && section === tab.key ? { backgroundColor: "#121212", color: "#fff", borderColor: "#121212" } : {}) }} className={`creative-library-control site-border-subtle min-h-11 rounded-xl border-r px-4 py-3 text-center text-sm font-medium transition-colors last:border-r-0 sm:px-6 ${!favoritesOnly && section === tab.key ? "" : "site-muted-text hover:bg-black/5 hover:text-[var(--foreground)]"}`}>
                  {tab.label}
                </Link>
              ))}
            </nav>
            <div className="creative-library-search min-w-[180px] flex-1">
              <label className="sr-only" htmlFor="creative-library-search">搜索创作资源</label>
              <input id="creative-library-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="搜索全部创作资源" style={{ borderRadius: 12 }} className="site-border-subtle min-h-11 w-full rounded-xl border bg-transparent px-4 text-sm outline-none placeholder:text-[var(--text-muted)] focus:border-[#E74E44]" />
            </div>
            <SiteDropdown
              id="creative-library-sort"
              ariaLabel="资源排序"
              label={{ recommended: "推荐排序", "name-asc": "名称升序", "name-desc": "名称降序", favorites: "收藏优先" }[sortOrder] ?? "推荐排序"}
              value={sortOrder}
              options={[
                { value: "recommended", label: "推荐排序" },
                { value: "name-asc", label: "名称升序" },
                { value: "name-desc", label: "名称降序" },
                { value: "favorites", label: "收藏优先" },
              ]}
              onSelect={(value) => { setSortOrder(value); setVisibleCount(PAGE_SIZE); }}
              active={sortOrder !== "recommended"}
              triggerStyle={{ borderRadius: 12, ...(sortOrder !== "recommended" ? { backgroundColor: "#121212", color: "#fff", borderColor: "#121212" } : {}) }}
              triggerClassName="creative-library-control site-border-subtle flex min-h-11 cursor-pointer items-center gap-4 rounded-xl border bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[#E74E44]"
            />
            <button type="button" onClick={() => { setFavoritesOnly((value) => !value); setVisibleCount(PAGE_SIZE); }} aria-pressed={favoritesOnly} style={{ borderRadius: 12, ...(favoritesOnly ? { backgroundColor: "#121212", color: "#fff", borderColor: "#121212" } : {}) }} className={`creative-library-control site-border-subtle inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors sm:px-5 ${favoritesOnly ? "" : "site-muted-text hover:bg-black/5 hover:text-[var(--foreground)]"}`}>
              <FavoriteStar />
              收藏夹
            </button>
          </div>
        </div>
      </div>
      <div ref={resultsRef} className={`creative-library-results transition-[padding-right] duration-300 ease-out ${selected ? "lg:pr-[min(32vw,560px)]" : ""}`}>
      {visibleItems.length === 0 ? (
        <p className="site-muted-text py-20 text-center text-sm">{searchQuery ? "没有找到匹配的资源。" : category !== "全部" ? "这个分类暂时没有资源。" : favoritesOnly ? "收藏夹还是空的。点击卡片上的「收藏」即可添加作品。" : "暂无资源。"}</p>
      ) : visibleColumns === null ? (
        <div className="creative-library-grid grid grid-cols-2 items-start gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6">
          {visibleItems.map(renderCard)}
        </div>
      ) : (
        <div className="creative-library-grid grid gap-5 xl:gap-6" style={{ gridTemplateColumns: `repeat(${visibleColumns}, minmax(0, 1fr))` }}>
          {Array.from({ length: visibleColumns }, (_, columnIndex) => (
            <div key={columnIndex} className="flex min-w-0 flex-col gap-5 xl:gap-6">
              {visibleItems.filter((_, itemIndex) => itemIndex % visibleColumns === columnIndex).map(renderCard)}
            </div>
          ))}
        </div>
      )}
      {visibleCount < filteredItems.length ? (
        <div ref={loadMoreRef} className="h-16" aria-hidden="true" />
      ) : filteredItems.length > PAGE_SIZE ? (
        <p className="site-muted-text py-10 text-center text-xs">已经到底了</p>
      ) : null}
      <p className="sr-only" role="status">已展示 {visibleItems.length} 项资源</p>
      </div>

      <AnimatePresence>
        {selected ? (
        <motion.aside
          ref={panelRef}
          id="creative-library-details"
          aria-labelledby="creative-library-details-title"
          className="fixed inset-y-0 right-0 z-[60] flex h-dvh w-full flex-col overflow-y-auto border-l border-[var(--border-subtle)] bg-[var(--background)] text-[var(--foreground)] lg:w-[min(32vw,560px)]"
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
                className={panelScrolled ? "truncate text-sm font-semibold" : "text-xs tracking-[0.25em] text-[#E74E44]"}
              >
                {panelScrolled ? selected.name : "CREATIVE LIBRARY"}
              </motion.span>
            </AnimatePresence>
            <button ref={closeButtonRef} type="button" onClick={() => setSelected(null)} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] transition-colors hover:border-[#E74E44] hover:text-[#E74E44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E74E44]" aria-label="关闭作品详情"><svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
          </div>

          <div className="px-6 pb-10 pt-8 sm:px-8 lg:px-10">
            <h2 id="creative-library-details-title" className="text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">{selected.name}</h2>
            <p className="site-muted-text mt-2 text-sm">{selected.styleDescription.replace(/^小小东\s*·\s*/, "")}</p>

            <section className="mt-8 border-t border-[var(--border-subtle)] pt-6">
              <h3 className="text-sm font-semibold">介绍</h3>
              <p className="site-muted-text mt-3 text-sm leading-7 sm:text-base">{selected.description}</p>
            </section>
            <section className="mt-7 border-t border-[var(--border-subtle)] pt-6">
              <h3 className="text-sm font-semibold">适用范围</h3>
              <p className="site-muted-text mt-3 text-sm leading-7 sm:text-base">{selected.useCases}</p>
            </section>
            {!selected.githubUrl.startsWith("https://vip.xiaoxiaodong.ai/") && (
              <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#E74E44] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E74E44]">{selected.githubUrl.startsWith("https://github.com/") ? "前往 GitHub" : "查看来源"} <span aria-hidden="true">↗</span></a>
            )}
            {selected.promptPath ? <LibraryPrompt key={selected.promptPath} path={selected.promptPath} /> : null}

            {activeImage ? (
              <section className="mt-10" aria-label="作品效果图">
                <p className="mb-4 text-sm font-semibold">效果图</p>
                <div className="creative-library-preview w-full">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeImage.src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
                      <Image src={activeImage.src} alt={activeImage.alt} width={activeImage.width} height={activeImage.height} sizes="(min-width: 1750px) 480px, (min-width: 1024px) 32vw, 100vw" unoptimized={process.env.NODE_ENV === "development" || activeImage.src.startsWith("/library/xxd/")} className="block h-auto w-full" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                {images.length > 1 ? (
                  <div className="mt-5 flex max-w-full items-center justify-center gap-2">
                    <button type="button" onClick={() => setImageIndex((index) => (index - 1 + images.length) % images.length)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-sm hover:border-[#E74E44]" aria-label="上一张效果图">←</button>
                    <div className="flex max-w-[min(60vw,320px)] gap-2 overflow-x-auto py-1">
                      {images.map((image, index) => (
                        <button key={image.src} type="button" onClick={() => setImageIndex(index)} className={`flex h-[72px] w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 ${index === imageIndex ? "border-[#E74E44]" : "border-transparent"}`} aria-label={`查看第 ${index + 1} 张效果图`} aria-current={index === imageIndex ? "true" : undefined}>
                          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="56px" unoptimized={process.env.NODE_ENV === "development"} className="h-full w-full object-contain" />
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setImageIndex((index) => (index + 1) % images.length)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-sm hover:border-[#E74E44]" aria-label="下一张效果图">→</button>
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
