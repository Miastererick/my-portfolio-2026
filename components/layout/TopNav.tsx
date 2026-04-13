const NAV_ITEMS = [
  "关于我",
  "AI 项目探索",
  "商业落地项目",
  "视觉类项目",
  "设计工程化",
  "其他",
] as const;

export function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between px-8 py-6 md:px-12">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src="/logo.svg"
          alt=""
          width={44}
          height={44}
          className="h-8 w-8 shrink-0 object-contain"
          aria-hidden
        />
        <p className="text-sm font-light leading-snug text-gray-300">
          作品集2026：从像素执行到 AI 决策
        </p>
      </div>
      <nav className="min-w-0" aria-label="主导航">
        <ul className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2">
          {NAV_ITEMS.map((label) => (
            <li key={label}>
              <a
                href="#"
                className="text-sm text-white/70 transition-colors duration-300 hover:text-white"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
