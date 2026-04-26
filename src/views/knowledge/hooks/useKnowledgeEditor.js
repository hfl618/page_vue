/**
 * @description 知识库编辑器核心业务逻辑
 */

export function useKnowledgeEditor() {
  const route = useRoute()
  const router = useRouter()
  const uiStore = useUiStore()

  // 状态定义
  const articleId = ref(route.params.id || null)
  const categories = ref([])
  const parents = ref([])
  const wordCount = ref(0)
  const showDesigner = ref(false)

  const article = ref({
    title: '', content: '', excerpt: '', tags: '', category_id: 1, visibility: 'private',
    is_collection: 0, parent_id: null, collection_title: '', collection_desc: '',
    collection_icon: 'box', collection_color: 'zinc', collection_image: '', use_custom_image: 0
  })

  /**
   * @description 初始化数据（分类、父级、文章详情）
   */
  const init = async () => {
    try {
      const [catRes, parentRes, detail] = await Promise.all([
        request.get('/v1/knowledge/categories'),
        request.get('/v1/knowledge/potential-parents'),
        articleId.value ? request.get(`/v1/knowledge/read/${articleId.value}`) : Promise.resolve(null)
      ])
      categories.value = catRes || []
      parents.value = parentRes || []
      if (detail) article.value = { ...article.value, ...detail }
    } catch (e) {
      console.error('Core Sync Failure', e)
    } finally {
      uiStore.hideLoading()
    }
  }

  /**
   * @description 字数统计算法
   */
  const calculateWords = (text) => {
    if (!text) return 0
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9']+/g) || []
    return chineseChars.length + englishWords.length
  }

  // 监听内容变化同步字数
  watch(() => article.value.content, (newVal) => {
    wordCount.value = calculateWords(newVal)
  })

  /**
   * @description 保存文章
   */
  const handleSave = async () => {
    uiStore.showLoading('SYNCING', 'Verifying Registry Protocol...')
    try {
      const res = await request.post('/v1/knowledge/save', article.value)
      uiStore.addNotice({ title: 'SUCCESS', message: 'Registry integrity verified.', type: 'success' })
      if (!articleId.value) {
        router.push(`/knowledge/editor/${res.id}`)
        articleId.value = res.id
      }
    } finally {
      uiStore.hideLoading()
    }
  }

  return {
    article,
    articleId,
    categories,
    parents,
    wordCount,
    showDesigner,
    init,
    handleSave
  }
}
