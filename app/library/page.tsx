import type { Metadata } from "next";
import { CreativeLibraryPage } from "@/components/sections/CreativeLibraryPage";
import { allCreativeLibrary } from "@/lib/creative-library";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `创作资源｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的提示词与 Skills。`,
};

export default function LibraryPage() {
  return <CreativeLibraryPage section="all" items={allCreativeLibrary} />;
}
