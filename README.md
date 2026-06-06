# Personal Portal

> 基于 Vue 3 + Glassmorphism 设计的个人主页 Portal，从教务系统独立分离后持续演进。

[![Deploy Status](https://github.com/juice094/personal-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/juice094/personal-portal/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/vite-8.0.16-646CFF?logo=vite)](https://vitejs.dev/)
[![Vue](https://img.shields.io/badge/vue-3.5.33-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-6.0.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 在线预览

- **GitHub Pages**: [https://juice094.github.io/personal-portal/](https://juice094.github.io/personal-portal/)

---

## 技术栈

| 层级 | 技术 |
|:---|:---|
| 框架 | Vue 3.5 (Composition API) |
| 构建工具 | Vite 8 + Rolldown |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 (Hash History) |
| SSG | vite-ssg |
| UI 组件 | Element Plus 2 |
| 图标 | Lucide Vue + Element Plus Icons |
| 样式 | SCSS + CSS 变量 |
| 特效 | Canvas 2D 粒子系统 |
| Markdown | markdown-it + highlight.js |
| 内容管理 | Frontmatter + `import.meta.glob` |

---

## 功能特性

### 当前已实现

- [x] **Glassmorphism 设计语言** — 毛玻璃卡片、渐变背景、粒子特效
- [x] **深色/浅色主题** — 一键切换，localStorage 持久化
- [x] **Canvas 粒子系统** — 萤火虫、樱花、雪花、弹幕、草地 5 种主题
- [x] **模块化首页** — 14 个独立模块，支持开关、拖拽排序、响应式布局
- [x] **文章系统** — Markdown 源文件 + Frontmatter，支持代码高亮
- [x] **课程表** — 周视图网格，localStorage 持久化
- [x] **照片墙** — 分类筛选、懒加载预览
- [x] **成就时间线** — 国家级/省级/校级/其他四级分类
- [x] **项目展示** — GitHub 项目卡片，OpenGraph 封面
- [x] **Steam 游戏数据** — 游戏时长、完美通关统计
- [x] **技能雷达图** — ECharts 可视化
- [x] **SSG 预渲染** — 6 个路由生成静态 HTML
- [x] **GitHub Actions 自动部署** — push 到 main 自动构建发布

### 规划中

- [ ] 文章详情页（独立 URL + SEO）
- [ ] RSS / Atom / Sitemap
- [ ] 构建时 GitHub API 数据拉取
- [ ] 全文搜索（Fuse.js）
- [ ] PWA 支持
- [ ] Giscus 评论系统
- [ ] Cloudflare Analytics

详见 [ROADMAP.md](./ROADMAP.md)。

---

## 本地开发

### 前置条件

- Node.js >= 20
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

默认在 http://localhost:5173/personal-portal/ 打开。

### 生产构建

```bash
pnpm build
```

输出到 `dist/` 目录，包含预渲染的静态 HTML。

### 预览生产构建

```bash
pnpm preview
```

---

## 项目结构

```
personal-portal/
├── .github/workflows/      # CI/CD
├── src/
│   ├── assets/             # 静态资源（背景图、校徽等）
│   ├── components/
│   │   ├── effects/        # Canvas 粒子特效系统
│   │   └── portal/         # 门户页面组件（22+ 个）
│   ├── content/
│   │   ├── articles/       # Markdown 文章源文件
│   │   └── loader.ts       # 文章加载与渲染
│   ├── data/
│   │   └── profile.ts      # 个人资料静态配置
│   ├── layouts/
│   │   └── PortalLayout.vue
│   ├── router/
│   ├── stores/             # Pinia 状态管理
│   ├── styles/
│   ├── types/
│   ├── vendor/             # ECharts / Vue 工具封装
│   └── views/portal/       # 5 个页面视图
├── dist/                   # 构建输出（SSG 预渲染 HTML）
├── index.html
├── vite.config.ts
└── ROADMAP.md
```

---

## 内容管理

### 发布文章

在 `src/content/articles/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
description: "文章摘要"
date: "2026-06-06"
category: "article"
tags: ["Vue", "TypeScript"]
cover: "https://example.com/cover.jpg"
published: true
---

正文内容，支持标准 Markdown 语法和代码块高亮。
```

文件名将自动作为文章的 `slug`（URL 标识）。

### 照片、动态、成就、课程表

通过页面右上角的「设置」按钮打开编辑面板，数据持久化在浏览器 localStorage 中。

---

## 部署

本项目使用 **GitHub Actions → GitHub Pages** 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动执行 `pnpm build`（vite-ssg 预渲染）
3. 产物部署到 `gh-pages` 分支
4. GitHub Pages 自动发布

手动部署：

```bash
pnpm build
# 将 dist/ 内容推送到 gh-pages 分支
```

---

## 许可证

[MIT](./LICENSE)

---

*项目从 [course-design-web-frontend](https://github.com/juice094/course-design-web-frontend) 的 Portal 模块独立分离。*
