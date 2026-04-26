import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/store/knowledge'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

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
  
  const processingIds = ref(new Set())
  const selectedIds = ref(new Set())

  const init = () => {
    console.log('[Hook] Calling init sequence...')
    knowledgeStore.syncArticles(true, { hideLoading: true })
    userStore.fetchProfile().catch(() => null)
  }

  const openStack = (article) => { 
    currentStack.value = article
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }

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
    processingIds, selectedIds, filteredArticles, indexItems, paginatedItems, totalPages, visiblePages,
    init, openStack, toggleSelection, toggleAll, userStore, router,
    clearSelection: () => selectedIds.value.clear(),
    handleDeleteArticle: async (article) => {
      try {
        await request.post('/v1/knowledge/delete', { id: article.id }, { hideLoading: true })
        knowledgeStore.syncArticles(true, { hideLoading: true })
      } catch(e){}
    },
    handleTogglePrivacy: async (article) => {
      try {
        const newVisibility = article.visibility === 'public' ? 'private' : 'public'
        await request.post('/v1/knowledge/save', { id: article.id, visibility: newVisibility }, { hideLoading: true })
        knowledgeStore.syncArticles(true, { hideLoading: true })
      } catch(e){}
    }
  }
}
