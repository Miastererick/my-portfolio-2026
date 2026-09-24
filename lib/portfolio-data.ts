import figmaMedia from "@/figma-media.json";

export const categories = [
  { id: "ai", title: "AI 探索项目", english: "Hero Project: The Future Concept", color: "#ff6b22" },
  { id: "business", title: "商业落地项目", english: "Industry Experience: AI-Augmented", color: "#f2efe6" },
  { id: "visual", title: "跨维度视觉探索", english: "Spatial & Motion Graphics", color: "#2e9afe" },
  { id: "engineering", title: "设计工程化", english: "Workflow & Efficiency", color: "#4ade80" },
  { id: "other", title: "其他", english: "Other", color: "#8b8b8b" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type PortfolioProject = {
  slug: string;
  category: CategoryId;
  title: string;
  english?: string;
  summary: string;
  role?: string;
  facts?: string[];
  sections: { heading: string; body: string }[];
  mediaNodes: string[];
  coverNode: string;
  coverName: string;
  excludedMediaNames?: string[];
};

export type ProjectListItem = Pick<PortfolioProject, "slug" | "title" | "english" | "summary"> & {
  cover: string;
};

export const projects: PortfolioProject[] = [
  {
    slug: "comfyui-workflow",
    category: "ai",
    title: "ComfyUI 本地化工作部署",
    english: "AI Design Workflow",
    summary: "率先在团队内引入 ComfyUI 与 Midjourney，搭建自动化资产生产工作流，在保障工业级标准的前提下，大幅提升非标资产的产出效率与质量。",
    role: "AI 提示词工程师",
    facts: ["全本地化运行", "内网隔离", "高通用性 / 高协作"],
    sections: [
      { heading: "参数化节点模板", body: "利用 ComfyUI 的参数化特性，建立了提示词标准词库与节点模板。将原本不可控的 AI 生图转化为可控的工程化输出。" },
      { heading: "知识沉淀与产能转化", body: "构建系统化的 AIGC 专属知识库，深度拆解 ComfyUI 底层工作流与核心节点逻辑，将前沿技术探索转化为可复用的实战经验。持续追踪主流模型的技术迭代，结构化沉淀底层逻辑与历史排错记录。" },
      { heading: "项目成果", body: "通过建立提示词标准库与参数化节点，将非标视觉资产的产出效率提升了 80%，有效解决高频项目中的设计产能瓶颈。" },
    ],
    mediaNodes: ["4703:30898", "4703:30899", "4703:30900", "5895:35037", "5098:34356"],
    coverNode: "4703:30899",
    coverName: "imgImage29",
  },
  {
    slug: "ikea-studio",
    category: "ai",
    title: "IKEA Studio 2026",
    english: "AIGC Furniture Concept",
    summary: "以虚构的 IKEA Studio 2026 为命题，探索 AIGC 技术在家居设计及电商视觉中的全链路商业化落地。",
    role: "提示词工程师",
    facts: ["概念项目", "2026.03", "Nano Banana Pro"],
    sections: [
      { heading: "项目背景", body: "传统家居设计与视觉呈现往往面临研发周期长、场景搭设成本高昂等痛点。本项目从单品形态推演、材质测试到室内场景融合及 UI 界面展示，进行快速的概念输出与视觉调整。" },
      { heading: "设计流程", body: "明确视觉策略与项目目标，确定创意方向与情绪板；借助 AI 进行形态、场景、材质与光影探索；通过合成优化和视觉延展完成最终展示。" },
    ],
    mediaNodes: ["6250:35109"],
    coverNode: "6250:35109",
    coverName: "imgDesignFurnitureArmchairChairFurnitureDesignVisualizationRender1",
  },
  {
    slug: "asian-games",
    category: "business",
    title: "杭州亚运会保电指挥平台项目",
    english: "Hangzhou Asian Games Power Protection Command Platform",
    summary: "构建集宏观态势感知、微观场馆管理与应急指挥调度于一体的综合性数字孪生大屏系统。",
    role: "视觉 / UI 设计师",
    facts: ["图表设计", "地图配饰设计", "三维场景设计", "动画设计"],
    sections: [
      { heading: "项目背景", body: "为保障亚运会赛事顺利进行，系统整合赛事、安防、交通及能耗数据，通过三维可视化技术赋能指挥中心，实现“一屏观全局，一网管全域”的业务目标。" },
      { heading: "我的角色", body: "负责整体大屏的视觉风格定义、FUI 控件库搭建、2D 数据图表设计、3D 场景视觉协同及整体动效规划。" },
      { heading: "敏捷迭代与体验精细化", body: "主导系统从 1.0 到 4.0 的视觉演进与规范统一，在高频业务变更下确保复杂数据图表的可读性与交互逻辑清晰。" },
    ],
    mediaNodes: ["4107:30066", "4107:30123", "4107:30142"],
    coverNode: "4107:30066",
    coverName: "imgAiWebAppCrmSaasUxDesign3",
  },
  {
    slug: "substation-intelligence",
    category: "business",
    title: "本体智能·变电站智能运维管理平台",
    english: "Ontology Intelligence · Substation Intelligent Operation",
    summary: "围绕精细化分区监控与生成式交互，构建能够按需展示数据的变电站智能运维平台。",
    role: "视觉 / 体验设计师",
    facts: ["需求分析", "3D 可视化", "UX 交互设计", "动态感知"],
    sections: [
      { heading: "需求分析", body: "通过前期数据调研和详细的需求分析，结合甲方提供的核心痛点，提供精细化分区监控系统。" },
      { heading: "生成式交互界面", body: "摒弃层层嵌套的复杂菜单。用户向智能助手输入自然语言指令，系统识别意图，在当前视窗内实时渲染并替换最匹配的 2D / 3D 数据图表，使界面由静态预设转向动态生成。" },
      { heading: "数据到决策", body: "结合底层大语言模型的实时计算，系统在展示关键指标的同时输出结构化风险诊断报告，形成从数据监控到业务决策的闭环。" },
    ],
    mediaNodes: ["4434:25831", "4434:25853"],
    coverNode: "4434:25831",
    coverName: "imgAiWebAppCrmSaasUxDesign1",
    excludedMediaNames: ["imgImage18"],
  },
  {
    slug: "hainan-grid",
    category: "business",
    title: "海南电网计量大楼三维可视化",
    english: "Hainan Power Grid Metering Building 3D Visualization",
    summary: "通过环境光感、毛玻璃质感与流体运镜，让建筑模型和数据指标形成具有空间连贯性的数字体验。",
    role: "视觉 / UI 设计师",
    facts: ["动态环境光感", "空间叙事", "微动效"],
    sections: [
      { heading: "项目背景", body: "突破传统数字孪生系统重数据展示、轻用户感知的局限。将冷硬的建筑模型与数据指标转化为具有生命力的数字空间，降低用户认知负荷。" },
      { heading: "动态光影律动", body: "引入数据驱动的全局光照，界面光影随设备状态及环境变化柔和过渡，让系统氛围随数据“呼吸”。" },
      { heading: "无界通透质感", body: "运用半透明毛玻璃面板消除 2D 与 3D 的视觉边界，让数据悬浮于三维空间，同时兼顾信息阅读与场景景深。" },
      { heading: "流体空间运镜", body: "在宏观与微观的层级切换中，以平滑的 3D 运镜代替生硬跳转，保持空间方向感。" },
    ],
    mediaNodes: ["4107:30251", "4603:28112", "4603:28111"],
    coverNode: "4107:30251",
    coverName: "imgAiWebAppCrmSaasUxDesign1",
  },
  {
    slug: "energy-platform",
    category: "business",
    title: "企业中台管理",
    english: "Energy Project Management Platform",
    summary: "面向能源团队的内部解决方案平台，整合资源管理、场景管理与数据管理。",
    facts: ["原型交互优化", "深浅双色", "设计规范文档"],
    sections: [
      { heading: "项目背景", body: "根据已有原型优化交互与视觉效果，打造一站式后台管理平台，使复杂业务更易使用。" },
      { heading: "多场景适配", body: "引入深浅双色模式，适应不同工作环境与光照条件，并针对大屏及手持端优化信息结构。" },
      { heading: "设计规范", body: "重新定义字重层级与色彩映射逻辑，建立跨端一致的视觉规范，降低用户学习成本与团队沟通成本。" },
      { heading: "成果总结", body: "通过优化布局，操作路径缩短 42%，用户完成任务时间降低 20%。" },
    ],
    mediaNodes: ["5707:34828", "5707:35069", "5707:35163", "5707:35389", "5707:35580", "5707:35782"],
    coverNode: "5707:34828",
    coverName: "imgRectangle",
  },
  {
    slug: "qinghai-control-room",
    category: "business",
    title: "青海电力机房可视化项目",
    english: "Qinghai Power Control Room",
    summary: "负责可视化机房项目的全部界面设计，并在原有交互原型基础上优化使用体验。",
    facts: ["体验诊断", "交互逻辑优化", "界面重构"],
    sections: [
      { heading: "负责范围", body: "拆解用户需求，在原有交互原型基础上提出可行、可用的优化建议，完成全部界面设计工作。" },
      { heading: "重构策略", body: "梳理当前位置、功能区、图表控制和流程进度等信息，让操作路径更清晰。" },
    ],
    mediaNodes: ["3758:13585"],
    coverNode: "3758:13585",
    coverName: "imgRectangle",
  },
  {
    slug: "design-system",
    category: "engineering",
    title: "设计工程化 · 可复用组件库",
    english: "Design Engineering & Component Building",
    summary: "从 0 到 1 构建可复用的设计资产中台，制定统一视觉规范与资产调用逻辑，支撑高频项目交付。",
    facts: ["8 大风格", "126+ 项目", "设计提效 50%"],
    sections: [
      { heading: "标准化体系搭建", body: "针对高频交付场景，构建覆盖多行业的可复用设计资产中台，减少重复性劳动，保障项目视觉产出的一致性。" },
      { heading: "高可用性组件架构", body: "深度运用 Auto Layout 与 Design Tokens，构建具有弹性和逻辑控制的组件库，支持主题模式和多语言适配。" },
      { heading: "变体系统", body: "梳理核心变量并封装 16 种交互与视觉状态，实现一次构建、全场景复用。" },
      { heading: "设计变量管理", body: "基于主题与内容层级等多维属性构建可用变体，降低设计与研发的协作成本。" },
    ],
    mediaNodes: ["4108:39168", "4336:26061", "6108:36275", "6109:36303"],
    coverNode: "4108:39168",
    coverName: "imgImage21",
  },
  {
    slug: "smart-campus",
    category: "visual",
    title: "智慧校园新范式",
    english: "Digital Campus",
    summary: "以数字孪生逻辑连接真实世界、业务机构与数字空间，探索校园场景的可视化呈现。",
    facts: ["自适应布局", "高通用性", "组件库"],
    sections: [
      { heading: "数字校园逻辑架构", body: "从现实世界映射、真实世界业务机构到数字孪生应用运行方式，逐层拆解校园业务与空间关系。" },
      { heading: "场景分组展示", body: "以多维场景展示校园业务分布与合作关系，保持界面结构与信息层级清晰。" },
    ],
    mediaNodes: ["5637:34801", "3571:341", "5637:34802", "4339:26193"],
    coverNode: "5637:34801",
    coverName: "imgImage9",
  },
  {
    slug: "visual-experiments",
    category: "visual",
    title: "3D 可视化与动态设计",
    english: "3D Visualization Design",
    summary: "跨越静态界面与空间视觉的探索，汇集三维场景、动态叙事与视觉实验。",
    sections: [{ heading: "作品展示", body: "Figma 作品集中收录的三维可视化与动态设计系列。" }],
    mediaNodes: ["3425:1546"],
    coverNode: "3425:1546",
    coverName: "imgRectangle",
  },
  {
    slug: "more-visual-work",
    category: "visual",
    title: "其他视觉项目",
    english: "More Visual Work",
    summary: "圣圆水务集团、电信集团及苏州综合零碳电厂等项目的视觉展示。",
    sections: [{ heading: "项目目录", body: "圣圆水务集团信息化平台建设及系统集成项目、电信集团项目、苏州综合零碳电厂。" }],
    mediaNodes: ["4380:26229"],
    coverNode: "4380:26229",
    coverName: "imgTest033DeMain00001",
  },
  {
    slug: "knowledge-sharing",
    category: "other",
    title: "设计中心 · 技术分享会",
    english: "Knowledge Sharing",
    summary: "将新技术学习与设计实践整理为案例，与团队共同成长。",
    sections: [
      { heading: "设计部知识分享", body: "学习并理解新的设计趋势与技术，将技巧综合、整理为小案例，在分享会中与同事交流。" },
      { heading: "实践与复盘", body: "会议前录制操作视频，方便同事在会后回顾。" },
    ],
    mediaNodes: ["5637:34804", "3609:26268", "3609:27419"],
    coverNode: "5637:34804",
    coverName: "imgImage1",
  },
];

export function mediaAssetsFor(project: PortfolioProject) {
  return figmaMedia
    .filter((asset) => project.mediaNodes.includes(asset.node) && !project.excludedMediaNames?.includes(asset.name));
}

export function mediaFor(project: PortfolioProject) {
  return mediaAssetsFor(project).map((asset) => asset.path);
}

export function coverFor(project: PortfolioProject) {
  return figmaMedia.find((asset) => asset.node === project.coverNode && asset.name === project.coverName)?.path ?? mediaFor(project)[0];
}

export function listItemFor(project: PortfolioProject): ProjectListItem {
  return {
    slug: project.slug,
    title: project.title,
    english: project.english,
    summary: project.summary,
    cover: coverFor(project),
  };
}
