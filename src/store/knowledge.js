import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchPublicArticles } from '@/api/modules/knowledge'

/**
 * @module KnowledgeStore
 * @description 知识库全局数据中心 - 工业级高可用同步版
 */
export const useKnowledgeStore = defineStore('knowledge', () => {
  const articles = ref([])
  const isLoaded = ref(false)
  const lastFetched = ref(null)

  // 1. 物理加载缓存
  const loadCache = () => {
    const cache = localStorage.getItem('heflos_knowledge_cache')
    if (cache) {
      try {
        const parsed = JSON.parse(cache)
        if (Array.isArray(parsed)) {
          articles.value = parsed
          isLoaded.value = true
        }
      } catch (e) {
        console.error('Cache Corruption:', e)
      }
    }
  }

  // 兜底 Mock
  const mockData = [
    { 
      id: 'mock-1', title: 'HeFlos System Protocol', author: 'ADMIN', views: 124, stars: 12, 
      visibility: 'public', tags: 'Core', excerpt: 'Base registry synchronization active.',
      created_at: '2026-04-26 10:00:00', user_id: '1'
    }
  ]

  const myArticles = computed(() => (userId) => {
    return articles.value.filter(a => String(a.user_id) === String(userId))
  })

  /**
   * @description 同步云端数据 (极端物理容错版)
   */
  const syncArticles = async (force = false, config = {}) => {
    // A. 优先加载本地缓存或 Mock 确保秒开
    if (articles.value.length === 0) {
      loadCache()
      if (articles.value.length === 0) articles.value = mockData
    }

    try {
      // B. 激进同步：5s 还没反应就直接放弃，不干扰用户
      const data = await fetchPublicArticles({ timeout: 5000, hideLoading: true, ...config })
      
      if (data && Array.isArray(data)) {
        articles.value = data
        localStorage.setItem('heflos_knowledge_cache', JSON.stringify(data))
      }
      
      isLoaded.value = true
      lastFetched.value = Date.now()
      return articles.value
    } catch (err) {
      // C. 物理级静默：同步失败不报错，确保用户体验
      console.warn('[Knowledge] Sync skipped (timeout/offline). Running on cache/mock.')
      isLoaded.value = true
      return articles.value
    }
  }

  const updateSingleArticle = (newArticle) => {
    const idx = articles.value.findIndex(a => a.id === newArticle.id)
    if (idx !== -1) articles.value[idx] = { ...articles.value[idx], ...newArticle }
    else articles.value.unshift(newArticle)
    localStorage.setItem('heflos_knowledge_cache', JSON.stringify(articles.value))
  }

  return {
    articles, isLoaded, lastFetched, myArticles,
    syncArticles, updateSingleArticle
  }
})
