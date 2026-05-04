import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchPublicArticles, fetchUserArticles } from '@/api/modules/knowledge'
import { useUserStore } from '@/store/user'

/**
 * @module KnowledgeStore
 * @description 知识库全局数据中心 - 工业级高可用同步版
 */
export const useKnowledgeStore = defineStore('knowledge', () => {
  const articles = ref([])
  const isLoaded = ref(false)
  const lastFetched = ref(null)

  /**
   * @description 物理加载缓存
   */
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

  /**
   * @description 物理注水：直接从外部注入数据（如初始化接口）
   */
  const hydrate = (data) => {
    if (Array.isArray(data)) {
      articles.value = data
      isLoaded.value = true
      lastFetched.value = Date.now()
      localStorage.setItem('heflos_knowledge_cache', JSON.stringify(data))
    }
  }

  /**
   * @description 个人文章计算属性
   */
  const myArticles = computed(() => (userId) => {
    return articles.value.filter(a => String(a.user_id) === String(userId))
  })

  /**
   * @description 同步云端数据 (SWR 模式：先用旧的，后台悄悄对账)
   * @param {boolean} force - 是否强制同步（显示 Loading）
   * @param {object} options - { isPersonal: boolean }
   */
  const syncArticles = async (force = false, options = {}) => {
    const userStore = useUserStore()

    // 1. 极致优化：如果内存有数据且不是强制刷新，立即返回现有数据
    if (!force && articles.value.length > 0) {
      // 开启后台静默对账，不加 await，不阻塞返回
      performBackgroundSync(options)
      return articles.value
    }

    // 2. 否则执行完整同步（显示 Loading）
    return await performRealSync(options)
  }

  /**
   * @description 内部逻辑：执行真实的网络同步
   */
  const performRealSync = async (options = {}) => {
    const userStore = useUserStore()
    if (articles.value.length === 0) {
      loadCache()
    }

    try {
      const fetchFn = options.isPersonal ? fetchUserArticles : fetchPublicArticles
      const data = await fetchFn({ timeout: 15000, hideLoading: options.hideLoading })
      
      if (data && Array.isArray(data)) {
        processAndSetArticles(data, userStore)
      }
      
      isLoaded.value = true
      lastFetched.value = Date.now()
      return articles.value
    } catch (err) {
      console.warn('[Knowledge] Sync failed. Using cache.')
      if (articles.value.length === 0) articles.value = mockData
      isLoaded.value = true
      return articles.value
    }
  }

  /**
   * @description 辅助逻辑：后台静默刷新
   */
  const performBackgroundSync = async (options = {}) => {
    try {
      const fetchFn = options.isPersonal ? fetchUserArticles : fetchPublicArticles
      const data = await fetchFn({ timeout: 10000, hideLoading: true })
      
      if (data && Array.isArray(data)) {
        // 对比内容，只有在真正变化时才更新引用，避免 Vue 无谓的重新渲染
        const oldHash = JSON.stringify(articles.value.map(a => a.id + (a.updated_at || a.created_at)))
        const newHash = JSON.stringify(data.map(a => a.id + (a.updated_at || a.created_at)))
        
        if (oldHash !== newHash) {
          console.info('[Knowledge] Background sync: Data updated.')
          const userStore = useUserStore()
          processAndSetArticles(data, userStore)
        }
      }
    } catch (e) {
      // 静默失败，不打扰用户
    }
  }

  /**
   * @description 数据加工并存入状态
   */
  const processAndSetArticles = (data, userStore) => {
    articles.value = data.map(a => {
      const artId = String(a.id)
      if (Number(a.is_starred) === 1) {
        userStore.favorites.article.add(artId)
      } else {
        userStore.favorites.article.delete(artId)
      }
      return a
    })
    localStorage.setItem('heflos_knowledge_cache', JSON.stringify(data))
  }

  /**
   * @description 更新单篇文章状态
   */
  const updateSingleArticle = (newArticle) => {
    const idx = articles.value.findIndex(a => a.id === newArticle.id)
    if (idx !== -1) articles.value[idx] = { ...articles.value[idx], ...newArticle }
    else articles.value.unshift(newArticle)
    localStorage.setItem('heflos_knowledge_cache', JSON.stringify(articles.value))
  }

  /**
   * @description 清理本地缓存
   */
  const clearCache = () => {
    localStorage.removeItem('heflos_knowledge_cache')
    articles.value = []
    isLoaded.value = false
  }

  return {
    articles, isLoaded, lastFetched, myArticles,
    syncArticles, updateSingleArticle, loadCache, clearCache, hydrate
  }
})
