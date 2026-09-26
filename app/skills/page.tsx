import type { Metadata } from "next";
import { CreativeLibraryPage } from "@/components/sections/CreativeLibraryPage";
import { skillLibrary } from "@/lib/creative-library";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `Skills｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的 Skills。`,
};

export default function SkillsPage() {
  return <CreativeLibraryPage section="skills" items={skillLibrary} />;
}
