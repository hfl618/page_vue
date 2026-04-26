import { defineStore } from 'pinia'
import { fetchPublicArticles } from '@/api/modules/knowledge'

/**
 * @module KnowledgeStore
 * @description 知识库全局数据中心
 */
export const useKnowledgeStore = defineStore('knowledge', () => {
  const articles = ref([])
  const isLoaded = ref(false)
  const lastFetched = ref(null)

  /**
   * @description 自动按用户过滤 (给个人中心用)
   */
  const myArticles = computed(() => (userId) => {
    return articles.value.filter(a => String(a.user_id) === String(userId))
  })

  /**
   * @description 根据 ID 找单篇文章
   */
  const getArticleById = computed(() => (id) => {
    return articles.value.find(a => String(a.id) === String(id))
  })

  /**
   * @description 智能获取列表 (带缓存检查)
   * @param {Boolean} force - 是否强制从后端重新拉取
   */
  const syncArticles = async (force = false) => {
    const now = Date.now()
    if (!force && isLoaded.value && (now - lastFetched.value < 300000)) {
      return articles.value
    }

    try {
      const data = await fetchPublicArticles()
      articles.value = data || []
      isLoaded.value = true
      lastFetched.value = now
      return articles.value
    } catch (err) {
      console.error('Knowledge Sync Failed:', err)
      throw err
    }
  }

  /**
   * @description 更新单条数据 (全站即时同步)
   */
  const updateSingleArticle = (newArticle) => {
    const idx = articles.value.findIndex(a => a.id === newArticle.id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...newArticle }
    } else {
      articles.value.unshift(newArticle)
    }
  }

  return {
    articles,
    isLoaded,
    lastFetched,
    myArticles,
    getArticleById,
    syncArticles,
    updateSingleArticle
  }
})
