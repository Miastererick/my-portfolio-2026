import { mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { isLocalAdminRequest } from "@/lib/project-store";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  if (!isLocalAdminRequest(request)) return new Response(null, { status: 404 });
  try {
    if (Number(request.headers.get("content-length")) > 31 * 1024 * 1024) {
      return Response.json({ error: "单张图片不能超过 30 MB" }, { status: 413 });
    }
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !allowedTypes.has(file.type)) {
      return Response.json({ error: "请选择 JPG、PNG、WebP 或 AVIF 图片" }, { status: 400 });
    }
    if (file.size > 30 * 1024 * 1024) {
      return Response.json({ error: "单张图片不能超过 30 MB" }, { status: 413 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = sharp(bytes, { limitInputPixels: 60_000_000 });
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height || !["jpeg", "png", "webp", "avif"].includes(metadata.format ?? "")) {
      throw new Error("图片文件格式无效");
    }
    const directory = path.join(process.cwd(), "public", "project-uploads");
    await mkdir(directory, { recursive: true });
    const filename = `${randomUUID()}.webp`;
    const output = await image.rotate().webp({ quality: 85, effort: 4 }).toFile(path.join(directory, filename));
    return Response.json({
      path: `/project-uploads/${filename}`,
      width: output.width,
      height: output.height,
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "上传失败" }, { status: 400 });
  }
}
