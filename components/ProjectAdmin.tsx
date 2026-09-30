"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categories, coverFor, type CategoryId, type PortfolioProject } from "@/lib/portfolio-data";

type UploadedImage = { path: string; width: number; height: number };

export function ProjectAdmin({ initialProjects }: { initialProjects: PortfolioProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedSlug, setSelectedSlug] = useState(initialProjects[0]?.slug ?? "");
  const [savedSlugs, setSavedSlugs] = useState(() => new Set(initialProjects.map((project) => project.slug)));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const selected = projects.find((project) => project.slug === selectedSlug);

  function updateProject(updater: (project: PortfolioProject) => PortfolioProject) {
    setProjects((current) => current.map((project) => project.slug === selectedSlug ? updater(project) : project));
    setDirty(true);
    setMessage("");
  }

  function addProject() {
    const slug = `new-project-${Date.now()}`;
    const project: PortfolioProject = {
      slug, category: "business", palette: ["#E74E44", "#CCCCCC", "#222222"],
      title: "新项目", english: "New Project", summary: "", role: "", facts: [],
      sections: [{ heading: "项目背景", body: "" }, { heading: "我的工作内容", body: "" }],
      introSlices: [], mediaNodes: [],
    };
    setProjects((current) => [...current, project]);
    setSelectedSlug(slug);
    setDirty(true);
  }

  function removeProject(slug: string) {
    if (!window.confirm("确定从作品集中移除这个项目吗？保存后才会生效，已上传的图片会保留。")) return;
    const remaining = projects.filter((project) => project.slug !== slug);
    setProjects(remaining);
    if (selectedSlug === slug) setSelectedSlug(remaining[0]?.slug ?? "");
    setDirty(true);
  }

  function moveProject(slug: string, direction: number) {
    const index = projects.findIndex((project) => project.slug === slug);
    const other = index + direction;
    if (other < 0 || other >= projects.length) return;
    const next = [...projects];
    [next[index], next[other]] = [next[other], next[index]];
    setProjects(next);
    setDirty(true);
  }

  async function uploadFiles(files: FileList | null, kind: "cover" | "details") {
    if (!files?.length || !selected) return;
    setBusy(true);
    setMessage(`正在上传 ${files.length} 张图片…`);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "上传失败");
        uploaded.push(result as UploadedImage);
      }
      if (kind === "cover") {
        updateProject((project) => ({ ...project, cover: uploaded.at(-1)?.path }));
      } else {
        updateProject((project) => ({
          ...project,
          introSlices: [
            ...(project.introSlices ?? []),
            ...uploaded.map((image, index) => ({ ...image, alt: `${project.title}项目展示（${(project.introSlices?.length ?? 0) + index + 1}）` })),
          ],
        }));
      }
      setMessage("上传完成，请点击“保存全部更改”。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "上传失败");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setMessage("正在保存…");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projects),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "保存失败");
      setSavedSlugs(new Set(projects.map((project) => project.slug)));
      setDirty(false);
      setMessage(`已保存 ${result.count} 个项目。首页和详情页刷新后生效。`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="project-admin">
      <header className="project-admin-header">
        <div><p className="project-admin-kicker">LOCAL PROJECT MANAGER</p><h1>作品项目管理</h1><p>在本机编辑项目，保存后可随网站文件同步到 GitHub。</p></div>
        <div className="project-admin-header-actions"><Link href="/">查看首页 ↗</Link><button type="button" onClick={save} disabled={busy || !dirty} className="project-admin-save">{busy ? "处理中…" : dirty ? "保存全部更改" : "已保存"}</button></div>
      </header>
      {message && <p className="project-admin-message" role="status">{message}</p>}
      <div className="project-admin-layout">
        <aside className="project-admin-list"><div className="project-admin-list-title"><h2>项目顺序 <span>{projects.length}</span></h2><button type="button" onClick={addProject}>＋ 新增项目</button></div>
          {projects.map((project, index) => <div className={`project-admin-list-item ${selectedSlug === project.slug ? "is-active" : ""}`} key={project.slug}>
            <button type="button" className="project-admin-select" onClick={() => setSelectedSlug(project.slug)}><small>{String(index + 1).padStart(2, "0")}</small><span>{project.title}</span></button>
            <div className="project-admin-reorder"><button type="button" title="上移" disabled={index === 0} onClick={() => moveProject(project.slug, -1)}>↑</button><button type="button" title="下移" disabled={index === projects.length - 1} onClick={() => moveProject(project.slug, 1)}>↓</button></div>
          </div>)}
        </aside>
        <section className="project-admin-editor">
          {!selected ? <p>点击“新增项目”开始编辑。</p> : <>
            <div className="project-admin-editor-top"><div><p className="project-admin-kicker">PROJECT DETAILS</p><h2>{selected.title}</h2></div><button type="button" className="project-admin-delete" onClick={() => removeProject(selected.slug)}>移除项目</button></div>
            <div className="project-admin-fields">
              <label>项目地址（英文、小写、连字符）<input value={selected.slug} disabled={savedSlugs.has(selected.slug)} onChange={(event) => { const value = event.target.value; setProjects((current) => current.map((project) => project.slug === selectedSlug ? { ...project, slug: value } : project)); setSelectedSlug(value); setDirty(true); }} /><small>保存后地址固定，避免已有链接失效。</small></label>
              <label>分类<select value={selected.category} onChange={(event) => updateProject((project) => ({ ...project, category: event.target.value as CategoryId }))}>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
              <label>中文标题<input value={selected.title} onChange={(event) => updateProject((project) => ({ ...project, title: event.target.value }))} /></label>
              <label>英文标题<input value={selected.english ?? ""} onChange={(event) => updateProject((project) => ({ ...project, english: event.target.value }))} /></label>
              <label className="wide">项目简介<textarea rows={3} value={selected.summary} onChange={(event) => updateProject((project) => ({ ...project, summary: event.target.value }))} /></label>
              <label>职责<input value={selected.role ?? ""} onChange={(event) => updateProject((project) => ({ ...project, role: event.target.value }))} /></label>
              <label>关键词（用逗号分隔）<input value={(selected.facts ?? []).join("，")} onChange={(event) => updateProject((project) => ({ ...project, facts: event.target.value.split(/[,，]/).map((word) => word.trim()).filter(Boolean) }))} /></label>
            </div>
            <h3>项目详情文字</h3>
            <div className="project-admin-sections">{selected.sections.map((section, index) => <div className="project-admin-section" key={index}><input aria-label="段落标题" value={section.heading} onChange={(event) => updateProject((project) => ({ ...project, sections: project.sections.map((item, position) => position === index ? { ...item, heading: event.target.value } : item) }))} /><button type="button" onClick={() => updateProject((project) => ({ ...project, sections: project.sections.filter((_, position) => position !== index) }))}>删除段落</button><textarea aria-label="段落内容" rows={3} value={section.body} onChange={(event) => updateProject((project) => ({ ...project, sections: project.sections.map((item, position) => position === index ? { ...item, body: event.target.value } : item) }))} /></div>)}<button type="button" className="project-admin-secondary" onClick={() => updateProject((project) => ({ ...project, sections: [...project.sections, { heading: "新段落", body: "" }] }))}>＋ 添加段落</button></div>
            <h3>项目色卡</h3><div className="project-admin-colors">{selected.palette.map((color, index) => <label key={index}><input type="color" value={color} onChange={(event) => updateProject((project) => ({ ...project, palette: project.palette.map((item, position) => position === index ? event.target.value : item) as PortfolioProject["palette"] }))} /><span>{color}</span></label>)}</div>
            <h3>封面图片</h3><div className="project-admin-media">{coverFor(selected) && <Image src={coverFor(selected)!} alt="当前封面" width={180} height={120} unoptimized className="project-admin-cover" />}<label className="project-admin-upload">上传或替换封面<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={(event) => { void uploadFiles(event.target.files, "cover"); event.target.value = ""; }} /></label></div>
            <h3>详情图片 <span>{selected.introSlices?.length ?? 0}</span></h3><p className="project-admin-hint">按展示顺序排列；可一次选择多张图片。单张不超过 30 MB。</p>
            <div className="project-admin-images">{selected.introSlices?.map((image, index) => <div key={`${image.path}-${index}`} className="project-admin-image"><Image src={image.path} alt={image.alt} width={120} height={84} unoptimized /><span>{String(index + 1).padStart(2, "0")}</span><div><button type="button" disabled={index === 0} onClick={() => updateProject((project) => { const next = [...(project.introSlices ?? [])]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return { ...project, introSlices: next }; })}>↑</button><button type="button" disabled={index === (selected.introSlices?.length ?? 0) - 1} onClick={() => updateProject((project) => { const next = [...(project.introSlices ?? [])]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; return { ...project, introSlices: next }; })}>↓</button><button type="button" onClick={() => updateProject((project) => ({ ...project, introSlices: project.introSlices?.filter((_, position) => position !== index) }))}>移除</button></div></div>)}</div>
            <label className="project-admin-upload">＋ 上传详情图片<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={(event) => { void uploadFiles(event.target.files, "details"); event.target.value = ""; }} /></label>
          </>}
        </section>
      </div>
    </main>
  );
}
