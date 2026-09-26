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
  introSlices?: { path: string; width: number; height: number; alt: string }[];
  reviewNotes?: string[];
  mediaNodes: string[];
  coverNode?: string;
  coverName?: string;
  excludedMediaNames?: string[];
  excludedMediaAssets?: string[];
};

export type ProjectListItem = Pick<PortfolioProject, "slug" | "title" | "english" | "summary"> & {
  cover: string | null;
};

function createIntroSlices(slug: string, title: string, count: number, width: number, height: number, cacheVersion?: string) {
  return Array.from({ length: count }, (_, index) => ({
    path: `/project-pages/${slug}/${String(index + 1).padStart(2, "0")}${cacheVersion ? `-${cacheVersion}` : ""}.webp`,
    width,
    height,
    alt: `${title}项目介绍（${index + 1}/${count}）`,
  }));
}

export const projects: PortfolioProject[] = [
  {
    slug: "comfyui-workflow",
    category: "ai",
    title: "ComfyUI 本地化工作部署",
    english: "AI Design Workflow",
    summary: "将 ComfyUI 与 Midjourney 引入设计生产流程，搭建可复用的 AI 视觉资产工作流，支持非标素材的快速探索、稳定迭代与团队协作。",
    role: "AI 提示词工程师",
    facts: ["全本地化运行", "内网隔离", "高通用性 / 高协作"],
    sections: [
      { heading: "项目背景", body: "高频项目中的非标视觉素材往往需要反复试错，单次生成结果也难以稳定复用。项目希望把生成式 AI 从个人尝试转化为团队可理解、可复现的设计生产流程。" },
      { heading: "我的工作内容", body: "推动 ComfyUI 与 Midjourney 在团队内落地，整理模型使用方式、提示词结构与常用参数，并围绕典型素材需求搭建可复用的节点模板。" },
      { heading: "流程沉淀与协作", body: "将调试过程、节点逻辑和常见问题整理为知识库与排错记录，帮助团队复用已验证的工作流，并根据项目需求持续调整生成结果。" },
      { heading: "项目成果", body: "现有项目资料记录：通过提示词标准库与参数化节点，非标视觉资产产出效率提升 80%。该数据需结合原始统计口径再次确认。" },
    ],
    reviewNotes: ["核对效率提升 80% 的统计口径、适用项目和时间范围。"],
    introSlices: createIntroSlices("comfyui-workflow", "ComfyUI 本地化工作部署", 5, 1917, 1474),
    mediaNodes: ["4703:30898", "4703:30899", "4703:30900", "5895:35037", "5098:34356"],
    coverNode: "4703:30899",
    coverName: "imgImage29",
  },
  {
    slug: "ikea-studio",
    category: "ai",
    title: "IKEA Studio 2026",
    english: "AIGC Furniture Concept",
    summary: "以 IKEA Studio 2026 概念项目为载体，探索生成式 AI 在家具造型、材质表现、室内场景与电商视觉中的应用。",
    role: "提示词工程师",
    facts: ["概念项目", "2026.03", "Nano Banana Pro"],
    sections: [
      { heading: "项目背景", body: "家具产品从概念推演到场景化呈现需要多轮造型、材质和空间探索。该概念项目以 IKEA Studio 2026 为主题，尝试用生成式 AI 加快视觉方案验证，并观察其在电商展示中的表达方式。" },
      { heading: "我的工作内容", body: "负责提示词设计与图像生成，围绕家具单品、材质、光线和室内场景进行方向探索，并对生成结果进行筛选、组合和后期调整。" },
      { heading: "视觉方案整合", body: "将单品效果与空间场景放在同一视觉体系中呈现，统一画面质感和色彩氛围，形成适用于概念展示的家具视觉系列。" },
    ],
    reviewNotes: ["概念项目的具体生成工具、设计范围与后期制作占比需核对。"],
    introSlices: createIntroSlices("ikea-studio", "IKEA Studio 2026", 7, 1917, 1428),
    mediaNodes: ["6250:35109"],
    coverNode: "6250:35109",
    coverName: "imgDesignFurnitureArmchairChairFurnitureDesignVisualizationRender1",
  },
  {
    slug: "asian-games",
    category: "business",
    title: "杭州亚运会保电指挥平台项目",
    english: "Hangzhou Asian Games Power Protection Command Platform",
    summary: "负责整体大屏的视觉风格定义、FUI（科幻用户界面）控件库搭建、2D数据图表设计、3D场景视觉协同以及整体动效规划。",
    role: "视觉 / UI 设计师",
    facts: ["图表设计", "地图配饰设计", "三维场景设计", "动画设计"],
    sections: [
      { heading: "项目背景", body: "亚运会期间需要集中查看赛事、安防、交通和能耗等多类信息，并支持场馆管理与应急调度。项目通过宏观态势和微观场景联动，为指挥中心提供统一的数字孪生大屏。" },
      { heading: "我的工作内容", body: "负责大屏整体视觉风格定义与 FUI 控件库搭建，设计 2D 数据图表并协同 3D 场景视觉，同时规划界面动效，使不同信息层级保持清晰一致。" },
      { heading: "持续迭代与规范", body: "参与系统从 1.0 到 4.0 的视觉迭代，整理可复用的界面规范，并根据业务调整优化图表阅读层级、状态表达和交互反馈。" },
    ],
    reviewNotes: ["核对个人负责的版本范围、3D 协作边界及 1.0 至 4.0 的参与方式。"],
    introSlices: createIntroSlices("asian-games", "杭州亚运会保电指挥平台项目", 3, 1917, 1595),
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
      { heading: "项目背景", body: "变电站运维信息分散在不同区域、设备和指标中，固定层级的界面不易快速聚焦当前任务。项目以精细化分区监控为基础，探索让用户按需查看数据与设备状态的运维平台。" },
      { heading: "我的工作内容", body: "结合前期调研和甲方提供的业务痛点，参与需求梳理、信息组织与交互方案设计，并围绕 3D 场景、分区监控和数据呈现规划视觉体验。" },
      { heading: "生成式交互界面", body: "用户可通过自然语言表达查看需求，由系统识别意图并在当前视窗内生成或替换匹配的 2D / 3D 数据图表，减少在多层菜单间切换的操作。" },
      { heading: "从监控到辅助决策", body: "将设备状态、关键指标与风险提示组织在同一运维流程中，探索结合大语言模型生成结构化诊断信息，帮助用户从数据查看进一步进入问题判断。" },
    ],
    reviewNotes: ["自然语言交互、模型诊断和具体交付范围根据现有摘要与页面素材整理，需核对当前已实现与概念方案的边界。"],
    introSlices: createIntroSlices("substation-intelligence", "本体智能·变电站智能运维管理平台", 7, 1917, 1661, "v2"),
    mediaNodes: ["4434:25831", "4434:25853"],
    coverNode: "4434:25831",
    coverName: "uploadedSubstationHero",
    excludedMediaNames: ["imgImage18"],
  },
  {
    slug: "hainan-grid",
    category: "business",
    title: "海南电网计量大楼三维可视化",
    english: "Hainan Power Grid Metering Building 3D Visualization",
    summary: "围绕海南电网计量大楼构建三维可视化体验，以建筑场景、设备信息和数据界面呈现楼宇空间与业务状态。",
    role: "视觉 / UI 设计师",
    facts: ["动态环境光感", "空间叙事", "微动效"],
    sections: [
      { heading: "项目背景", body: "计量大楼的空间结构与业务信息需要在同一界面中被理解。项目以建筑三维模型为主体，把楼层空间、计量业务信息和数据视图结合起来，探索更直观的楼宇数字化展示。" },
      { heading: "我的工作内容", body: "围绕建筑模型和业务界面开展视觉设计，梳理宏观楼宇与局部信息的展示层级，并通过环境光感、半透明界面和空间镜头组织场景体验。" },
      { heading: "空间与信息融合", body: "将数据面板融入建筑场景，利用材质、明暗和界面层级区分模型与信息，兼顾空间沉浸感和数据可读性。" },
      { heading: "动态展示", body: "通过连续的镜头过渡连接楼宇整体与局部视图，减少视角切换带来的方向丢失，让空间浏览和信息查看保持连贯。" },
    ],
    reviewNotes: ["楼宇实际展示的计量业务范围、动态交互和个人负责的 3D 制作边界需核对。"],
    introSlices: createIntroSlices("hainan-grid", "海南电网计量大楼三维可视化", 4, 1917, 1280),
    mediaNodes: ["4603:28111", "4603:28112"],
    coverNode: "4603:28111",
    coverName: "imgCn003530P2DeMain0000Png1",
    excludedMediaAssets: ["4603:28111:imgRect1", "4603:28111:imgRect3", "4603:28111:imgRect4", "4603:28111:imgRect5"],
  },
  {
    slug: "energy-platform",
    category: "business",
    title: "企业中台管理",
    english: "Energy Project Management Platform",
    summary: "面向能源业务团队的内部管理平台，整合资源、场景与数据管理，并通过统一界面支持日常业务维护。",
    role: "视觉 / 交互设计师",
    facts: ["原型交互优化", "深浅双色", "设计规范文档"],
    sections: [
      { heading: "项目背景", body: "能源团队的资源、场景和数据管理涉及多类后台页面。项目在既有业务原型基础上梳理管理信息与操作入口，目标是让常用任务更容易查找和完成。" },
      { heading: "我的工作内容", body: "围绕后台管理流程优化界面结构和交互反馈，整理表格、筛选、日程等页面的信息层级，并统一不同业务页面的组件与状态表达。" },
      { heading: "多场景与主题适配", body: "结合现有页面素材，完善深色与浅色界面的色彩和组件表现，确保数据表格、表单和日程页面在不同主题下保持清晰可读。" },
      { heading: "规范与协作", body: "沉淀可复用的页面样式和组件规则，减少相似页面反复设计的成本，并为后续业务扩展提供一致的界面基础。" },
    ],
    reviewNotes: ["项目正式名称、本人负责模块、深浅主题范围需核对。原有 42% 和 20% 指标未在新文案中沿用，待有依据后再补。"],
    mediaNodes: ["5707:34828", "5707:35069", "5707:35163", "5707:35389", "5707:35580", "5707:35782"],
    coverNode: "5707:34828",
    coverName: "imgRectangle2",
    excludedMediaAssets: ["5707:34828:imgRectangle"],
  },
  {
    slug: "qinghai-control-room",
    category: "business",
    title: "青海电力机房可视化项目",
    english: "Qinghai Power Control Room",
    summary: "负责可视化机房项目的全部界面设计，并在原有交互原型基础上优化使用体验。",
    role: "视觉 / 体验设计师",
    facts: ["体验诊断", "交互逻辑优化", "界面重构"],
    sections: [
      { heading: "项目背景", body: "机房可视化页面需要帮助用户快速定位设备和运行信息。项目基于已有交互原型继续优化信息组织与操作体验，使关键状态和常用功能更容易识别。" },
      { heading: "我的工作内容", body: "负责项目界面设计，评估既有原型中的信息层级和交互路径，梳理当前位置、功能区域、图表控制与流程状态，并据此调整页面结构。" },
      { heading: "界面优化方向", body: "围绕设备信息浏览和日常操作场景，统一视觉层级与控件反馈，降低界面理解成本，让用户更快找到所需信息。" },
    ],
    reviewNotes: ["背景和工作内容根据现有摘要扩写；需补充真实页面素材、具体机房业务与交付范围。"],
    mediaNodes: [],
  },
  {
    slug: "design-system",
    category: "engineering",
    title: "设计工程化 · 可复用组件库",
    english: "Design Engineering & Component Building",
    summary: "从 0 到 1 构建可复用的设计资产中台，制定统一视觉规范与资产调用逻辑，支撑高频项目交付。",
    role: "设计工程化 / 组件库搭建",
    facts: ["8 大风格", "126+ 项目", "设计提效 50%"],
    sections: [
      { heading: "项目背景", body: "多行业项目包含大量重复的界面模块和视觉资产。若每次从头搭建，容易造成交付速度慢、规范不一致和协作成本高，因此需要建立可检索、可组合、可复用的设计资产体系。" },
      { heading: "我的工作内容", body: "从 0 到 1 梳理资产分类与调用方式，搭建组件库并制定视觉规范；利用 Auto Layout 和 Design Tokens 组织组件结构与设计变量，支持不同项目按需组合。" },
      { heading: "组件与状态管理", body: "围绕主题、内容层级和交互状态构建组件变体，统一组件的默认、悬停、选中和禁用等表现，减少重复绘制并保持跨页面一致性。" },
      { heading: "复用与协作", body: "将组件、规范和使用说明沉淀为团队可共享的设计资产，帮助设计与研发更快理解组件边界，并为后续项目迭代保留扩展空间。" },
    ],
    reviewNotes: ["核对 8 大风格、126+ 项目、设计提效 50% 和 16 种状态的统计范围与数据来源。"],
    introSlices: createIntroSlices("design-system", "设计工程化 · 可复用组件库", 9, 1917, 1306),
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
    role: "数字孪生可视化设计",
    facts: ["自适应布局", "高通用性", "组件库"],
    sections: [
      { heading: "项目背景", body: "校园空间、组织和业务数据分属不同维度，单一平面页面难以表达它们之间的关系。项目以数字孪生为线索，探索将真实校园空间与业务信息组织到统一的可视化体验中。" },
      { heading: "我的工作内容", body: "梳理现实空间、业务组织和数字应用之间的层级关系，参与场景信息架构与可视化界面设计，并通过模块化布局支持不同内容组合。" },
      { heading: "场景与信息组织", body: "将校园建筑和业务场景分组呈现，建立从整体概览到具体内容的浏览层次，使用户能够在场景信息与业务信息之间切换。" },
    ],
    reviewNotes: ["项目实际覆盖的校园业务、数据类型和可交互范围需核对。"],
    introSlices: createIntroSlices("smart-campus", "智慧校园新范式", 6, 1917, 1241),
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
    role: "3D 可视化与动态设计",
    facts: ["三维场景", "动态视觉", "视觉实验"],
    sections: [
      { heading: "项目背景", body: "围绕空间感、材质和运动节奏的视觉练习，探索静态画面之外的三维表达方式，并尝试把实验性视觉转化为可展示的场景作品。" },
      { heading: "我的工作内容", body: "负责三维场景的概念构思、构图与视觉呈现，并根据作品主题调整材质、光线和镜头关系；部分作品结合动效探索空间变化与叙事节奏。" },
      { heading: "作品方向", body: "通过不同尺度的场景、抽象物体和镜头运动练习空间表达，积累可用于项目视觉提案与动态界面的视觉方法。" },
    ],
    reviewNotes: ["该项目是多件视觉练习的集合，需确认作品范围、工具和动效完成度。"],
    mediaNodes: ["3425:1546"],
    coverNode: "3425:1546",
    coverName: "imgRectangle",
  },
  {
    slug: "more-visual-work",
    category: "visual",
    title: "其他视觉项目",
    english: "More Visual Work",
    summary: "汇集圣圆水务集团、电信集团和苏州综合零碳电厂等项目的视觉实践，呈现不同业务场景下的信息与空间表达。",
    role: "视觉设计师",
    facts: ["水务信息化", "电信业务", "零碳电厂"],
    sections: [
      { heading: "项目背景", body: "不同领域的业务系统在信息层级、使用对象和展示场景上各有特点。本项目集合水务、电信和综合能源等视觉案例，记录面向不同业务需求的界面与场景表达。" },
      { heading: "我的工作内容", body: "围绕各项目的业务主题开展视觉梳理与方案呈现，结合现有作品素材组织信息层级、界面布局和场景视觉，使项目重点能被快速理解。" },
      { heading: "案例范围", body: "当前作品集素材涉及圣圆水务集团信息化平台及系统集成、电信集团项目和苏州综合零碳电厂。各案例的具体负责模块与交付范围待补充确认。" },
    ],
    reviewNotes: ["当前素材只列出项目名称，具体业务目标、个人职责和交付内容需补充核对。"],
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
    role: "设计知识整理与分享",
    facts: ["技术学习", "案例整理", "团队分享"],
    sections: [
      { heading: "项目背景", body: "设计工具和制作方法持续变化，团队需要把零散的个人学习转化为可复用的经验。技术分享会通过案例讲解和实操记录，帮助成员共同了解新方法。" },
      { heading: "我的工作内容", body: "围绕新技术和设计实践进行学习、整理与演示，把操作过程拆解成小案例，并在分享会上说明使用方式、适用场景和注意事项。" },
      { heading: "知识沉淀", body: "会前准备并录制操作视频，分享后保留案例资料，方便同事回看和继续实践，让一次交流成为团队可重复使用的学习材料。" },
    ],
    reviewNotes: ["分享会主题、举办频率和团队覆盖范围需核对。"],
    mediaNodes: ["5637:34804", "3609:26268", "3609:27419"],
    coverNode: "5637:34804",
    coverName: "imgImage1",
  },
];

export function mediaAssetsFor(project: PortfolioProject) {
  return figmaMedia
    .filter((asset) => project.mediaNodes.includes(asset.node)
      && !project.excludedMediaNames?.includes(asset.name)
      && !project.excludedMediaAssets?.includes(`${asset.node}:${asset.name}`));
}

export function mediaFor(project: PortfolioProject) {
  return mediaAssetsFor(project).map((asset) => asset.path);
}

export function coverFor(project: PortfolioProject) {
  return figmaMedia.find((asset) => asset.node === project.coverNode && asset.name === project.coverName)?.path;
}

export function listItemFor(project: PortfolioProject): ProjectListItem {
  return {
    slug: project.slug,
    title: project.title,
    english: project.english,
    summary: project.summary,
    cover: coverFor(project) ?? null,
  };
}
