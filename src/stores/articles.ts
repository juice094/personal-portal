import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { loadArticles, type LoadedArticle } from '@/content/loader'

import type { ArticleCategory } from '@/types/content'
export type { ArticleCategory } from '@/types/content'

export const useArticleStore = defineStore('articles', () => {
  // 从静态 Markdown 文件加载，构建时确定，运行时只读
  const _articles = ref<LoadedArticle[]>(loadArticles())
  const articles = readonly(_articles)

  const _activeCategory = ref<ArticleCategory | 'all'>('all')
  const activeCategory = readonly(_activeCategory)

  const filteredArticles = computed(() => {
    if (_activeCategory.value === 'all') return _articles.value
    return _articles.value.filter(a => a.category === _activeCategory.value)
  })

  const publishedArticles = computed(() =>
    filteredArticles.value.filter(a => a.published),
  )

  function setCategory(cat: ArticleCategory | 'all') {
    _activeCategory.value = cat
  }

  return {
    articles,
    activeCategory,
    filteredArticles,
    publishedArticles,
    setCategory,
  }
})
