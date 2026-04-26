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
   * @description 获取文章详情
   */
  const fetchDetail = async () => {
    const id = route.params.id
    if (!id) {
      uiStore.addNotice({ title: 'PARAM_ERROR', message: 'Invalid article sequence.', type: 'error' })
      return
    }

    uiStore.showLoading('SYNCHRONIZING', 'Accessing Registry...')
    try {
      const data = await fetchArticleDetail(id)
      if (data) {
        article.value = data
        wordCount.value = calculateWords(data.content)
      } else {
        throw new Error('Null sequence received.')
      }
    } catch (e) {
      console.error('Fetch Detail Error:', e)
      uiStore.addNotice({ 
        title: 'SYNC_TIMEOUT', 
        message: 'Backend node not responding. Please check server status.', 
        type: 'error' 
      })
    } finally {
      uiStore.hideLoading()
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
