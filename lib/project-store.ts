import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { categories, projects as starterProjects, type PortfolioProject } from "@/lib/portfolio-data";

const dataFile = path.join(process.cwd(), "content", "projects.json");
const categoryIds = new Set<string>(categories.map((category) => category.id));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const hexPattern = /^#[0-9a-fA-F]{6}$/;

export async function getProjects(): Promise<PortfolioProject[]> {
  try {
    const contents = await readFile(dataFile, "utf8");
    const parsed: unknown = JSON.parse(contents);
    if (!Array.isArray(parsed)) throw new Error("项目数据格式错误");
    return parsed as PortfolioProject[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return starterProjects;
    throw error;
  }
}

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function localImage(value: unknown) {
  const image = text(value, 500);
  return /^\/(?:project-uploads|project-covers|project-pages|figma)\/[a-zA-Z0-9/_.,-]+$/.test(image) ? image : "";
}

export function validateProjects(input: unknown): PortfolioProject[] {
  if (!Array.isArray(input) || input.length > 100) throw new Error("项目数量不能超过 100 个");
  if (input.length === 0) throw new Error("作品集至少需要保留一个项目");
  const slugs = new Set<string>();
  return input.map((raw) => {
    if (!raw || typeof raw !== "object") throw new Error("项目数据格式错误");
    const source = raw as Record<string, unknown>;
    const slug = text(source.slug, 80);
    if (!slugPattern.test(slug) || slugs.has(slug)) throw new Error(`项目地址无效或重复：${slug}`);
    slugs.add(slug);
    const category = text(source.category, 30);
    if (!categoryIds.has(category)) throw new Error(`项目分类无效：${slug}`);
    const title = text(source.title, 120);
    if (!title) throw new Error(`项目缺少中文标题：${slug}`);
    const palette = source.palette;
    if (!Array.isArray(palette) || palette.length !== 3 || !palette.every((color) => typeof color === "string" && hexPattern.test(color))) {
      throw new Error(`项目色卡格式错误：${slug}`);
    }
    const sections = Array.isArray(source.sections) ? source.sections.slice(0, 20).map((section) => {
      const entry = section as Record<string, unknown>;
      return { heading: text(entry.heading, 80), body: text(entry.body, 5000) };
    }) : [];
    const introSlices = Array.isArray(source.introSlices) ? source.introSlices.slice(0, 100).map((slice) => {
      const entry = slice as Record<string, unknown>;
      const imagePath = localImage(entry.path);
      if (!imagePath) throw new Error(`详情图片路径无效：${slug}`);
      return {
        path: imagePath,
        width: Math.max(1, Math.min(10000, Number(entry.width) || 1920)),
        height: Math.max(1, Math.min(10000, Number(entry.height) || 1080)),
        alt: text(entry.alt, 200) || `${title} 项目展示`,
      };
    }) : [];
    const cover = source.cover ? localImage(source.cover) : undefined;
    if (source.cover && !cover) throw new Error(`封面路径无效：${slug}`);
    return {
      slug,
      category: category as PortfolioProject["category"],
      palette: palette as PortfolioProject["palette"],
      title,
      english: text(source.english, 180),
      summary: text(source.summary, 2000),
      role: text(source.role, 120),
      facts: Array.isArray(source.facts) ? source.facts.slice(0, 20).map((item) => text(item, 120)) : [],
      sections,
      introSlices,
      reviewNotes: Array.isArray(source.reviewNotes) ? source.reviewNotes.slice(0, 20).map((item) => text(item, 1000)) : [],
      mediaNodes: Array.isArray(source.mediaNodes) ? source.mediaNodes.filter((item): item is string => typeof item === "string").slice(0, 50) : [],
      cover,
      coverNode: text(source.coverNode, 100),
      coverName: text(source.coverName, 200),
      excludedMediaNames: Array.isArray(source.excludedMediaNames) ? source.excludedMediaNames.filter((item): item is string => typeof item === "string").slice(0, 50) : [],
      excludedMediaAssets: Array.isArray(source.excludedMediaAssets) ? source.excludedMediaAssets.filter((item): item is string => typeof item === "string").slice(0, 50) : [],
    };
  });
}

export async function saveProjects(items: PortfolioProject[]) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  const tempFile = `${dataFile}.${process.pid}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(items, null, 2)}\n`, "utf8");
  await rename(tempFile, dataFile);
}

export function isLocalAdminRequest(request: Request) {
  if (process.env.NODE_ENV !== "development") return false;
  const url = new URL(request.url);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    return source.protocol === url.protocol
      && source.port === url.port
      && ["localhost", "127.0.0.1", "[::1]"].includes(source.hostname);
  } catch {
    return false;
  }
}
