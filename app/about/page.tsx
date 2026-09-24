import type { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `关于我｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的经历、职业能力、项目成果与服务客户。`,
};

export default function AboutPage() {
  return (
    <div className="h-dvh overflow-hidden bg-black">
      <TopNav />
      <main className="full-page-scroll">
        <PortfolioContent />
      </main>
    </div>
  );
}
