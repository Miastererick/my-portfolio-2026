import Image from "next/image";

const BRAND_LOGOS = [
  { src: "/brands/state-grid.png", alt: "国家电网" },
  { src: "/brands/hangzhou-2022.png", alt: "杭州亚运会" },
  { src: "/brands/nanjing-metro.png", alt: "南京地铁" },
  { src: "/brands/china-mobile.png", alt: "中国移动" },
  { src: "/brands/avic.png", alt: "航天工业集团" },
  { src: "/brands/china-telecom.png", alt: "中国电信" },
] as const;

function LogoStrip({ duplicate }: { duplicate?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-10 pr-10"
      aria-hidden={duplicate}
    >
      {BRAND_LOGOS.map((logo) => (
        <Image
          key={`${logo.src}-${duplicate ? "b" : "a"}`}
          src={logo.src}
          alt={logo.alt}
          width={logo.src.includes("avic") ? 236 : 212}
          height={88}
          className="h-18 w-auto shrink-0 object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
          draggable={false}
          loading={duplicate ? "lazy" : "eager"}
          decoding="async"
        />
      ))}
    </div>
  );
}

type TrustBarProps = {
  /** `fixed`：全视口底部；`embedded`：仅贴在父级（须 `relative`）底部 */
  placement?: "fixed" | "embedded";
};

export function TrustBar({ placement = "fixed" }: TrustBarProps) {
  const outer =
    placement === "fixed"
      ? "pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4"
      : "pointer-events-none absolute bottom-0 left-0 right-0 z-40 flex w-full justify-center px-4";

  return (
    <div className={outer}>
      <footer
        className="hero-trust-bar pointer-events-auto flex h-[80px] w-full max-w-[1486px] items-center overflow-hidden rounded-[22px] border-t border-white/10 bg-black/20 px-8 backdrop-blur-sm"
        role="region"
        aria-label="合作品牌"
      >
        <p className="shrink-0 font-light text-xs text-white/50 sm:text-sm">
          受到众多企业的信赖
        </p>

        <div className="relative ml-6 min-h-0 min-w-0 flex-1 overflow-hidden md:ml-10">
          <div
            className="flex h-full items-center overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)] [mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)] md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_5rem,black_calc(100%-5rem),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_5rem,black_calc(100%-5rem),transparent)]"
          >
            <div className="flex w-max animate-marquee will-change-transform motion-reduce:animate-none">
              <LogoStrip />
              <LogoStrip duplicate />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
