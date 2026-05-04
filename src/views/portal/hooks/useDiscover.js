import { ref, computed, watch, onMounted } from 'vue'
import { fetchCloudTools } from '@/api/modules/tools'
import { fetchCategories } from '@/api/modules/categories'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'

/**
 * @description 发现页（工具库）业务逻辑
 */
export function useDiscover() {
  const uiStore = useUiStore()
  const userStore = useUserStore()
  const activeCategory = ref('All')
  const navCategories = ref(['All', 'Favorites'])
  const showConfigModal = ref(false)
  const allTools = ref([])
  const loading = ref(false)
  const allPool = ref([])
  const tempNav = ref([])

  // 1. 核心映射逻辑 (抽离以复用)
  const mapTools = (tools) => {
    return tools.map(t => {
      const toolId = String(t.id || t.path)
      const favStatus = t.favStatus !== undefined ? t.favStatus : t.fav_status
      const isCore = t.isCore !== undefined ? t.isCore : (t.is_core === 1)

      let finalIconUrl = t.iconUrl || t.icon_url
      let finalIconPath = t.iconPath || t.icon_path

      if (finalIconPath && (finalIconPath.startsWith('M') || finalIconPath.startsWith('m'))) {
        // SVG 指令
      } else if (finalIconPath && finalIconPath.includes('/')) {
        if (!finalIconUrl) {
          finalIconUrl = finalIconPath.startsWith('/') ? finalIconPath : `/${finalIconPath}`
        }
        finalIconPath = null
      }

      if (finalIconUrl && !finalIconUrl.startsWith('/') && !finalIconUrl.startsWith('http')) {
        // 核心修复：如果是 system/tool_icons/ 路径，转换成后端 icon API 路径
        if (finalIconUrl.includes('system/tool_icons/')) {
          const filename = finalIconUrl.split('/').pop();
          finalIconUrl = `/api/tools/icon/${filename}`;
        } else {
          finalIconUrl = `/api/${finalIconUrl}`;
        }
      }


      return {
        id: toolId, 
        name: t.name || t.label, 
        description: t.description,
        iconPath: finalIconPath, 
        iconUrl: finalIconUrl, 
        tag: t.tag,
        version: t.version, 
        isCore: isCore,
        favStatus: favStatus, 
        author: t.author, 
        url: t.url
      }
    })
  }

  /**
   * @description 物理同步：从 Bootstrap 数据中注入
   */
  const syncFromBootstrap = () => {
    const { tools, categories, initialNav } = userStore.bootstrapData
    
    if (tools && tools.length > 0) {
      allTools.value = mapTools(tools)
    }
    if (categories && categories.length > 0) {
      allPool.value = categories
    }
    if (initialNav && initialNav.length > 0) {
      navCategories.value = initialNav
      tempNav.value = [...initialNav]
    }
  }

  const syncCloudData = async () => {
    // 如果已经有 bootstrap 数据，则跳过初始同步
    if (allTools.value.length > 0) return

    loading.value = true
    try {
      const tools = await fetchCloudTools({ timeout: 15000, hideLoading: true })
      if (tools) {
        allTools.value = mapTools(tools)
      }
    } catch (err) {
      console.warn('Sync failed, using cache.')
    } finally {
      loading.value = false
    }
  }

  const init = async () => {
    syncFromBootstrap() // 优先从全局 Bootstrap 获取数据
    
    // 物理补丁：如果全局没拿到数据（比如 404），则手动触发独立同步
    if (!userStore.bootstrapData.tools || userStore.bootstrapData.tools.length === 0) {
      console.info('[useDiscover] Bootstrap empty, falling back to independent sync.')
      await syncCloudData()
    }
    
    const saved = localStorage.getItem('heflos_discover_nav')
    if (saved) {
      navCategories.value = JSON.parse(saved)
      tempNav.value = [...navCategories.value]
    }
  }

  // 监听全局启动数据，实现即时同步
  watch(() => userStore.bootstrapData.tools, () => {
    syncFromBootstrap()
  }, { deep: true })

  const filteredTools = computed(() => {
    return allTools.value.filter(tool => {
      if (activeCategory.value === 'All') return true
      if (activeCategory.value === 'Favorites') return userStore.isFavorited('tool', tool.id)
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
