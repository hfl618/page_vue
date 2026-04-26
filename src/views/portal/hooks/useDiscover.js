import { ref, computed } from 'vue'
import { fetchCloudTools, toggleToolFavorite } from '@/api/modules/tools'
import { useUiStore } from '@/store/ui'

/**
 * @description 发现页（工具库）业务逻辑 - 极端物理容错版
 */
export function useDiscover() {
  const uiStore = useUiStore()
  const activeCategory = ref('All')
  const navCategories = ref(['All', 'Favorites'])
  const showConfigModal = ref(false)
  const allTools = ref([])
  const loading = ref(false)

  // 1. 配置池 (固化预设，防止后端 404 导致 UI 闪烁)
  const allPool = ref([
    { id: 1, name: 'General' }, { id: 2, name: 'Embedded' },
    { id: 3, name: 'Python' }, { id: 4, name: 'Hardware' },
    { id: 5, name: 'Web API' }, { id: 6, name: 'Tools' },
    { id: 7, name: 'AI ML' }, { id: 8, name: 'Robotics' },
    { id: 9, name: 'Test' }, { id: 10, name: 'Storage' }
  ])
  
  const tempNav = ref([])

  /**
   * @description 从云端同步数据 (极速 5s 超时)
   */
  const syncCloudData = async () => {
    // 优先读取本地缓存
    const cache = localStorage.getItem('heflos_tools_cache')
    if (cache) allTools.value = JSON.parse(cache)

    try {
      // 物理级静默同步，仅针对已部署的 list 接口
      const tools = await fetchCloudTools({ 
        timeout: 5000, 
        hideLoading: true 
      })
      
      if (tools) {
        const mappedData = tools.map(t => ({
          id: t.path, name: t.label || t.name, description: t.description,
          iconPath: t.icon_path, iconUrl: t.icon_url, tag: t.tag,
          version: t.version, isCore: t.is_core === 1,
          favStatus: t.fav_status, author: t.author, url: t.url
        }))
        allTools.value = mappedData
        localStorage.setItem('heflos_tools_cache', JSON.stringify(mappedData))
      }
    } catch (err) {
      console.warn('Background sync timed out, running on cache.')
    } finally {
      loading.value = false
    }
  }

  const init = () => {
    syncCloudData()
    const saved = localStorage.getItem('heflos_discover_nav')
    if (saved) navCategories.value = JSON.parse(saved)
    tempNav.value = [...navCategories.value]
  }

  const filteredTools = computed(() => {
    return allTools.value.filter(tool => {
      if (activeCategory.value === 'All') return true
      if (activeCategory.value === 'Favorites') return tool.favStatus
      return tool.tag === activeCategory.value
    })
  })

  const setCategory = (cat) => { activeCategory.value = cat }
  const toggleTempNav = (name) => {
    if (tempNav.value.includes(name)) {
      tempNav.value = tempNav.value.filter(n => n !== name)
    } else {
      tempNav.value.push(name)
    }
  }

  const applyNav = () => {
    navCategories.value = [...tempNav.value]
    localStorage.setItem('heflos_discover_nav', JSON.stringify(navCategories.value))
    showConfigModal.value = false
  }

  return {
    activeCategory, navCategories, showConfigModal, allPool, tempNav,
    filteredTools, loading, init, setCategory, toggleTempNav, applyNav
  }
}
