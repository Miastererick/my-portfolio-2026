import type { Metadata } from "next";
import { siteContent } from "@/lib/site-content";
import "./globals.css";

export const metadata: Metadata = {
  title: siteContent.portfolioTitle,
  description: siteContent.portfolioDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full overflow-x-hidden antialiased"
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-black text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
