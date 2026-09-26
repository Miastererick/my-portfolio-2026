import type { Metadata } from "next";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { TopNav } from "@/components/layout/TopNav";
import { AboutContent } from "@/components/sections/AboutContent";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `关于我｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的个人介绍、工作经历与联系方式。`,
};

export default function AboutPage() {
  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#000101]">
      <TopNav />
      <main className="min-h-0 flex-1 overflow-y-auto pt-[69px] lg:overflow-hidden">
        <AboutContent />
      </main>
      <PortfolioFooter />
    </div>
  );
}
