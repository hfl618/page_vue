import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/store/knowledge'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

/**
 * @description 知识库列表业务逻辑 (支持多选批量操作)
 */
export function useKnowledgeList() {
  const router = useRouter()
  const knowledgeStore = useKnowledgeStore()
  const userStore = useUserStore()
  const uiStore = useUiStore()

  // 1. 基础状态
  const viewMode = ref('community')
  const currentStack = ref(null)
  const showDirectory = ref(false)
  const dirSearch = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  
  // 2. 交互状态
  const processingIds = ref(new Set())
  const selectedIds = ref(new Set()) // 存储选中的文章 ID

  watch(itemsPerPage, () => { currentPage.value = 1 })

  // 3. 多选逻辑
  const toggleSelection = (id) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  const toggleAll = () => {
    const currentItems = paginatedItems.value
    const allSelected = currentItems.length > 0 && currentItems.every(i => selectedIds.value.has(i.id))
    
    if (allSelected) {
      currentItems.forEach(i => selectedIds.value.delete(i.id))
    } else {
      currentItems.forEach(i => selectedIds.value.add(i.id))
    }
  }

  const clearSelection = () => selectedIds.value.clear()

  /**
   * @description 批量删除协议
   */
  const handleBatchDelete = async () => {
    const ids = Array.from(selectedIds.value)
    if (ids.length === 0) return

    uiStore.showLoading('PURGING', `Wiping ${ids.length} entries from registry...`)
    try {
      await Promise.all(ids.map(id => request.post('/v1/knowledge/delete', { id }, { hideLoading: true })))
      uiStore.addNotice({ title: 'BATCH_PURGE_SUCCESS', message: 'Registry integrity maintained.', type: 'success' })
      clearSelection()
      await knowledgeStore.syncArticles(true)
    } finally {
      uiStore.hideLoading()
    }
  }

  /**
   * @description 批量合并到合集
   */
  const handleBatchMerge = async () => {
    const ids = Array.from(selectedIds.value)
    if (ids.length < 2) {
      uiStore.addNotice({ title: 'PROTOCOL_ERR', message: 'Minimum 2 units required for stacking.', type: 'warning' })
      return
    }
    uiStore.addNotice({ title: 'LINKING', message: 'Establishing bundle sequence...', type: 'info' })
  }

  // 4. 基础业务方法
  const handleTogglePrivacy = async (article) => {
    const actionKey = `${article.id}-privacy`
    processingIds.value.add(actionKey)
    try {
      const newVisibility = article.visibility === 'public' ? 'private' : 'public'
      await request.post('/v1/knowledge/save', { id: article.id, visibility: newVisibility }, { hideLoading: true })
      await knowledgeStore.syncArticles(true, { hideLoading: true })
    } finally { processingIds.value.delete(actionKey) }
  }

  const handleDeleteArticle = async (article) => {
    const actionKey = `${article.id}-delete`
    processingIds.value.add(actionKey)
    try {
      await request.post('/v1/knowledge/delete', { id: article.id }, { hideLoading: true })
      uiStore.addNotice({ title: 'REGISTRY_PURGED', message: `Entry [${article.title}] removed.`, type: 'success' })
      await knowledgeStore.syncArticles(true, { hideLoading: true })
    } finally { processingIds.value.delete(actionKey) }
  }

  const init = async () => {
    try {
      const syncTask = knowledgeStore.syncArticles(true).catch(() => [])
      const profileTask = userStore.fetchProfile().catch(() => null)
      await Promise.allSettled([syncTask, profileTask])
    } finally { setTimeout(() => uiStore.hideLoading(), 500) }
  }

  const openStack = (article) => { currentStack.value = article; window.scrollTo({ top: 0, behavior: 'smooth' }) }

  // 5. 计算属性
  const filteredArticles = computed(() => {
    const all = knowledgeStore.articles || []
    if (currentStack.value) return currentStack.value.children || []
    if (viewMode.value === 'personal') {
      return all.filter(a => String(a.user_id) === String(userStore.currentUser?.id))
    }
    return all.filter(a => a.visibility === 'public')
  })

  const indexItems = computed(() => {
    const base = currentStack.value ? [currentStack.value, ...(currentStack.value.children || [])] : knowledgeStore.articles
    const q = dirSearch.value.toLowerCase()
    return (base || []).filter(i => (i.title || '').toLowerCase().includes(q))
  })

  const paginatedItems = computed(() => {
    return indexItems.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
  })

  const totalPages = computed(() => Math.ceil(indexItems.value.length / itemsPerPage.value) || 1)

  const visiblePages = computed(() => {
    return Array.from({length: totalPages.value}, (_, i) => i + 1)
  })

  return {
    viewMode, currentStack, showDirectory, dirSearch, currentPage, itemsPerPage,
    processingIds, selectedIds,
    filteredArticles,
    indexItems,
    paginatedItems,
    totalPages,
    visiblePages,
    init, toggleSelection, toggleAll, clearSelection, handleBatchDelete, handleBatchMerge,
    handleDeleteArticle, handleTogglePrivacy, openStack, userStore, router
  }
}
