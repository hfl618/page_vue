import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchPublicArticles } from '@/api/modules/knowledge'

/**
 * @module KnowledgeStore
 * @description 知识库全局数据中心 (支持超时 Mock 降级)
 */
export const useKnowledgeStore = defineStore('knowledge', () => {
  const articles = ref([])
  const isLoaded = ref(false)
  const lastFetched = ref(null)

  // 模拟数据源 (用于后端离线时保障前端预览)
  const mockData = [
    { 
      id: 'mock-1', title: 'System Architecture Design', author: 'HEFLOS', views: 124, stars: 12, 
      visibility: 'public', tags: 'Arch,Design', excerpt: 'Deep dive into industrial-grade frontend architecture and logic decoupling.',
      created_at: '2026-04-26 10:00:00', user_id: '1'
    },
    { 
      id: 'mock-2', title: 'Hardware Integration Protocol', author: 'LAB_TECH', views: 89, stars: 5, 
      visibility: 'public', tags: 'IoT,Serial', excerpt: 'Documentation for serial port communication and peripheral registry linkage.',
      created_at: '2026-04-26 11:30:00', user_id: '2'
    },
    { 
      id: 'mock-stack-1', title: 'Engineering Bundle v1.0', author: 'SYSTEM', views: 256, stars: 45, 
      visibility: 'public', tags: 'Bundle,Core', excerpt: 'A collection of core infrastructure modules.',
      is_collection: 1, is_stack: 1, collection_title: 'Infrastructure Stack', collection_desc: 'Core architecture components for large-scale deployment.',
      collection_icon: 'cpu', collection_color: 'zinc',
      created_at: '2026-04-25 09:00:00', user_id: '1',
      children: [
        { id: 'mock-3', title: 'Vue 3 Implementation', author: 'HEFLOS', visibility: 'public', excerpt: 'Core view layer protocols.' },
        { id: 'mock-4', title: 'Pinia State Bridge', author: 'HEFLOS', visibility: 'public', excerpt: 'Global data synchronization layer.' }
      ]
    },
    { 
      id: 'mock-5', title: 'Security Protocol Layer', author: 'ADMIN', views: 42, stars: 8, 
      visibility: 'private', tags: 'Security,Auth', excerpt: 'Encrypted communication and identity verification registry.',
      created_at: '2026-04-26 14:20:00', user_id: '1'
    }
  ]

  const myArticles = computed(() => (userId) => {
    return articles.value.filter(a => String(a.user_id) === String(userId))
  })

  const syncArticles = async (force = false, config = {}) => {
    try {
      const data = await fetchPublicArticles(config)
      // 如果后端连接上了但没数据，或者返回了空，我们依然可以使用 Mock 来做演示
      if (!data || data.length === 0) {
        console.info('Registry sync success but empty. Loading Template Data.')
        articles.value = mockData
      } else {
        articles.value = data
      }
      isLoaded.value = true
      lastFetched.value = Date.now()
      return articles.value
    } catch (err) {
      console.warn('Backend node unreachable. Activating Mock Fallback Registry.')
      // 核心：同步失败时，加载模拟数据
      articles.value = mockData
      isLoaded.value = true // 标记为已加载，防止页面一直转圈
      return articles.value
    }
  }

  const updateSingleArticle = (newArticle) => {
    const idx = articles.value.findIndex(a => a.id === newArticle.id)
    if (idx !== -1) {
      articles.value[idx] = { ...articles.value[idx], ...newArticle }
    } else {
      articles.value.unshift(newArticle)
    }
  }

  return {
    articles, isLoaded, lastFetched, myArticles,
    syncArticles, updateSingleArticle
  }
})
