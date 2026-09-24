import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "source-assets/public");
const output = path.join(root, "public");

async function convert(input, destination, width, quality) {
  await sharp(input, { limitInputPixels: false })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toFile(destination);
}

const originals = (await fs.readdir(path.join(source, "figma"))).filter((name) => name.endsWith(".png"));
for (const name of originals) {
  await convert(
    path.join(source, "figma", name),
    path.join(output, "figma", name.replace(/\.png$/, ".webp")),
    2560,
    92,
  );
}

await convert(
  path.join(source, "hero-background.png"),
  path.join(output, "hero-background.webp"),
  3840,
  90,
);

const manifestPath = path.join(root, "figma-media.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
for (const asset of manifest) {
  const webpPath = asset.path.replace(/\.png$/, ".webp");
  const metadata = await sharp(path.join(output, webpPath)).metadata();
  asset.path = webpPath;
  asset.width = metadata.width;
  asset.height = metadata.height;
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`已生成 ${originals.length} 张 Figma 图片和首页背景的 WebP 版本。`);
