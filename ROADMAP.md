# Personal Portal 发展路线图

> 基于 Vue 3 + Glassmorphism 的个人主页 Portal，从教务系统独立分离后的演进规划。
> 参考对象覆盖开发者主页、个人博客、商业作品集、全能门户四大类型。

---

## 现状快照

| 维度 | 状态 |
|:---|:---|
| **架构** | Vue 3 + Vite + Pinia + TypeScript，纯前端 SPA |
| **数据** | 静态配置（profile.ts）+ localStorage（文章/照片/动态/课程表/成就） |
| **部署** | 需手动 `pnpm build` 后上传静态文件 |
| **外部集成** | GitHub 项目（静态 OpenGraph 封面）、Steam 游戏（静态配置） |
| **特效** | Canvas 粒子系统（5 种主题）、点击波纹、页面过渡、Toast 通知 |
| **主题** | 深色/浅色切换、渐变/纯色/图片背景、14 个模块独立开关与拖拽排序 |

---

## Phase 1: 基础设施（1–2 周）

目标：解决「内容无法持久化、SEO 为零、部署靠手动」三大痛点。

### 1.1 静态站点生成（SSG）+ SEO

**[INFERRED]** 当前 SPA 模式下搜索引擎无法索引任何内容，社交分享时 OpenGraph 信息缺失。

| 方案 | 工作量 | 优劣 |
|:---|:---|:---|
| **vite-ssg**（推荐） | 低 | 最小改动，保留现有 Vite 生态，支持预渲染 + 自动路由级 OG 生成 |
| Nuxt 3 | 中 | 生态更完善，但需重构路由和组件目录结构 |
| Astro + Vue islands | 中 | 性能最优，但 Glassmorphism 交互组件需重写 hydrate 逻辑 |

**行动项：**
- 接入 `vite-ssg`，首页/各子页面生成静态 HTML
- 每页注入 `<meta name="description">`、OpenGraph、结构化数据（Person Schema）
- 生成 `sitemap.xml` 和 `robots.txt`

### 1.2 内容持久化方案

localStorage 的致命缺陷：换设备/清缓存即丢失，且无法被搜索引擎索引。

| 方案 | 适用场景 | 优劣 |
|:---|:---|:---|
| **Markdown + Git**（推荐） | 技术博客型 | 零成本、版本控制、天然支持 SSG、与 GitHub 工作流一致 |
| Notion API | 全能门户型 | 可视化编辑、移动端友好、需处理 API 限流（3 req/s） |
| Sanity / Strapi | 商业作品集型 | 结构化内容、角色权限、有托管成本 |

**行动项：**
- 文章系统：从 localStorage 迁移到 `src/content/articles/*.md`，Frontmatter 管理元数据
- 照片/成就/动态：保留 localStorage 作为「访客演示模式」，作者端通过 Markdown/JSON 静态配置
- 课程表：保持 localStorage（个人工具属性，无索引需求）

### 1.3 自动化部署

| 平台 | 成本 | 特性 |
|:---|:---|:---|
| **GitHub Pages**（推荐） | 免费 | 与仓库同源，GitHub Actions 自动构建，自定义域名支持 |
| Vercel | 免费 | 边缘网络、自动预览部署、Analytics 内置 |
| Cloudflare Pages | 免费 | 全球 CDN、边缘函数（后续可扩展 API） |

**行动项：**
- 配置 GitHub Actions workflow：push 到 main → `pnpm install && pnpm build` → deploy to `gh-pages` branch
- 设置自定义域名（如 `portal.juice094.dev`）

---

## Phase 2: 数据动态化（2–3 周）

目标：将静态占位数据替换为真实、实时、自动更新的外部源。

### 2.1 GitHub 实时集成

**现状：** 6 个项目的手动配置 + OpenGraph 封面（可能 404 失效）。

**升级路径：**
- 构建时通过 GitHub GraphQL API 拉取仓库列表、stars/forks/language/updatedAt
- 使用 GitHub 官方 `repository-open-graph-image`（`https://opengraph.githubassets.com/1/{owner}/{repo}`）自动获取封面
- 增加「最近贡献」热力图（GitHub Contributions Graph API 或抓取 `.js-contribution-graph`）
- **注意：** 未认证 API 限流 60 req/h，建议通过 GitHub Actions 构建时拉取并缓存为 JSON 静态文件

### 2.2 Steam / 游戏数据

**现状：** 游戏列表和统计数据为纯静态文本。

**升级路径：**
- Steam 公开 profile 页面抓取（无需 API Key）：最近在玩、游戏时长、完美通关数
- 或使用 Steam Web API（需 API Key，每小时限流 100,000 次，个人站完全够用）
- 增加 Steam 个人页 embed / 动态徽章

### 2.3 编码时长统计（可选）

- 接入 WakaTime API，在「开发者」身份卡片或 About 页展示年度编码时长、常用语言排行
- 与 SkillsRadar 形成数据闭环（雷达图为静态自评，WakaTime 为客观统计）

### 2.4 RSS 输出

