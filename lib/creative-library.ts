export type CreativeLibraryItem = {
  name: string;
  styleDescription: string;
  description: string;
  useCases: string;
  cover?: string;
  width?: number;
  height?: number;
  images?: { src: string; width: number; height: number; alt: string }[];
  githubUrl: string;
};

export const promptLibrary: CreativeLibraryItem[] = [
  {
    name: "ddl-panel-03-prompt",
    styleDescription: "系列海报风格拆解",
    description: "系列海报风格拆解｜可复用视觉系统与 JSON 提示词",
    useCases: "海报风格分析、参考图转提示词、系列海报模板与 JSON 结构化提示词。",
    githubUrl: "https://github.com/Miastererick/ddl-panel-03-prompt/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-05-prompt",
    styleDescription: "复古绿调菜谱海报",
    description: "S1 + F1 · 复古绿调完整菜谱海报",
    useCases: "3:4 菜谱海报、成品图、食材和调味信息、六步做法。",
    cover: "/library/posters/ddl-panel-05-prompt/01.png",
    width: 1086,
    height: 1448,
    images: [
      { src: "/library/posters/ddl-panel-05-prompt/01.png", width: 1086, height: 1448, alt: "ddl-panel-05-prompt 菜谱海报成品图" },
      { src: "/library/posters/ddl-panel-05-prompt/02.png", width: 1086, height: 1448, alt: "ddl-panel-05-prompt 配料搭配图" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-skills/blob/main/ddl-panel-05-prompt-recipe-poster-s1-f1/PROMPT.md",
  },
  {
    name: "ddl-panel-06-prompt",
    styleDescription: "复古家常菜标签海报",
    description: "D1 + S7 + F12 · 复古家常菜标签海报",
    useCases: "3:4 菜品信息海报，结合成品参考、结构线稿和配色参考。",
    cover: "/library/posters/ddl-panel-06-prompt/01.jpg",
    width: 738,
    height: 995,
    images: [
      { src: "/library/posters/ddl-panel-06-prompt/01.jpg", width: 738, height: 995, alt: "ddl-panel-06-prompt 成品图 1" },
      { src: "/library/posters/ddl-panel-06-prompt/02.jpg", width: 704, height: 995, alt: "ddl-panel-06-prompt 成品图 2" },
      { src: "/library/posters/ddl-panel-06-prompt/03.jpg", width: 704, height: 995, alt: "ddl-panel-06-prompt 成品图 3" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-skills/blob/main/ddl-panel-06-prompt-recipe-label-d1-s7-f12/PROMPT.md",
  },
];

export const skillLibrary: CreativeLibraryItem[] = [
  {
    name: "ddl-panel-01-skill",
    styleDescription: "深色中文菜谱海报",
    description: "9:16 深色中文菜谱海报｜Figma 可编辑母版与六步做法",
    useCases: "需要六步做法、食材信息和火候标识的竖版菜谱海报。",
    cover: "/library/posters/ddl-panel-01-skill/01.png",
    width: 2172,
    height: 3272,
    images: [
      { src: "/library/posters/ddl-panel-01-skill/01.png", width: 2172, height: 3272, alt: "ddl-panel-01-skill 成品图 1" },
      { src: "/library/posters/ddl-panel-01-skill/02.png", width: 2172, height: 3272, alt: "ddl-panel-01-skill 成品图 2" },
      { src: "/library/posters/ddl-panel-01-skill/03.png", width: 2172, height: 3272, alt: "ddl-panel-01-skill 成品图 3" },
      { src: "/library/posters/ddl-panel-01-skill/04.png", width: 2172, height: 3272, alt: "ddl-panel-01-skill 成品图 4" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-01-skill/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-02-skill",
    styleDescription: "竖版图文菜谱海报",
    description: "竖版中文菜谱海报｜成品图、精确配料与六步流程",
    useCases: "菜品介绍、图文食谱和六步烹饪流程海报。",
    cover: "/library/posters/ddl-panel-02-skill/01.jpg",
    width: 2174,
    height: 2896,
    images: [
      { src: "/library/posters/ddl-panel-02-skill/01.jpg", width: 2174, height: 2896, alt: "ddl-panel-02-skill 成品图 1" },
      { src: "/library/posters/ddl-panel-02-skill/02.jpg", width: 2174, height: 2896, alt: "ddl-panel-02-skill 成品图 2" },
      { src: "/library/posters/ddl-panel-02-skill/03.png", width: 2172, height: 2896, alt: "ddl-panel-02-skill 成品图 3" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-02-skill/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-03-prompt",
    styleDescription: "系列海报风格拆解",
    description: "系列海报风格拆解｜可复用视觉系统与 JSON 提示词",
    useCases: "风格迁移、系列海报规划与参考图设计分析。",
    githubUrl: "https://github.com/Miastererick/ddl-panel-03-prompt/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-04-skill",
    styleDescription: "重点高亮菜谱海报",
    description: "3:4 中文菜谱海报｜Figma 母版 04、火力标识与重点高亮",
    useCases: "统一视觉样式的竖版菜谱海报与系列食谱。",
    cover: "/library/posters/ddl-panel-04-skill/01.jpg",
    width: 2172,
    height: 3272,
    images: [
      { src: "/library/posters/ddl-panel-04-skill/01.jpg", width: 2172, height: 3272, alt: "ddl-panel-04-skill 成品图 1" },
      { src: "/library/posters/ddl-panel-04-skill/02.png", width: 2172, height: 3272, alt: "ddl-panel-04-skill 成品图 2" },
      { src: "/library/posters/ddl-panel-04-skill/03.jpg", width: 2172, height: 3272, alt: "ddl-panel-04-skill 成品图 3" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-04-skill/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-05-skill",
    styleDescription: "高留白微型人物海报",
    description: "高留白产品海报｜摄影主体与微型手绘人物互动",
    useCases: "产品广告、微型人物世界视觉与高留白海报。",
    cover: "/library/posters/ddl-panel-05-skill/01.png",
    width: 2172,
    height: 2896,
    images: [
      { src: "/library/posters/ddl-panel-05-skill/01.png", width: 2172, height: 2896, alt: "ddl-panel-05-skill 成品图 1" },
      { src: "/library/posters/ddl-panel-05-skill/02.png", width: 1086, height: 1448, alt: "ddl-panel-05-skill 成品图 2" },
      { src: "/library/posters/ddl-panel-05-skill/03.png", width: 1086, height: 1448, alt: "ddl-panel-05-skill 成品图 3" },
      { src: "/library/posters/ddl-panel-05-skill/04.jpg", width: 1086, height: 1448, alt: "ddl-panel-05-skill 成品图 4" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-05-skill/blob/main/SKILL.md",
  },
  {
    name: "ddl-panel-06-skill",
    styleDescription: "宽幅手写菜名字图",
    description: "宽幅中文菜名标题图｜手写字体、英文名与副标题",
    useCases: "菜谱标题、菜品封面字图与中文字体设计。",
    cover: "/library/posters/ddl-panel-06-skill/01.jpg",
    width: 1054,
    height: 374,
    images: [
      { src: "/library/posters/ddl-panel-06-skill/01.jpg", width: 1054, height: 374, alt: "ddl-panel-06-skill 成品图 1" },
      { src: "/library/posters/ddl-panel-06-skill/02.jpg", width: 1054, height: 374, alt: "ddl-panel-06-skill 成品图 2" },
      { src: "/library/posters/ddl-panel-06-skill/03.jpg", width: 1054, height: 374, alt: "ddl-panel-06-skill 成品图 3" },
    ],
    githubUrl: "https://github.com/Miastererick/ddl-panel-06-skill/blob/main/SKILL.md",
  },
  {
    name: "figma-recipe-poster-skill",
    styleDescription: "可编辑菜谱海报工作流",
    description: "把一次菜谱海报制作，整理成可以重复执行、人能检查、以后还能持续演进的 Figma 工作流。",
    useCases: "需要在 Figma 中制作和维护可编辑菜谱海报的场景。",
    githubUrl: "https://github.com/Miastererick/figma-recipe-poster-skill/blob/main/SKILL.md",
  },
];

export const allCreativeLibrary: CreativeLibraryItem[] = [
  ...promptLibrary,
  ...skillLibrary.filter((skill) => !promptLibrary.some((prompt) => prompt.githubUrl === skill.githubUrl)),
];
