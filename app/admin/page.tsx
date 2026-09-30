import { notFound } from "next/navigation";
import { getProjects } from "@/lib/project-store";
import { ProjectAdmin } from "@/components/ProjectAdmin";
import "./admin.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ProjectAdmin initialProjects={await getProjects()} />;
}
