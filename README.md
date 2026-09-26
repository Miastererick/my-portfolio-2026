# 王明棋 · 设计作品集

以项目为核心的个人设计作品集，记录从视觉探索、商业落地到 AI 工作流与设计工程化的实践。网站通过全屏首页目录、项目分类列表和独立详情页呈现代表项目、设计思路与作品图集。

网站使用 Next.js 构建，支持桌面与手机浏览、亮色与暗色主题，并将项目资料和页面展示分开维护，便于持续补充内容。

## 在本地运行

需要 Node.js 20.9 或更新版本。进入本目录后运行：

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`。修改代码后，开发页面会自动刷新。发布前用 `npm run build` 检查正式构建。

## 修改内容

- 姓名、邮箱、电话、页脚文案：`lib/site-content.ts`
- 分类名称和项目标题、摘要、详情：`lib/portfolio-data.ts`。新增项目时填写唯一 `slug`、所属 `category`、封面对应的 `coverNode` 和 `coverName`，以及内容图片的 `mediaNodes`。没有正确封面时省略封面映射，页面会显示待补占位，不会自动借用其他图片。
- 顶部导航：`components/layout/TopNav.tsx`
- 首页封面与项目目录：`components/layout/PortfolioLayout.tsx`、`components/sections/ProjectDirectory.tsx`
- 关于我与分类页：`components/sections/PortfolioContent.tsx`
- 颜色与字体：`app/globals.css`。主题公共颜色已使用 CSS 变量；尚有部分旧页面的亮色覆盖规则，后续可逐页迁移。

创作资源页 `/library` 汇总提示词与 Skills，并提供“全部 / 提示词 / Skills”分类；原 `/prompts` 和 `/skills` 地址也可直接访问。卡片显示 GitHub 仓库名（合集内使用文件夹名）和封面；没有封面时只显示名称。点击卡片打开分屏详情，介绍使用仓库副标题；没有仓库副标题的合集条目使用文件标题。卡片文案、链接和图片清单维护在 `lib/creative-library.ts`，成品图按项目存放在 `public/library/posters/<项目名>/`，封面使用该项目首张图片；其他单张封面可放在 `public/library/covers/`。同一项目有多张效果图时，在 `images` 数组中按展示顺序填写图片地址、尺寸和说明，详情页会自动显示切换控件。源仓库保持私有；提示词和 Skill 正文继续留在 GitHub。

分类列表只接收标题、摘要和封面等展示字段；完整详情仍由项目详情页读取。图片索引保存在 `figma-media.json`。

项目详情介绍也支持上传后切片展示。将切片按顺序保存到 `public/project-pages/<项目slug>/01.webp`、`02.webp` 等路径，再在项目的 `introSlices` 中登记路径、宽高和替代文本。配置了切片后，详情页用这些图片替代摘要、角色标签和故事正文；未配置时保留文字版。`reviewNotes` 仅供维护时核对推断文案，不会显示在网站上。

## 图片和字体

网站使用 `public/figma/*.webp`、`public/hero-background.webp` 和 `public/fonts/*.woff2`。完整的原始 PNG、TTF、OTF 保存在本机 `source-assets/`，该目录不进入 Git，也不会随网站发布。请另行保管这份备份。

替换图片时，先把原稿放到 `source-assets/public/figma/`，保持文件名不变；然后运行 `node scripts/optimize-images.mjs` 重新生成网页图片和尺寸索引。新增 Figma 图片时，还需在 `figma-media.json` 增加节点、名称和路径，并在相应项目的 `mediaNodes` 中引用。独立写在页面里的图片路径也要同步改为 `.webp`。

网页字体只含当前文案使用的字形。修改文案后，如发现新字形回退到系统字体，可安装临时转换工具并重新生成：

```bash
python3 -m pip install fonttools brotli
python3 scripts/subset-fonts.py
```

字稿取自 `source-assets/public/fonts/`，不会改动备份。完整字体许可证和使用权限仍应按字体原授权管理。

## 本地版本与回退

当前目录有本地 Git 记录；可用 `git log --oneline` 查看版本，`git diff` 检查未保存的改动。需要回到某个版本时，先保存当前工作，再用 Git 恢复对应文件。`source-assets/` 是独立的原稿备份，不受 Git 回退影响。
