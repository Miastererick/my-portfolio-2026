import type { Metadata } from "next";
import { TopNav } from "@/components/layout/TopNav";
import { HomeIntro } from "@/components/HomeIntro";
import { PortfolioShowcase } from "@/components/sections/PortfolioShowcase";
import { categories, coverFor } from "@/lib/portfolio-data";
import { getProjects } from "@/lib/project-store";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `作品集｜${siteContent.ownerName}`,
  description: `浏览${siteContent.ownerName}的全部设计项目与作品。`,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects();
  const items = projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    english: project.english ?? "",
    summary: project.summary,
    role: project.role ?? "设计",
    category: categories.find((category) => category.id === project.category)?.title ?? "项目",
    palette: project.palette,
    cover: coverFor(project) ?? null,
  }));

  return (
    <div className="portfolio-showcase min-h-dvh">
      <HomeIntro />
      <TopNav />
      <PortfolioShowcase items={items} />
    </div>
  );
}
