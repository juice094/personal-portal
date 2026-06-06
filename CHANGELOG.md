# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Planned
- Article detail pages with dedicated URLs and SEO meta tags
- RSS / Atom / JSON feeds
- Sitemap.xml and robots.txt
- Build-time GitHub API data fetching
- Full-text search with Fuse.js
- PWA support
- Giscus comments on article pages
- Cloudflare Web Analytics

---

## [0.1.0] - 2026-06-06

### Milestone 1: Markdown Rendering + SSG + Auto-Deploy

This release transforms the portal from a pure SPA into a statically generated site with Markdown-based content management and automated deployment.

### Added
- **SSG integration** via `vite-ssg` — all 5 routes pre-rendered to static HTML at build time
- **Markdown article system** — articles stored as `src/content/articles/*.md` with YAML frontmatter
- **`src/content/loader.ts`** — build-time article discovery, frontmatter parsing (gray-matter), and HTML rendering (markdown-it + highlight.js)
- **Markdown styles** (`src/styles/markdown.scss`) — typography, code blocks, syntax highlighting, blockquotes
- **GitHub Actions workflow** (`.github/workflows/deploy.yml`) — automated build and deploy to GitHub Pages on every push to `main`
- **SSR compatibility guards** — `typeof window !== 'undefined'` checks in `PortalLayout.vue` and `ParticleCanvas.vue`
- **Vite plugins** — `markdownRawPlugin` for `.md` imports, `ssrCssExternalPlugin` for Element Plus CSS handling during SSR
- `.nojekyll` in `gh-pages` branch to disable Jekyll processing

### Changed
- `src/main.ts` — migrated from `createApp` to `ViteSSG` export mode
- `src/router/index.ts` — exports plain `routes` array for vite-ssg consumption
- `src/stores/articles.ts` — refactored from localStorage CRUD to read-only static data layer using `loadArticles()`
- `src/components/portal/ArticlesSection.vue` — replaced raw `<pre>` markdown display with rendered HTML via `v-html`
- `vite.config.ts` — added `ssr.noExternal: ['element-plus']`, custom plugins, base path set to `/personal-portal/`
- `package.json` build script — `vite build` → `vite-ssg build`

### Removed
- `demoArticles` and localStorage persistence from article store
- `addArticle` / `removeArticle` / `updateArticle` / `resetToDemo` CRUD methods
- `createPersistPlugin` dependency in article store

### Fixed
- SSR build failure caused by direct `window` access in component setup
- Element Plus CSS import error during server-side rendering
- Markdown frontmatter parsing failure (Vite treating `.md` as JS)

---

*Initial extraction from [course-design-web-frontend](https://github.com/juice094/course-design-web-frontend).*
