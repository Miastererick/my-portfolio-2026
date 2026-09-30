import { getProjects, isLocalAdminRequest, saveProjects, validateProjects } from "@/lib/project-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isLocalAdminRequest(request)) return new Response(null, { status: 404 });
  return Response.json(await getProjects());
}

export async function PUT(request: Request) {
  if (!isLocalAdminRequest(request)) return new Response(null, { status: 404 });
  try {
    const size = Number(request.headers.get("content-length"));
    if (size > 2_000_000) return Response.json({ error: "项目数据过大" }, { status: 413 });
    const input = await request.text();
    if (input.length > 2_000_000) return Response.json({ error: "项目数据过大" }, { status: 413 });
    const projects = validateProjects(JSON.parse(input));
    await saveProjects(projects);
    return Response.json({ ok: true, count: projects.length });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 400 });
  }
}
