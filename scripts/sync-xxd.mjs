import { mkdir, readFile, writeFile, rename, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

// The author has authorized copying free materials and prompts for this library.
// Only the site's anonymous open-source endpoints and returned preview URLs are used.
const origin = "https://vip.xiaoxiaodong.ai";
const root = process.cwd();
const cache = "/tmp/portfolio-xxd-import";
const assets = path.join(root, "public/library/xxd");
const run = promisify(execFile);
const hash = (value) => createHash("sha256").update(value).digest("hex").slice(0, 24);
await Promise.all([mkdir(cache, { recursive: true }), mkdir(`${assets}/thumbs`, { recursive: true }), mkdir(`${assets}/prompts`, { recursive: true })]);

async function download(url) {
  const { stdout } = await run("curl", ["-fsSL", "--retry", "3", "--retry-delay", "2", "--connect-timeout", "15", "--max-time", "60", url], { encoding: "buffer", maxBuffer: 32 * 1024 * 1024 });
  return stdout;
}
async function json(url) {
  const file = path.join(cache, `${hash(url)}.json`);
  try { return JSON.parse(await readFile(file, "utf8")); } catch { /* fetch uncached data */ }
  const data = JSON.parse((await download(url)).toString());
  await writeFile(file, JSON.stringify(data));
  return data;
}
async function pool(values, worker, concurrency = 6) {
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < values.length) await worker(values[cursor++]);
  }));
}

const limit = 1000;
const listing = (page, kind) => `${origin}/api/open-source/images?${new URLSearchParams({ page: String(page), size: "36", sort: "recommended", seed: "20260930", ...(kind === "media" ? { kind } : {}) })}`;
const all = new Map();
for (const kind of ["style"]) {
  const first = await json(listing(1, kind));
  const size = Number(first.size) || 36;
  const total = Math.min(limit, Number(first.total) || 0);
  const pages = new Map([[1, first]]);
  const collect = (data) => {
    if (!Array.isArray(data.images)) throw new Error("Invalid public catalog");
    for (const image of data.images) all.set(image.id, { ...image, kind });
  };
  collect(first);
  console.log(`${kind}: ${total} public samples`);
  await pool(Array.from({ length: Math.max(0, Math.ceil(total / size) - 1) }, (_, i) => i + 2), async (page) => {
    pages.set(page, await json(listing(page, kind)));
    if (page % 20 === 0) console.log(`${kind}: listed page ${page}`);
  }, 4);
  all.clear();
  for (const [, data] of [...pages.entries()].sort(([a], [b]) => a - b)) collect(data);
  for (const id of [...all.keys()].slice(total)) all.delete(id);
  if (all.size < total) throw new Error(`Incomplete ${kind} catalog; retry with a fresh cache`);
}
await writeFile(`${cache}/catalog.json`, JSON.stringify([...all.values()]));
console.log(`Catalog complete: ${all.size} samples`);
const groups = new Map();
for (const image of all.values()) {
  const key = image.kind === "media" ? image.id : image.styleId;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(image);
}
const items = new Map();
const failures = [];
let done = 0;
await pool([...groups.values()], async (images) => {
  try {
    const first = images[0];
    const endpoint = first.kind === "media" ? `/api/open-source/images/${encodeURIComponent(first.routeToken || first.id)}` : `/api/open-source/styles/${encodeURIComponent(first.styleId)}`;
    const detail = await json(origin + endpoint);
    if (detail.openSource !== true) throw new Error("Not a public resource");
    for (const image of images) {
      const prompt = (detail.prompts || []).find((p) => p.id === image.promptId || p.imageKey === image.imageKey || p.sampleId === image.sampleId);
      const preview = (detail.style?.previewImages || []).find((p) => p.imageKey === image.imageKey || p.sampleId === image.sampleId);
      const content = prompt?.content || preview?.content || (detail.image?.id === image.id ? detail.image?.promptContent : "") || "";
      if (image.kind !== "media" && !content.trim()) throw new Error(`Missing public prompt: ${image.id}`);
      const slug = hash(image.id);
      const output = `${assets}/thumbs/${slug}.webp`;
      let info;
      if (await stat(output).then((s) => s.size > 100).catch(() => false)) info = await sharp(output).metadata();
      else {
        const imageUrl = new URL(image.thumbPath || image.imagePath, origin);
        if (imageUrl.origin !== origin) throw new Error("Unexpected preview origin");
        const input = await download(imageUrl.href);
        info = await sharp(input).rotate().resize({ width: 720, height: 960, fit: "inside", withoutEnlargement: true }).webp({ quality: 72 }).toFile(output);
      }
      if (content) await writeFile(`${assets}/prompts/${slug}.txt`, content, "utf8");
      const labels = (image.labels || image.channels || []).map((label) => label.name).filter(Boolean);
      items.set(image.id, {
        name: (image.promptTitle || image.styleName || detail.style?.name || "免费素材").replace(/^变种[-－]\d+[-－]/, ""),
        styleDescription: `小小东 · ${image.styleName || labels[0] || "免费素材"}`,
        description: `${image.styleName || detail.style?.name || "免费素材"}${labels.length ? ` · ${labels.join(" · ")}` : ""}`,
        useCases: labels.join("、") || "视觉设计与创意探索",
        cover: `/library/xxd/thumbs/${slug}.webp`, width: info.width, height: info.height,
        ...(content ? { promptPath: `/library/xxd/prompts/${slug}.txt` } : {}),
        githubUrl: new URL(image.publicPath || detail.style?.publicPath || "/open-source", origin).href,
      });
      done++;
      if (done % 100 === 0) console.log(`Saved ${done}/${all.size}`);
    }
  } catch (error) { failures.push({ id: images[0].id, error: error.message }); }
});
await writeFile(`${cache}/failures.json`, JSON.stringify(failures, null, 2));
if (failures.length) throw new Error(`${failures.length} groups incomplete; cached progress retained. See ${cache}/failures.json`);
const result = [...all.keys()].map((id) => items.get(id));
if (result.some((item) => !item)) throw new Error("Incomplete import");
const file = path.join(root, "lib/xxd-resources.json");
await writeFile(`${file}.tmp`, JSON.stringify(result, null, 2) + "\n");
await rename(`${file}.tmp`, file);
console.log(`Imported ${result.length} free resources with local previews and prompts.`);
