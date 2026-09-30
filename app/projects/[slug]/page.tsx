import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { ProjectImageStream } from "@/components/sections/ProjectImageStream";
import { categories, mediaAssetsFor } from "@/lib/portfolio-data";
import { getProjects } from "@/lib/project-store";
import { siteContent } from "@/lib/site-content";
import "./project-detail.css";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);
  return project
    ? { title: `${project.title}｜${siteContent.ownerName}作品集`, description: project.summary }
    : { title: "项目未找到" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  if (projectIndex < 0) notFound();

  const project = projects[projectIndex];
  const category = categories.find((item) => item.id === project.category)!;
  const background = project.sections.find((section) => section.heading.includes("背景"))?.body ?? project.summary;
  const responsibility = project.sections.find((section) => section.heading.includes("工作"))?.body ?? project.summary;
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const images = project.introSlices?.length
    ? project.introSlices
    : mediaAssetsFor(project).map((asset, index) => ({
        path: asset.path,
        width: asset.width,
        height: asset.height,
        alt: `${project.title}项目展示（${index + 1}）`,
      }));

  return (
    <div className="project-detail-page project-editorial min-h-dvh">
      <TopNav />
      <main className="project-editorial-layout">
        <aside className="project-editorial-sidebar" aria-label="项目资料">
          <div className="project-editorial-heading">
            <p className="project-editorial-eyebrow">PROJECT {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
            <h1>{project.title}</h1>
            {project.english && <p className="project-editorial-english">{project.english}</p>}
          </div>

          <dl className="project-editorial-details">
            <div className="project-editorial-detail-row">
              <dt>项目背景</dt>
              <dd>{background}</dd>
            </div>
            <div className="project-editorial-detail-row">
              <dt>职责</dt>
              <dd><strong>{project.role ?? "设计"}</strong><span>{responsibility}</span></dd>
            </div>
            <div className="project-editorial-detail-row project-editorial-detail-row--compact">
              <dt>领域</dt>
              <dd>{category.title}</dd>
            </div>
            {project.facts?.length ? (
              <div className="project-editorial-detail-row project-editorial-detail-row--compact">
                <dt>关键词</dt>
                <dd>{project.facts.join(" · ")}</dd>
              </div>
            ) : null}
          </dl>

          <div className="project-editorial-sidebar-bottom">
            <Link href="/">← 返回作品集</Link>
            <span>Scroll to explore ↓</span>
          </div>
        </aside>

        <ProjectImageStream images={images} title={project.title} nextProject={nextProject} />
      </main>
      <PortfolioFooter />
    </div>
  );
}
