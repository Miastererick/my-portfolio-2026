import Image from "next/image";
import { TopNav } from "@/components/layout/TopNav";
import { TrustBar } from "@/components/layout/TrustBar";
import { ProjectDirectory } from "@/components/sections/ProjectDirectory";

export function PortfolioLayout() {
  const blurDataURL =
    "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

  return (
    <div className="full-page-scroll relative bg-black text-foreground">
      <TopNav />

      <section
        id="home"
        className="full-page-slide relative z-10 w-full overflow-hidden bg-black"
        aria-label="封面"
      >
        <Image
          src="/hero-background.webp"
          alt=""
          fill
          priority
          quality={85}
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="100vw"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          aria-hidden
        />
        <div className="relative z-10 flex h-full w-full items-center justify-center p-8">
          <div className="relative aspect-[974/548] w-full max-w-[974px]">
            <Image
              src="/title-text.png"
              alt="Symbiosis and Evolution，共生与演化，从像素执行到 AI 决策。"
              fill
              priority
              quality={85}
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="974px"
              draggable={false}
              className="hero-title-breathe pointer-events-none select-none object-contain"
            />
          </div>
        </div>

        <TrustBar placement="embedded" />
      </section>

      <section
        id="projects"
        className="full-page-slide relative z-20 isolate flex w-full flex-col overflow-x-hidden overflow-y-auto bg-[#000101]"
        aria-label="项目目录"
      >
        <ProjectDirectory />
      </section>

    </div>
  );
}
