import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Skills｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的 Skills。`,
};

export default function SkillsPage() {
  return <ComingSoonPage title="Skills" english="SKILLS" />;
}
