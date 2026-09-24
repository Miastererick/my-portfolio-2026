import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { categories, coverFor, mediaAssetsFor, projects } from "@/lib/portfolio-data";
import { siteContent } from "@/lib/site-content";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? { title: `${project.title}｜${siteContent.ownerName}作品集`, description: project.summary }
    : { title: "项目未找到" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const category = categories.find((item) => item.id === project.category)!;
  const categoryProjects = projects.filter((item) => item.category === project.category && item.slug !== slug);
  const media = mediaAssetsFor(project);

  return (
    <div className="flex min-h-dvh flex-col bg-[#050606] text-[#eee3d2]">
      <TopNav />
      <main className="flex-1">
        <section className="project-hero relative flex min-h-[640px] items-end overflow-hidden bg-[#101111] pt-40">
          <Image src={coverFor(project)} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050606] via-[#050606]/65 to-black/35" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 sm:px-10 lg:px-16 lg:pb-28">
            <Link href={`/${category.id}`} className="text-sm text-white/60 hover:text-white">← 返回{category.title}</Link>
            <div className="mt-14 h-1 w-20 rounded-full" style={{ background: category.color }} />
            <p className="mt-7 text-sm tracking-[0.22em] text-white/60">{category.english}</p>
            <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">{project.title}</h1>
            {project.english && <p className="mt-5 max-w-4xl text-base text-white/50 sm:text-xl">{project.english}</p>}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-10 lg:grid-cols-[1fr_2fr] lg:gap-24 lg:px-16 lg:py-28">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#e54f10]">PROJECT / 项目介绍</p>
            {project.role && <p className="mt-5 text-sm text-white/50">我的角色<br /><span className="mt-2 inline-block text-lg text-white">{project.role}</span></p>}
            {project.facts && <div className="mt-8 flex flex-wrap gap-2">{project.facts.map((fact) => <span key={fact} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">{fact}</span>)}</div>}
          </div>
          <p className="max-w-3xl text-xl leading-relaxed text-white/80 sm:text-2xl">{project.summary}</p>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-10 lg:px-16 lg:pb-28">
          <div className="grid gap-5 lg:grid-cols-2">
            {project.sections.map((section, index) => (
              <article key={section.heading} className="rounded-3xl border border-white/10 bg-[#111313] p-6 sm:p-9">
                <span className="text-xs text-[#e54f10]">0{index + 1} / PROJECT REVIEW</span>
                <h2 className="mt-4 text-xl font-semibold sm:text-2xl">{section.heading}</h2>
                <p className="mt-5 whitespace-pre-line text-sm leading-8 text-white/60 sm:text-base">{section.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#0b0d0d] px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div><p className="text-xs tracking-[0.3em] text-white/40">VISUAL ARCHIVE</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">作品展示</h2></div>
              <span className="text-sm text-white/40">{String(media.length).padStart(2, "0")} IMAGES</span>
            </div>
            <div className="columns-1 gap-5 md:columns-2">
              {media.map((asset, index) => (
                <figure key={asset.path} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[#191b1b]">
                  <Image src={asset.path} alt={`${project.title}作品图 ${index + 1}`} width={asset.width} height={asset.height} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full" />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-10 lg:px-16">
          <Link href={`/${category.id}`} className="text-sm text-white/55 hover:text-white">← 返回{category.title}</Link>
          {categoryProjects.length > 0 && (
            <div className="mt-12">
              <p className="text-xs tracking-[0.3em] text-[#e54f10]">MORE WORK</p>
              <h2 className="mt-3 text-2xl font-semibold">继续浏览</h2>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {categoryProjects.slice(0, 2).map((item) => (
                  <Link href={`/projects/${item.slug}`} key={item.slug} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                    <span className="text-lg">{item.title}</span><span className="ml-2 text-[#e54f10]">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
