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
    uiStore.showLoading('SYNCHRONIZING', 'Accessing Registry...')
    try {
      const data = await fetchArticleDetail(route.params.id)
      article.value = data
      wordCount.value = calculateWords(data.content)
    } catch (e) {
      console.error('Fetch Detail Error:', e)
    } finally {
      // 预览初始化逻辑留给组件处理
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
      id: h.id || '',
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
