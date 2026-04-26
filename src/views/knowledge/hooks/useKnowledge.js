import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/store/knowledge'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

/**
 * @description 知识库列表业务逻辑抽离
 */
export function useKnowledgeList() {
  const router = useRouter()
  const knowledgeStore = useKnowledgeStore()
  const userStore = useUserStore()
  const uiStore = useUiStore()

  // 状态定义
  const viewMode = ref('community')
  const currentStack = ref(null)
  const showDirectory = ref(false)
  const dirSearch = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  
  // 追踪正在执行异步操作的 ID (格式: 'id-action')
  const processingIds = ref(new Set())

  // 监听每页条数变化，重置页码
  watch(itemsPerPage, () => {
    currentPage.value = 1
  })

  /**
   * @description 处理删除协议
   */
  const handleDeleteArticle = async (article) => {
    const actionKey = `${article.id}-delete`
    processingIds.value.add(actionKey)
    
    try {
      // 模拟后端处理
      await new Promise(resolve => setTimeout(resolve, 1200))
      uiStore.addNotice({ title: 'REGISTRY_PURGED', message: `Entry [${article.title}] removed.`, type: 'success' })
      await knowledgeStore.syncArticles(true)
    } catch (e) {
      console.error('Purge Failed', e)
    } finally {
      processingIds.value.delete(actionKey)
    }
  }

  // 初始化加载
  const init = async () => {
    try {
      const syncTask = knowledgeStore.syncArticles(true).catch(e => {
        console.warn('Sync Articles Failed:', e)
        return []
      })
      const profileTask = userStore.fetchProfile().catch(e => {
        console.warn('Fetch Profile Failed:', e)
        return null
      })
      await Promise.allSettled([syncTask, profileTask])
      await nextTick()
    } catch (e) {
      console.error('Core Initialization Error:', e)
    } finally {
      setTimeout(() => uiStore.hideLoading(), 500)
    }
  }

  // 权限检查
  const isStackOwner = computed(() => {
    if (!currentStack.value || !userStore.currentUser?.id) return false
    return String(currentStack.value.user_id) === String(userStore.currentUser.id)
  })

  // 核心过滤逻辑
  const filteredArticles = computed(() => {
    const all = knowledgeStore.articles || []
    if (currentStack.value) return currentStack.value.children || []
    if (viewMode.value === 'personal') {
      if (!userStore.currentUser?.id) return []
      return all.filter(a => String(a.user_id) === String(userStore.currentUser.id))
    }
    return all.filter(a => a.visibility === 'public')
  })

  // 索引搜索
  const indexItems = computed(() => {
    const base = currentStack.value ? [currentStack.value, ...(currentStack.value.children || [])] : filteredArticles.value
    const q = dirSearch.value.toLowerCase()
    return base.filter(i => (i.title || '').toLowerCase().includes(q))
  })

  // 分页计算
  const totalPages = computed(() => Math.ceil(indexItems.value.length / itemsPerPage.value) || 1)
  const paginatedItems = computed(() => indexItems.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value))
  const visiblePages = computed(() => {
    let pages = []
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
    return pages
  })

  // 操作方法
  const goToPage = (p) => { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
  const openStack = (article) => { currentStack.value = article; window.scrollTo({ top: 0, behavior: 'smooth' }) }
  
  const unstack = async (id) => {
    if (!id || !isStackOwner.value) return
    uiStore.showLoading('UNSTACKING', 'Breaking hierarchy...')
    try {
      await request.post('/v1/knowledge/save', { id, parent_id: null })
      await knowledgeStore.syncArticles(true)
      if (currentStack.value) currentStack.value.children = currentStack.value.children.filter(c => c.id !== id)
      uiStore.addNotice({ title: 'SUCCESS', message: 'Registry unstacked.', type: 'success' })
    } finally { uiStore.hideLoading() }
  }

  return {
    viewMode,
    currentStack,
    showDirectory,
    dirSearch,
    currentPage,
    itemsPerPage,
    isStackOwner,
    filteredArticles,
    indexItems,
    paginatedItems,
    totalPages,
    visiblePages,
    processingIds,
    handleDeleteArticle,
    init,
    goToPage,
    openStack,
    unstack,
    userStore,
    router
  }
}
