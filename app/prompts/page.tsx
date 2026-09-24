import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/sections/ComingSoonPage";
import { siteContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: `提示词库｜${siteContent.ownerName}作品集`,
  description: `${siteContent.ownerName}的提示词库。`,
};

export default function PromptsPage() {
  return <ComingSoonPage title="提示词库" english="PROMPT LIBRARY" />;
}
