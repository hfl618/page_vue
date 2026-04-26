import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/store/ui'
import { fetchArticleDetail } from '@/api/modules/knowledge'

/**
 * @description 知识库阅读器业务逻辑
 */
export function useKnowledgeReader() {
  const route = useRoute()
  const uiStore = useUiStore()

  const article = ref(null)
  const isPreviewReady = ref(false)
  const showOutline = ref(true)
  const showMeta = ref(true)
  const lineSpacing = ref(1.8)
  const wordCount = ref(0)
  const outline = ref([])

  /**
   * @description 字数统计
   */
  const calculateWords = (text) => {
    if (!text) return 0
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9']+/g) || []
    return chineseChars.length + englishWords.length
  }

  /**
   * @description 获取文章详情 (物理加速版)
   */
  const fetchDetail = async () => {
    const id = route.params.id
    if (!id) return

    // 物理加固：如果是 mock 数据，直接停止请求，防止 404 弹窗
    if (String(id).startsWith('mock-')) {
      console.info('Mock Protocol Detected, skipping cloud sync.')
      const knowledgeCache = localStorage.getItem('heflos_knowledge_cache')
      if (knowledgeCache) {
        const articles = JSON.parse(knowledgeCache)
        const found = articles.find(a => String(a.id) === String(id))
        if (found) {
          article.value = { ...found, content: found.content || '## MOCK_DATA\nThis is a simulation protocol.' }
          return 
        }
      }
      return
    }

    // 1. 尝试从知识库缓存中寻找摘要 (SWR)
    const knowledgeCache = localStorage.getItem('heflos_knowledge_cache')
    if (knowledgeCache) {
      const articles = JSON.parse(knowledgeCache)
      const found = articles.find(a => String(a.id) === String(id))
      if (found) {
        article.value = { ...found, content: found.content || 'Decrypting transmission...' }
      }
    }

    // 2. 静默请求完整内容，不再显示全局 Loading
    try {
      // 显式指定超时与静默加载
      const data = await fetchArticleDetail(id, { timeout: 10000, hideLoading: true })
      if (data) {
        article.value = data
        wordCount.value = calculateWords(data.content)
      }
    } catch (e) {
      console.warn('Backend sync failed, showing cached data only.')
    }
  }

  /**
   * @description 生成大纲数据
   */
  const generateOutline = (el) => {
    if (!el) return
    const headings = el.querySelectorAll('h1, h2, h3')
    outline.value = Array.from(headings).map(h => ({
      text: h.innerText.replace(/^#+\s/, ''),
      level: h.tagName.toLowerCase(),
      el: h
    }))
  }

  const scrollToHeading = (el) => {
    el.scrollIntoView({ behavior: 'smooth' })
  }

  return {
    article,
    isPreviewReady,
    showOutline,
    showMeta,
    lineSpacing,
    wordCount,
    outline,
    fetchDetail,
    generateOutline,
    scrollToHeading
  }
}
