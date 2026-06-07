import { ref, computed, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/store/knowledge'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

/**
 * @typedef {import('@/types').Article} Article
 */

/**
 * @description 知识库业务逻辑 Hook
 */
export function useKnowledge() {
  console.info('[Hook] useKnowledge initialized')
  const router = useRouter()
  const knowledgeStore = useKnowledgeStore()
  const userStore = useUserStore()
  const uiStore = useUiStore()

  const viewMode = ref('community')
  const currentStack = ref(null)
  const showDirectory = ref(false)
  const dirSearch = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  
  const processingIds = reactive({})
  const selectedIds = ref(new Set())
  const loading = ref(false)

  const init = async () => {
    console.log('[Hook] Calling init sequence...')
    const isPersonal = viewMode.value === 'personal'
    
    // 极致优化：如果 Store 已经有数据，不触发全屏 Loading
    if (!knowledgeStore.isLoaded || knowledgeStore.articles.length === 0) {
      loading.value = true
    }

    try {
      await knowledgeStore.syncArticles(false, { isPersonal, hideLoading: true })
      userStore.fetchProfile().catch(() => null)
    } finally {
      loading.value = false
    }
  }

  // 监听视图切换，自动重新同步
  watch(viewMode, async () => {
    currentStack.value = null // 关键修复：切换 Tab 时重置合集深度
    const isPersonal = viewMode.value === 'personal'
    
    // 同理：切换时如果已有缓存数据，不阻塞 UI
    if (!knowledgeStore.isLoaded) {
      loading.value = true
    }

    try {
      await knowledgeStore.syncArticles(false, { isPersonal, hideLoading: true })
    } finally {
      loading.value = false
    }
  })

  const openStack = (article) => { 
    currentStack.value = article
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }

  const filteredArticles = computed(() => {
    let all = [...(knowledgeStore.articles || [])]
    
    // 0. 全局排序：按更新时间/创建时间倒序 (最新最前)
    all.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0)
      const dateB = new Date(b.updated_at || b.created_at || 0)
      return dateB - dateA
    })

    // 1. 核心修复：如果正在查看某个合集内部，从全局列表中根据 parent_id 实时筛选子项
    if (currentStack.value) {
      return all.filter(a => String(a.parent_id) === String(currentStack.value.id))
    }
    
    // 2. 在主列表视图下，必须过滤掉所有“子文章”，只显示顶级节点
    const roots = all.filter(a => !a.parent_id || a.parent_id === 'null' || a.parent_id === '')
    
    if (viewMode.value === 'personal') {
      return roots.filter(a => String(a.user_id) === String(userStore.currentUser?.id))
    }
    
    // 社区模式：针对 Explore 模式，如果数据还没同步完成且正在加载，返回空数组避免显示旧数据(My Notes)
    if (loading.value && roots.every(a => String(a.user_id) === String(userStore.currentUser?.id))) {
      return []
    }

    // 社区模式：兼容多种“公开”标志 (字符串 'public' 或 数字 1)
    return roots.filter(a => {
      const isPublic = a.visibility === 'public' || Number(a.is_public) === 1
      return isPublic
    })
  })

  const indexItems = computed(() => {
    const all = knowledgeStore.articles || []
    // 这里的逻辑也要同步：如果是合集视图，索引库为“该合集及其子项”
    const base = currentStack.value 
      ? [currentStack.value, ...all.filter(a => String(a.parent_id) === String(currentStack.value.id))] 
      : all
    
    const q = dirSearch.value.toLowerCase()
    return (base || []).filter(i => (i.title || '').toLowerCase().includes(q))
  })

  const paginatedItems = computed(() => {
    return indexItems.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
  })

  const totalPages = computed(() => Math.ceil(indexItems.value.length / itemsPerPage.value) || 1)
  const visiblePages = computed(() => Array.from({length: totalPages.value}, (_, i) => i + 1))

  const toggleSelection = (id) => {
    if (selectedIds.value.has(id)) selectedIds.value.delete(id)
    else selectedIds.value.add(id)
  }

  const toggleAll = () => {
    const currentItems = paginatedItems.value
    const allSelected = currentItems.length > 0 && currentItems.every(i => selectedIds.value.has(i.id))
    if (allSelected) currentItems.forEach(i => selectedIds.value.delete(i.id))
    else currentItems.forEach(i => selectedIds.value.add(i.id))
  }

  return {
    viewMode, currentStack, showDirectory, dirSearch, currentPage, itemsPerPage,
    processingIds, selectedIds, loading, filteredArticles, indexItems, paginatedItems, totalPages, visiblePages,
    init, openStack, toggleSelection, toggleAll, userStore, router,
    clearSelection: () => selectedIds.value.clear(),
    handleDeleteArticle: async (article) => {
      const idKey = String(article.id) + '-delete'
      processingIds[idKey] = true
      try {
        await request.post('/v1/knowledge/delete', { id: article.id }, { hideLoading: true })
        await knowledgeStore.syncArticles(true, { isPersonal: viewMode.value === 'personal', hideLoading: true })
        uiStore.addNotice({ title: 'ENTRY_DELETED', message: `Archive ${article.id} purged.`, type: 'success' })
      } catch(e) {
        console.error('[Purge Protocol Failure]', e)
      } finally {
        delete processingIds[idKey]
      }
    },
    handleTogglePrivacy: async (article) => {
      const idKey = String(article.id) + '-privacy'
      processingIds[idKey] = true
      try {
        const nextStatus = article.visibility === 'public' ? 'private' : 'public'
        // 物理级对标：使用最新的 PATCH 轻量级接口
        await request.patch('/v1/knowledge/visibility', { 
          id: article.id, 
          visibility: nextStatus 
        }, { hideLoading: true })
        
        // 同步刷新列表
        await knowledgeStore.syncArticles(true, { isPersonal: viewMode.value === 'personal', hideLoading: true })
        uiStore.addNotice({ 
          title: 'VISIBILITY_UPDATED', 
          message: `Entry ${article.id} is now ${nextStatus.toUpperCase()}.`, 
          type: 'success' 
        })
      } catch(e) {
        console.error('[Visibility Protocol Failure]', e)
      } finally {
        delete processingIds[idKey]
      }
    }
  }
}
