import Image from "next/image";
import { categories, listItemFor, projects, type CategoryId } from "@/lib/portfolio-data";
import { siteContent } from "@/lib/site-content";
import { PortfolioFooter } from "@/components/layout/PortfolioFooter";
import { ProjectRowList } from "@/components/sections/ProjectRowList";

export function PortfolioContent({ categoryId }: { categoryId?: CategoryId }) {
  return (
    <>
      {!categoryId && <>
      <section id="about" className="full-page-slide overflow-y-auto border-t border-white/10 bg-[#0a0a0a] px-5 pb-8 pt-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <span className="text-xs tracking-[0.3em] text-[#e54f10]">ABOUT / 关于我</span>
            <h2 className="mt-5 text-6xl font-bold tracking-tight text-[#eee3d2] sm:text-8xl">HELLO<span className="text-[#e54f10]">.</span></h2>
            <p className="mt-7 text-3xl font-semibold text-[#eee3d2]">{siteContent.ownerName}</p>
            <p className="mt-2 text-lg text-white/50">体验设计师 / 7 年经验</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["可视化设计", "体验设计", "AI"].map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#eee3d2]">{tag}</span>)}
            </div>
            <dl className="mt-8 grid gap-3 text-sm text-white/60">
              <div><dt className="inline text-white/40">专业 / </dt><dd className="inline text-white">数字媒体艺术</dd></div>
              <div><dt className="inline text-white/40">电话 / </dt><dd className="inline"><a className="text-white hover:text-[#e54f10]" href={`tel:${siteContent.phone}`}>{siteContent.phoneDisplay}</a>（同步微信）</dd></div>
              <div><dt className="inline text-white/40">邮箱 / </dt><dd className="inline"><a className="text-white hover:text-[#e54f10]" href={`mailto:${siteContent.email}`}>{siteContent.email}</a></dd></div>
            </dl>
            <div className="mt-7 flex items-center gap-4">
              <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-md bg-white">
                <Image src="/figma/3409-1249-40a58.webp" alt="添加微信的二维码" width={1170} height={2560} className="absolute left-[-25.83%] top-[-98.68%] h-[330.4%] w-[151.67%] max-w-none" />
              </div>
              <p className="text-sm leading-6 text-white/45">微信联系<br />扫码添加好友</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-[#151515] p-6 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#eee3d2]">北京优锘科技股份有限公司</h3>
                <span className="text-sm text-[#e54f10]">2021.12 — 2026.03</span>
              </div>
              <p className="mt-1 text-sm text-white/50">可视化设计师 · 数字孪生 / 本体智能 / 体验设计 / 3D 动画</p>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-white/70 sm:text-base">
                <li>核心主导 150+ 个数字孪生可视化项目，独立负责从三维场景构建、视觉风格设定到数据交互逻辑的完整流程。</li>
                <li>从 0 到 1 构建可复用的设计资产中台，制定统一视觉规范与资产调用逻辑，减少重复性劳动。</li>
                <li>率先在团队内引入 ComfyUI 与 Midjourney，搭建自动化资产生产工作流。</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#151515] p-6 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#eee3d2]">北京安德维尔商贸有限公司</h3>
                <span className="text-sm text-[#e54f10]">2019.09 — 2021.12</span>
              </div>
              <p className="mt-1 text-sm text-white/50">视觉设计师 · B 端后台 / 视觉运营 / 移动端 UI</p>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-6 text-white/70 sm:text-base">
                <li>负责 B 端产品 UI 与用户体验，为新功能和新产品提供创意方案。</li>
                <li>负责品牌电商平台、店铺页面、活动专题及线下宣传物料的视觉设计。</li>
                <li>参与用户研究与设计优化；作品集中记录的结果为转化提升 30%、跳出率降低 20%。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="full-page-slide flex flex-col items-center justify-center border-t border-white/10 bg-black px-5 pt-16" aria-label="职业能力">
        <div className="aspect-[1920/970] w-full max-w-5xl overflow-hidden"><Image src="/figma/skills-panel.webp" alt="职业能力：视觉创意、动画设计、UI 设计、UX 设计与 AIGC" width={1920} height={1162} sizes="(max-width: 1024px) 100vw, 1024px" className="-mt-[5.7%] h-auto w-full" /></div>
        <a href="/figma/skills-panel.webp" target="_blank" rel="noopener noreferrer" className="block px-5 py-3 text-right text-xs text-white/45 hover:text-white">查看职业能力原图 ↗</a>
      </section>
      <section className="full-page-slide flex flex-col items-center justify-center border-t border-white/10 bg-black px-5 pt-16" aria-label="项目数量与设计成果">
        <div className="aspect-[1920/870] w-full max-w-5xl overflow-hidden"><Image src="/figma/metrics-panel.webp" alt="累计完成项目 150+，设计资产 30+，内部 360° 环评 99 分" width={1920} height={1080} sizes="(max-width: 1024px) 100vw, 1024px" className="-mt-[5.7%] h-auto w-full" /></div>
        <a href="/figma/metrics-panel.webp" target="_blank" rel="noopener noreferrer" className="block px-5 py-3 text-right text-xs text-white/45 hover:text-white">查看项目成果原图 ↗</a>
      </section>
      <section className="full-page-slide relative flex flex-col items-center justify-center border-t border-white/10 bg-black px-5 pb-24 pt-16" aria-label="服务客户">
        <div className="aspect-[1920/880] w-full max-w-5xl overflow-hidden"><Image src="/figma/clients-panel.webp" alt="服务客户包括北京气象局、北京冬奥会、中国联通、中国电信、南京地铁、杭州亚运会、国家电网等" width={1920} height={1080} sizes="(max-width: 1024px) 100vw, 1024px" className="-mt-[5.7%] h-auto w-full" /></div>
        <a href="/figma/clients-panel.webp" target="_blank" rel="noopener noreferrer" className="block px-5 py-3 text-right text-xs text-white/45 hover:text-white">查看服务客户原图 ↗</a>
        <PortfolioFooter placement="overlay" />
      </section>

      </>}

      {categories.filter((category) => category.id === categoryId).map((category) => {
        const categoryIndex = categories.findIndex((item) => item.id === category.id);
        const entries = projects.filter((project) => project.category === category.id).map(listItemFor);
        return (
          <section id={category.id} key={category.id} className="site-category flex min-h-0 flex-1 flex-col overflow-hidden scroll-mt-20 border-t px-5 pb-6 pt-8 sm:px-10 lg:px-16 lg:pt-10">
            <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
              <div className="mb-6 flex shrink-0 flex-wrap items-end justify-between gap-5 sm:mb-8">
                <div>
                  <p className="site-muted-text text-xs tracking-[0.3em]">0{categoryIndex + 1} / {category.english}</p>
                  <h2 className="site-primary-text mt-4 text-3xl font-semibold sm:text-5xl">{category.title}</h2>
                </div>
                <span className="h-1 w-20 rounded-full" style={{ background: category.color }} />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <ProjectRowList projects={entries} />
              </div>
            </div>
          </section>
        );
      })}

    </>
  );
}
