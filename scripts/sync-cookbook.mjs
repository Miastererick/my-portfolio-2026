import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import sharp from "sharp";

const repo = "VigoZhao/AI-Visual-Prompt-Cookbook";
const raw = `https://raw.githubusercontent.com/${repo}/main`;
const root = process.cwd();
const imageDirectory = path.join(root, "public", "library", "cookbook", "thumbs");
const dataFile = path.join(root, "lib", "cookbook-styles.json");
const catalogPattern = /### (.+?)\n\n<a href="\.\.\/styles\/([^"/]+)"><img[^>]+><\/a>\n\n(.+?)\n\nFiles:/gs;
const run = promisify(execFile);

async function download(url) {
  const target = path.join("/tmp", `cookbook-${process.pid}-${Math.random().toString(36).slice(2)}`);
  try {
    await run("curl", ["--fail", "--silent", "--show-error", "--location", "--retry", "4", "--retry-all-errors", "--connect-timeout", "20", "--max-time", "90", "--output", target, url]);
    return await readFile(target);
  } finally {
    await unlink(target).catch(() => {});
  }
}

const catalog = (await download(`${raw}/docs/CATALOG.md`)).toString("utf8");
const styles = Array.from(catalog.matchAll(catalogPattern), ([, name, slug, description]) => ({
  slug,
  name,
  description: description.replace(/\s+/g, " ").trim(),
}));
if (styles.length < 100 || new Set(styles.map((style) => style.slug)).size !== styles.length) {
  throw new Error(`Unexpected style catalog (${styles.length} entries)`);
}

await mkdir(imageDirectory, { recursive: true });
const concurrency = 4;
let cursor = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (cursor < styles.length) {
    const style = styles[cursor++];
    const output = path.join(imageDirectory, `${style.slug}.webp`);
    if (await stat(output).then((file) => file.size > 1000).catch(() => false)) continue;
    const input = await download(`${raw}/assets/thumbs/${style.slug}-16x9.jpg`);
    await sharp(input).resize({ width: 720, withoutEnlargement: true }).webp({ quality: 72, effort: 4 })
      .toFile(output);
  }
}));

await writeFile(dataFile, `${JSON.stringify(styles, null, 2)}\n`, "utf8");
console.log(`Synced ${styles.length} styles and optimized thumbnails from ${repo}`);
