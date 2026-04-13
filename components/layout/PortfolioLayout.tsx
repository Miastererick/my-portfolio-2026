import Image from "next/image";
import { TopNav } from "@/components/layout/TopNav";
import { TrustBar } from "@/components/layout/TrustBar";
import { ProjectDirectory } from "@/components/sections/ProjectDirectory";

export function PortfolioLayout() {
  return (
    <div className="relative min-h-dvh h-screen snap-y snap-mandatory overflow-y-auto overflow-x-hidden overscroll-y-contain bg-black text-foreground">
      <TopNav />

      <section
        className="relative z-10 flex h-screen w-full shrink-0 snap-start flex-col overflow-hidden bg-black"
        aria-label="封面"
      >
        <Image
          src="/hero-background.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover object-center select-none"
          aria-hidden
        />
        <div className="relative z-[1] min-h-0 flex-1" aria-hidden />
        <TrustBar placement="embedded" />
      </section>

      <section
        className="relative z-20 isolate flex h-screen min-h-dvh w-full shrink-0 snap-start flex-col overflow-x-hidden bg-[#000101]"
        aria-label="项目目录"
      >
        <ProjectDirectory />
      </section>
    </div>
  );
}
