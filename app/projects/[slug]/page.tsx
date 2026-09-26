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
  const coverPath = coverFor(project);
  const cover = coverPath ? media.find((asset) => asset.path === coverPath) : undefined;
  const storyMedia = cover ? media.filter((asset) => asset.path !== cover.path) : media;
  const useWhiteBackground = slug === "ikea-studio" || slug === "substation-intelligence";

  return (
    <div className={`project-detail-page flex min-h-dvh flex-col ${useWhiteBackground ? "project-detail-page--light-default bg-[#f2f0e9] text-[#121212]" : "bg-[#050606] text-[#eee3d2]"}`}>
      <TopNav defaultTheme={useWhiteBackground ? "light" : "dark"} />
      <main className="flex-1 pt-[68px]">
        <section className="relative w-full">
          {cover && (
            <figure className="w-full overflow-hidden bg-[#111313]">
              <Image src={cover.path} alt={`${project.title}主视觉`} width={cover.width} height={cover.height} priority sizes="100vw" className="h-auto w-full" />
            </figure>
          )}
          {!cover && (
            <figure className="w-full overflow-hidden bg-[#111313]" aria-label={`${project.title}封面待补充`}>
              <div className="flex aspect-[16/9] w-full items-center justify-center border-y border-white/10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.055),transparent_62%)]">
                <div className="text-center">
                  <p className="text-xs tracking-[0.28em] text-white/35">PROJECT COVER / 待补充</p>
                  <p className="mt-3 text-lg text-white/50">{project.title}</p>
                </div>
              </div>
            </figure>
          )}
          <Link href={`/${category.id}`} className="absolute left-5 top-6 z-20 text-sm text-white/50 transition-colors hover:text-white sm:left-10 lg:left-16 lg:top-8">← 返回{category.title}</Link>
        </section>

        <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-12 sm:px-10 lg:px-16 lg:pb-14 lg:pt-16">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-xs tracking-[0.24em] text-[#e54f10]">{category.english}</p>
              <h1 className="mt-4 whitespace-nowrap text-[clamp(1.25rem,4.2vw,4.5rem)] font-semibold leading-[1.08] tracking-tight">{project.title}</h1>
              {project.english && <p className="mt-4 max-w-4xl text-base text-white/45 sm:text-lg">{project.english}</p>}
            </div>
            <span className="mb-2 h-1 w-16 rounded-full" style={{ background: category.color }} />
          </div>
        </section>

        <section className="relative isolate mx-auto max-w-[1600px] overflow-hidden border-b border-white/10 px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
          <Image
            src="/textures/project-background.svg"
            alt=""
            aria-hidden="true"
            width={847}
            height={823}
            sizes="(max-width: 768px) 42vw, 520px"
            className={`pointer-events-none absolute right-0 top-1/2 z-0 h-auto w-[min(42vw,520px)] -translate-y-1/2 ${useWhiteBackground ? "opacity-35" : "opacity-80"}`}
          />
          <div className="relative z-10">
            <p className="mb-6 text-xs tracking-[0.24em] text-[#e54f10]">MY ROLE / 我的职责</p>
            <p className="max-w-[1100px] text-[18px] leading-relaxed text-[#FFFFFF]">{project.summary}</p>
            <div className="mt-12">
              {project.role && (
                <div className="flex items-center gap-4">
                  <div className="relative aspect-[1.84] w-[clamp(95px,10.2vw,133px)] shrink-0 overflow-hidden rounded-[19px] bg-white/10">
                    <Image
                      src="/profile/my-avatar.png"
                      alt="个人头像"
                      fill
                      sizes="(max-width: 768px) 95px, 133px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base leading-snug text-[#eee3d2] sm:text-lg">{project.role}</p>
                    <p className="mt-2 text-sm text-white/45">我的角色</p>
                  </div>
                </div>
              )}
              {project.facts && <div className="mt-7 flex flex-wrap gap-2">{project.facts.map((fact) => <span key={fact} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/65">{fact}</span>)}</div>}
            </div>
          </div>
        </section>

        {project.sections[0] && (
          <section className="mx-auto grid max-w-[1600px] gap-5 border-b border-white/10 px-5 py-14 sm:px-10 sm:py-16 lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,1fr)] lg:gap-16 lg:px-16 lg:py-24">
            <div>
              <span className="text-xs tracking-[0.22em] text-[#e54f10]">01 / PROJECT STORY</span>
              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{project.sections[0].heading}</h2>
            </div>
            <p className="max-w-[1100px] whitespace-pre-line text-base leading-[1.9] text-white/65 sm:text-lg">{project.sections[0].body}</p>
          </section>
        )}

        {project.introSlices?.length ? (
          <section className="mx-auto max-w-[1600px] space-y-0 px-5 sm:px-10 lg:px-16" aria-label={`${project.title}项目介绍`}>
            {project.introSlices.map((slice, index) => (
              <Image
                key={slice.path}
                src={slice.path}
                alt={slice.alt}
                width={slice.width}
                height={slice.height}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 88vw"
                className="h-auto w-full"
              />
            ))}
          </section>
        ) : (
          <>
            <div className="mx-auto max-w-[1600px] px-5 sm:px-10 lg:px-16">
              {storyMedia[0] && (
                <figure className="my-10 overflow-hidden bg-[#111313] sm:my-14">
                  <Image src={storyMedia[0].path} alt={`${project.title}项目图 2`} width={storyMedia[0].width} height={storyMedia[0].height} sizes="(max-width: 768px) 100vw, 88vw" className="h-auto w-full" />
                </figure>
              )}
              {project.sections.slice(1).map((section, index) => {
                const storyIndex = index + 1;
                return (
                <div key={section.heading}>
                  <section className="grid gap-5 border-b border-white/10 py-14 sm:py-16 lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,1fr)] lg:gap-16 lg:py-24">
                    <div>
                      <span className="text-xs tracking-[0.22em] text-[#e54f10]">{String(storyIndex + 1).padStart(2, "0")} / PROJECT STORY</span>
                      <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{section.heading}</h2>
                    </div>
                    <p className="max-w-[1100px] whitespace-pre-line text-base leading-[1.9] text-white/65 sm:text-lg">{section.body}</p>
                  </section>
                  {storyMedia[storyIndex] && (
                    <figure className={`my-10 overflow-hidden bg-[#111313] sm:my-14 ${storyIndex % 2 === 1 ? "" : "lg:ml-auto lg:max-w-[88%]"}`}>
                      <Image src={storyMedia[storyIndex].path} alt={`${project.title}项目图 ${storyIndex + 2}`} width={storyMedia[storyIndex].width} height={storyMedia[storyIndex].height} sizes="(max-width: 768px) 100vw, 88vw" className="h-auto w-full" />
                    </figure>
                  )}
                </div>
                );
              })}
              {storyMedia.slice(project.sections.length).map((asset, index) => (
                <figure key={asset.path} className={`my-10 overflow-hidden bg-[#111313] sm:my-14 ${index % 2 === 0 ? "lg:ml-auto lg:max-w-[88%]" : ""}`}>
                  <Image src={asset.path} alt={`${project.title}项目图 ${index + project.sections.length + 2}`} width={asset.width} height={asset.height} sizes="(max-width: 768px) 100vw, 88vw" className="h-auto w-full" />
                </figure>
              ))}
            </div>
          </>
        )}

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
