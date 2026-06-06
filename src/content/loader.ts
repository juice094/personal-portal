import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import type { Article } from '@/types/content'

const md = new MarkdownIt({
  html: false,        // SAFETY: 禁用原始 HTML，防止 XSS
  linkify: true,      // 自动转换 URL 为链接
  typographer: true,  // 启用智能排版（引号、破折号等）
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        // fallthrough
      }
    }
    return md.utils.escapeHtml(str)
  },
})

export interface LoadedArticle extends Article {
  slug: string
  htmlContent: string
}

/**
 * 从 src/content/articles/*.md 批量加载文章。
 * 使用 Vite 的 import.meta.glob 在构建时静态导入，
 * 运行时无需文件系统访问。
 */
export function loadArticles(): LoadedArticle[] {
  // Vite 特定语法：构建时解析为模块映射
  // markdownRawPlugin 将 .md 文件作为默认导出的字符串处理
  const modules = import.meta.glob('./articles/*.md', { eager: true })

  const articles: LoadedArticle[] = []

  for (const [path, mod] of Object.entries(modules)) {
    const content = (mod as { default: string }).default
    const slug = path.replace(/^\.\/articles\//, '').replace(/\.md$/, '')
    const parsed = matter(content)

    const data = parsed.data as {
      title: string
      description: string
      date: string
      category: Article['category']
      tags: string[]
      cover?: string
      published?: boolean
      url?: string
    }

    const article: LoadedArticle = {
      id: `article-${slug}`,
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      content: parsed.content,
      htmlContent: md.render(parsed.content),
      cover: data.cover,
      tags: data.tags ?? [],
      date: data.date ?? new Date().toISOString().split('T')[0],
      category: data.category ?? 'article',
      published: data.published !== false,
      url: data.url,
    }

    articles.push(article)
  }

  // 按日期降序排列
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return articles
}
