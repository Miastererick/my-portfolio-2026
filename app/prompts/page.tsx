import type { Metadata } from "next";
import { CreativeLibraryPage } from "@/components/sections/CreativeLibraryPage";
import { promptLibrary } from "@/lib/creative-library";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `提示词库｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的提示词库。`,
};

export default function PromptsPage() {
  return <CreativeLibraryPage section="prompts" items={promptLibrary} />;
}
