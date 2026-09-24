import { TopNav } from "@/components/layout/TopNav";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";

export function ComingSoonPage({ title, english }: { title: string; english: string }) {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-foreground">
      <TopNav />
      <main className="flex flex-1 items-center justify-center px-6 pt-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-[#e54f10]">{english}</p>
          <h1 className="mt-5 text-4xl font-semibold text-[#eee3d2] sm:text-6xl">{title}</h1>
          <p className="mt-5 text-sm text-white/45">内容整理中</p>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}
