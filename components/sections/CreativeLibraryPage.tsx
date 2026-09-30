"use client";

import { useEffect, useState } from "react";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { TopNav } from "@/components/layout/TopNav";
import { CreativeLibraryGrid } from "@/components/sections/CreativeLibraryGrid";
import type { CreativeLibraryItem } from "@/lib/creative-library";

type LibrarySection = "all" | "prompts" | "skills";

export function CreativeLibraryPage({
  section,
  items,
}: {
  section: LibrarySection;
  items: CreativeLibraryItem[];
}) {
  const [toolbarPinned, setToolbarPinned] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 400);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <div className="creative-library-shell flex min-h-dvh flex-col bg-[var(--background)] text-[var(--foreground)]">
      <TopNav librarySidebar={toolbarPinned} alignHomeWithSidebar />
      <main className="creative-library-page w-full flex-1 px-5 pb-16 pt-28 sm:px-8 lg:px-[100px]">
        <CreativeLibraryGrid items={items} section={section} onPinnedChange={setToolbarPinned} />
      </main>
      <PortfolioFooter />
      {showBackToTop && (
        <button
          type="button"
          aria-label="返回顶部"
          title="返回顶部"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
          })}
          className="fixed bottom-16 right-6 z-30 flex size-11 items-center justify-center rounded-full border border-[var(--border-subtle)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 5h14M6 13l6-6 6 6M12 7v13" />
          </svg>
        </button>
      )}
    </div>
  );
}
