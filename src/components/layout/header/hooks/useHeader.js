/**
 * @description 全局顶栏业务逻辑
 */

export function useHeader(emit) {
  const router = useRouter()
  const route = useRoute()
  const searchQuery = ref('')
  let debounceTimer = null

  // 自动计算标题
  const parentLabel = computed(() => route.meta.parent || '')
  const currentLabel = computed(() => route.meta.title || 'CORE')

  /**
   * @description 统一的返回逻辑
   */
  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  /**
   * @description 带防抖的搜索处理
   */
  const handleSearch = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      emit('search', searchQuery.value)
    }, 300)
  }

  return {
    searchQuery,
    parentLabel,
    currentLabel,
    goBack,
    handleSearch
  }
}