- 为文章系统生成 `rss.xml` / `atom.xml` / `feed.json`
- 便于读者通过 RSS 阅读器订阅，也利于 SEO 发现新内容

---

## Phase 3: 功能扩展（3–4 周）

### 3.1 评论系统

| 方案 | 匿名评论 | 数据归属 | 接入成本 |
|:---|:---:|:---|:---|
| **Giscus**（推荐） | ❌ | GitHub Discussions | 极低：一个 script + 仓库开 Discussions |
| Twikoo | ✅ | 自有 MongoDB/腾讯云 | 中：需部署云函数 |
| Waline | ✅ | 自有数据库/LeanCloud | 中：需部署服务端 |

**建议：** 技术博客型站点首选 Giscus，读者即 GitHub 用户，评论数据永久保存在仓库 Discussions 中，无额外托管成本。

### 3.2 访问统计

- **Umami**（自托管）：开源、隐私友好、无 Cookie、可部署在 Vercel + Railway
- **Plausible**（付费/自托管）：更轻量，但自托管需服务器
- **Cloudflare Web Analytics**（免费）：零侵入、无 JS SDK、与 Cloudflare Pages 天然集成

### 3.3 全文搜索

- 接入 `fuse.js` 或 `minisearch`，在构建时索引所有 Markdown 文章
- 提供命令面板式搜索（Ctrl+K），支持标题/正文/标签多字段检索

### 3.4 PWA 支持

- 添加 `manifest.json`、Service Worker（`vite-plugin-pwa`）
- 支持离线阅读已缓存文章、添加到主屏幕

### 3.5 多语言（i18n）

- 使用 `vue-i18n`，先覆盖「页面标题、导航、空状态提示」等 UI 文本
- 内容层面：文章本身保持中文，About 页可提供中英双语版本

---

## Phase 4: 商业化与专业化（按需推进）

### 4.1 个人品牌强化

- **在线简历 PDF 导出：** About 页一键生成排版精美的 PDF 简历（`html2pdf.js` 或 Puppeteer 服务端渲染）
- **Newsletter 订阅：** 集成 Buttondown / Revue / 自建 Listmonk，文章更新时自动邮件推送
- **Speaking / Talks 模块：** 演讲经历、技术分享视频嵌入（Bilibili / YouTube）

### 4.2 内容变现（可选）

- **付费文章/专栏：** 接入 Gumroad / 小册子平台，或自建 Stripe 支付流
- **赞助入口：** GitHub Sponsors、爱发电 widget 嵌入
- **咨询服务预约：** Calendly 嵌入，提供技术咨询/简历修改时段

### 4.3 开源产品化

- 将 Portal 本身包装为「开箱即用的 Glassmorphism 个人主页模板」
- 提供 `config.ts` 单文件配置（个人信息、社交链接、模块开关）
- 发布到 GitHub Template + Vercel Deploy Button，降低他人使用门槛

---

## 技术债务与持续优化

| 项目 | 现状 | 目标 |
|:---|:---|:---|
| **Element Plus 体积** | 完整引入，ui-vendor chunk ~650KB gzip | 按需引入或替换为轻量组件（减少 400KB+） |
| **lucide-vue-next** | 已废弃，需迁移到 `@lucide/vue` | 迁移到新包，消除 deprecation 警告 |
| **echarts 体积** | 全量引入，仅 SkillsRadar 使用 | 按需注册 RadarChart 组件，或考虑替换为轻量 SVG 自绘 |
| **TypeScript 严格性** | `noUnusedLocals: true` 导致开发体验紧绷 | 放宽为 warning 级别，保留 build 阶段报错 |
| **依赖升级** | Vue 3.5.33 / Vite 8.0.10 | 跟随主版本更新，关注 Rolldown 迁移兼容性 |

---

## 参考站点

| 类型 | 站点 | 可借鉴点 |
|:---|:---|:---|
| 开发者主页 | [antfu.me](https://antfu.me) | SSG + Markdown 内容流、演讲/Talks 模块、自动 RSS |
| 全能门户 | [rauno.me](https://rauno.me) | 极致动效、命令面板搜索、深色模式系统级适配 |
| 商业作品集 | [brittanychiang.com](https://brittanychiang.com) | 项目时间线、技术栈标签化、Experience 模块 |
| 游戏/Steam | [steamhunters.com](https://steamhunters.com) | Steam 数据可视化、成就追踪、游戏库统计 |
| 内容平台 | [nekocalc.com](https://nekocalc.com)（示例）| Notion 作为 CMS、增量静态再生成 |

---

## 下一步即时行动

1. **本周内**：配置 GitHub Actions → GitHub Pages 自动部署
2. **本周内**：接入 `vite-ssg`，完成首页静态预渲染 + OG 标签
3. **下周**：文章系统迁移至 Markdown + Frontmatter，移除 localStorage 文章存储
4. **下下周**：GitHub Actions 构建时拉取 GitHub API 数据，生成静态 JSON 缓存

---

*路线图版本: v1.0 | 生成日期: 2026-06-06*
