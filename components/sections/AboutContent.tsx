import Image from "next/image";
import { siteContent } from "@/lib/site-content";

const experiences = [
  {
    company: "北京优锘科技股份有限公司",
    role: "可视化设计师",
    period: "2021.12 - 2026.03",
    tags: ["数字孪生可视化", "本体智能", "体验设计", "3D 动画"],
    duties: [
      { title: "全链路设计交付：", text: "核心主导 150+ 个数字孪生可视化项目（涵盖电力、军工、国家级赛事、气象监控和智慧校园等领域）的设计与落地，独立负责从三维场景构建、视觉风格设定到数据交互逻辑的完整开发流程；" },
      { title: "标准化体系搭建：", text: "针对高频交付场景，从 0 到 1 构建可复用的设计资产中台。通过制定统一的视觉规范与资产调用逻辑，在保障项目视觉产出高度一致的同时，减少重复性劳动，支撑业务扩张与设计落地；" },
      { title: "AI 赋能工作：", text: "率先在团队内引入 ComfyUI 与 Midjourney，搭建自动化资产生产工作流，在保障工业级标准的前提下，提升非标资产的产出效率与质量。" },
    ],
  },
  {
    company: "北京安德维尔商贸有限公司",
    role: "视觉设计师",
    period: "2019.9 - 2021.12",
    tags: ["B 端后台", "视觉运营设计", "移动端 UI 设计"],
    duties: [
      { text: "负责公司 B 端产品的 UI 设计和用户体验，为新功能、新产品提供创意方案，有组件化经验，可积极主动推动项目进程；" },
      { text: "负责品牌所有电商平台的视觉设计工作，包括店铺页面、宝贝详情页模板、专题设计及线下宣传物料，并把控店铺视觉效果；" },
      { text: "参与用户研究，进行有理有据的设计，实现转化提升 30%、跳出率降低 20%。" },
      { text: "独立完成运营活动 H5 页面设计工作。" },
    ],
  },
];

function ContactIcon({ name }: { name: "age" | "major" | "phone" | "email" }) {
  return <Image
    src={`/about-icons/${name}.svg`}
    alt=""
    width={36}
    height={36}
    style={{ width: 25.92, height: 25.92, minWidth: 25.92, minHeight: 25.92 }}
    className="shrink-0"
  />;
}

export function AboutContent() {
  return (
    <section id="about" aria-label="个人介绍" className="mx-auto grid min-h-full w-full max-w-[1280px] gap-10 px-6 py-7 text-[#eee3d2] sm:px-10 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,34%)_minmax(0,1fr)] lg:gap-8 lg:px-12 lg:py-6 xl:gap-8 xl:px-16">
      <div className="flex min-h-0 flex-col justify-between gap-16 lg:overflow-y-auto lg:overscroll-contain">
        <div className="origin-top-left scale-90 pt-6 lg:pt-[clamp(2rem,7vh,7rem)]">
          <h1 className="w-fit leading-none">
            <Image src="/about-icons/hello.svg" alt="Hello" width={364} height={112} className="h-auto w-[min(100%,327.6px)]" priority />
          </h1>
          <p className="mt-9 text-[clamp(1.75rem,2.25vw,2.625rem)] font-semibold">{siteContent.ownerName}</p>
          <p className="mt-2 text-lg text-white/50 sm:text-xl">体验设计师 / 7 年经验</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["可视化设计", "体验设计", "AI"].map((tag) => (
              <span key={tag} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold sm:text-base">{tag}</span>
            ))}
          </div>
        </div>

        <div className="pb-2">
          <div className="relative h-[71px] w-[71px] overflow-hidden rounded-md bg-white sm:h-[88px] sm:w-[88px]">
            <Image src="/figma/3409-1249-40a58.webp" alt="微信二维码" width={1170} height={2560} className="absolute left-[-25.83%] top-[-98.68%] h-[330.4%] w-[151.67%] max-w-none" />
          </div>
          <dl className="mt-8 space-y-[14px] text-sm leading-[1.5] sm:text-base">
            <div className="flex items-center gap-2"><ContactIcon name="age" /><dt>年龄：</dt><dd className="font-semibold">28</dd></div>
            <div className="flex items-center gap-2"><ContactIcon name="major" /><dt>专业：</dt><dd className="font-semibold">数字媒体艺术</dd></div>
            <div className="flex flex-wrap items-center gap-x-2"><ContactIcon name="phone" /><dt>电话：</dt><dd className="font-semibold"><a href={`tel:${siteContent.phone}`} className="hover:text-[#e54f10]">{siteContent.phoneDisplay}</a></dd><span className="text-white/45">（同步微信）</span></div>
            <div className="flex flex-wrap items-center gap-x-2"><ContactIcon name="email" /><dt>邮箱：</dt><dd className="font-semibold"><a href={`mailto:${siteContent.email}`} className="hover:text-[#e54f10]">{siteContent.email}</a></dd></div>
          </dl>
        </div>
      </div>

      <div className="relative min-h-0 lg:overflow-y-auto lg:overscroll-contain" aria-label="工作经历">
        <div className="relative space-y-12 pb-7 pl-9 lg:pt-[clamp(2rem,7vh,7rem)] lg:pl-12">
          <div className="pointer-events-none absolute bottom-0 left-[-3px] top-0 w-5 [background:repeating-linear-gradient(to_bottom,rgba(238,227,210,0.22)_0_1px,transparent_1px_14px)]" aria-hidden="true" />
          {experiences.map((experience) => (
            <article key={experience.company} className="relative">
              <span className="absolute -left-[36px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#e54f10] bg-[#000101] lg:-left-[48px]" aria-hidden="true"><span className="h-1 w-1 rounded-full bg-[#e54f10]" /></span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                <h2 className="text-lg font-semibold leading-snug sm:text-xl xl:text-2xl">{experience.company}<span className="mx-2 text-white/55"> | </span>{experience.role}</h2>
                <time className="shrink-0 text-base font-semibold text-[#e54f10] xl:text-lg">{experience.period}</time>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {experience.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-4 py-2 text-sm sm:text-base">{tag}</span>)}
              </div>
              <h3 className="mt-8 text-base font-semibold sm:text-lg">工作内容</h3>
              <ol className="mt-5 list-decimal space-y-2 rounded-3xl bg-white/[0.07] px-7 py-5 text-sm leading-[2] text-[#eee3d2]/80 marker:font-semibold marker:text-[#eee3d2] sm:px-9 sm:py-7 sm:text-base">
                {experience.duties.map((duty, index) => (
                  <li key={index} className="pl-1"><strong className="font-semibold text-[#eee3d2]">{"title" in duty ? duty.title : null}</strong>{duty.text}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
