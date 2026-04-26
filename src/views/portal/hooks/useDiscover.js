/**
 * @description 发现页（工具库）业务逻辑
 */

export function useDiscover() {
  const activeCategory = ref('All')
  const navCategories = ref(['All', 'Favorites'])
  const showConfigModal = ref(false)
  const allTools = ref([])
  const loading = ref(false)

  // 模拟数据（未来可改为 API 请求）
  const mockTools = [
    {
      name: 'Inventory System',
      description: 'Hardware and component stocks management.',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      tag: 'Utility',
      version: 'V1.2.0',
      isCore: true,
      favStatus: true,
      author: 'HEFLOS',
      url: '/tools/inventory'
    },
    {
      name: 'Cloud Drive',
      description: 'Centralized engineering assets storage.',
      iconPath: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      tag: 'Utility',
      version: 'V2.0.4',
      isCore: true,
      favStatus: false,
      author: 'SYSTEM',
      url: '/tools/drive'
    },
    {
      name: 'Serial Port',
      description: 'Real-time embedded debugging terminal.',
      iconPath: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      tag: 'Hardware',
      version: 'V0.9.1',
      isCore: false,
      favStatus: true,
      author: 'LAB_TECH',
      url: '/tools/serial'
    }
  ]

  const init = () => {
    // 加载数据
    allTools.value = mockTools
    
    // 加载持久化导航
    const saved = localStorage.getItem('heflos_discover_nav')
    if (saved) {
      navCategories.value = JSON.parse(saved)
    } else {
      navCategories.value = ['All', 'Favorites', 'Utility', 'Hardware']
    }
  }

  const filteredTools = computed(() => {
    return allTools.value.filter(tool => {
      if (activeCategory.value === 'All') return true
      if (activeCategory.value === 'Favorites') return tool.favStatus
      return tool.tag === activeCategory.value
    })
  })

  const setCategory = (cat) => {
    activeCategory.value = cat
  }

  return {
    activeCategory,
    navCategories,
    showConfigModal,
    filteredTools,
    loading,
    init,
    setCategory
  }
}
