import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { PortfolioContent } from "@/components/sections/PortfolioContent";
import { categories, type CategoryId } from "@/lib/portfolio-data";
import { siteContent } from "@/lib/site-content";

type CategoryPageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const item = categories.find((entry) => entry.id === category);
  return item
    ? { title: `${item.title}｜${siteContent.ownerName}作品集`, description: item.english }
    : { title: "分类未找到" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!categories.some((item) => item.id === category)) notFound();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black">
      <TopNav />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-[68px] pb-24">
        <PortfolioContent categoryId={category as CategoryId} />
      </main>
      <PortfolioFooter placement="fixed" />
    </div>
  );
}
