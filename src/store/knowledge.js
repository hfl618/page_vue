import { defineStore } from 'pinia'
import { fetchUserArticles, fetchPublicArticles } from '@/api/modules/knowledge'

export const useKnowledgeStore = defineStore('knowledge', {
  state: () => ({
    articles: [],          // 拍平后的文章池
    isLoaded: false,       // 列表加载状态锁
    lastFetched: null      // 时间戳，用于控制刷新频率
  }),
  
  getters: {
    // 自动按用户过滤 (给个人中心用)
    myArticles: (state) => (userId) => {
      return state.articles.filter(a => a.user_id === userId)
    },
    // 根据 ID 找单篇文章
    getArticleById: (state) => (id) => {
      return state.articles.find(a => String(a.id) === String(id))
    }
  },

  actions: {
    /**
     * 智能获取列表 (带缓存检查)
     * @param {Boolean} force - 是否强制从后端重新拉取
     */
    async syncArticles(force = false) {
      const now = Date.now()
      // 如果数据已存在且距离上次请求不到 5 分钟，且非强制，则直接跳过请求
      if (!force && this.isLoaded && (now - this.lastFetched < 300000)) {
        console.log('>>> [DATA_HUB] Article buffer hit. Skipping remote sync.')
        return this.articles
      }

      try {
        // 请求真实后端 API
        const data = await fetchPublicArticles()
        this.articles = data
        this.isLoaded = true
        this.lastFetched = now
        console.log('>>> [DATA_HUB] Archive synchronized from core.')
        return data
      } catch (err) {
        console.error('>>> [DATA_HUB] Sync failed:', err)
        throw err
      }
    },

    /**
     * 更新单条数据 (全站即时同步)
     */
    updateSingleArticle(newArticle) {
      const idx = this.articles.findIndex(a => a.id === newArticle.id)
      if (idx !== -1) {
        this.articles[idx] = { ...this.articles[idx], ...newArticle }
      } else {
        this.articles.unshift(newArticle) // 如果是新发布的
      }
    }
  }
})
