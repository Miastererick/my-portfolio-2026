"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

const THEME_EVENT = "portfolio-theme-change";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_EVENT, callback);
  };
}

function getTheme() {
  return window.localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
}

const PROJECT_ITEMS = [
  { label: "商业项目", href: "/business" },
  { label: "视觉项目", href: "/visual" },
  { label: "AI 项目", href: "/ai" },
  { label: "设计工程化", href: "/engineering" },
  { label: "其他", href: "/other" },
] as const;

export function TopNav() {
  const isDark = useSyncExternalStore(subscribeToTheme, getTheme, () => "dark") === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  function toggleTheme() {
    const theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("portfolio-theme", theme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between gap-3 border-b px-3 py-2 backdrop-blur-xl sm:px-8 sm:py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/#home"
          className="flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="返回首页"
          title="首页"
        >
          <Image
            src={isDark ? "/icons/home-dark.svg" : "/icons/home-light.svg"}
            alt=""
            width={44}
            height={44}
            className="home-theme-icon h-[38px] w-[38px]"
          />
        </Link>
        <nav className="min-w-0 overflow-visible" aria-label="主导航">
          <ul className="flex items-center gap-x-3 whitespace-nowrap sm:gap-x-8">
          <li>
            <Link href="/prompts" className="text-xs text-white/70 transition-colors hover:text-white focus-visible:text-white sm:text-sm">提示词库</Link>
          </li>
          <li>
            <Link href="/skills" className="text-xs text-white/70 transition-colors hover:text-white focus-visible:text-white sm:text-sm">Skills</Link>
          </li>
          <li className="relative">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-white/70 transition-colors hover:text-white focus-visible:text-white sm:text-sm [&::-webkit-details-marker]:hidden">
                项目<span className="text-[10px] text-white/45 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <ul className="absolute left-1/2 top-full mt-4 min-w-36 -translate-x-1/2 rounded-lg border border-white/10 bg-[#111] p-2 shadow-xl">
                {PROJECT_ITEMS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="block rounded-md px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white sm:text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          </ul>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
          title={isDark ? "切换到亮色模式" : "切换到暗色模式"}
        >
          <Image src={isDark ? "/icons/theme-light.svg" : "/icons/theme-dark.svg"} alt="" width={44} height={44} className="h-[38px] w-[38px]" />
        </button>
        <a
          href="https://github.com/Miastererick/my-portfolio-2026"
          target="_blank"
          rel="noreferrer"
          className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="在 GitHub 查看作品集"
          title="GitHub"
        >
          <Image src="/icons/github.svg" alt="" width={44} height={44} className="h-[38px] w-[38px]" />
        </a>
        <Link
          href="/about"
          className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="关于我 / 联系我"
          title="关于我"
        >
          <Image src="/icons/contact.svg" alt="" width={44} height={44} className="h-[38px] w-[38px]" />
        </Link>
      </div>
    </header>
  );
}
