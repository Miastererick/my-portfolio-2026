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
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--background)] text-[var(--foreground)]">
      <TopNav />
      <main className="w-full flex-1 px-5 pb-16 pt-28 sm:px-8 lg:px-[100px]">
        <CreativeLibraryGrid items={items} section={section} />
      </main>
      <PortfolioFooter />
    </div>
  );
}
