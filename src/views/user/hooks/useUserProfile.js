import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useKnowledgeStore } from '@/store/knowledge'
import { fetchMe, fetchUserFavorites } from '@/api/modules/user'
import { fetchUserArticles } from '@/api/modules/knowledge'
import { fetchCloudTools } from '@/api/modules/tools'

/**
 * @description 用户个人资料页业务逻辑 - 工业级数据聚合版
 */
export function useUserProfile() {
  const userStore = useUserStore()
  const knowledgeStore = useKnowledgeStore()
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)

  // Tab 状态
  const activeTab = ref('tools')
  const activeStarTab = ref('articles')
  const currentStack = ref(null)

  // 数据池 (用于交叉引用)
  const userArticles = ref([])
  const allToolsPool = ref([])

  // 辅助：工具属性映射 (对齐工业级标准)
  const mapTools = (tools) => {
    return tools.map(t => {
      const toolId = String(t.id || t.path)
      const favStatus = t.favStatus !== undefined ? t.favStatus : t.fav_status
      const isCore = t.isCore !== undefined ? t.isCore : (t.is_core === 1)

      let finalIconUrl = t.iconUrl || t.icon_url
      let finalIconPath = t.iconPath || t.icon_path

      if (finalIconPath && (finalIconPath.startsWith('M') || finalIconPath.startsWith('m'))) {
        // SVG 指令保持原样
      } else if (finalIconPath && finalIconPath.includes('/')) {
        if (!finalIconUrl) finalIconUrl = finalIconPath.startsWith('/') ? finalIconPath : `/${finalIconPath}`
        finalIconPath = null
      }

      if (finalIconUrl && !finalIconUrl.startsWith('/') && !finalIconUrl.startsWith('http')) {
        finalIconUrl = `/api/${finalIconUrl}`
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
   * @description 加载所有必要数据
   */
  const loadProfileData = async () => {
    loading.value = true
    error.value = null
    try {
      const [profileData, articles, toolsData] = await Promise.all([
        fetchMe().catch(() => userStore.currentUser),
        fetchUserArticles().catch(() => []),
        fetchCloudTools().catch(() => [])
      ])
      
      profile.value = profileData
      userArticles.value = articles || []
      // 关键修正：必须映射工具属性，否则 ToolCard 无法识别后端原始字段
      allToolsPool.value = mapTools(toolsData || [])
      
    } catch (err) {
      console.error('[Profile] Protocol Sync Failure:', err)
      error.value = 'Failed to establish connection with User Registry.'
      profile.value = userStore.currentUser
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 响应式收藏列表：直接追踪全局 UserStore.favorites
   * 解决即时刷新问题：当用户在其它地方点击收藏，这里会实时变化
   */
  const starredArticles = computed(() => {
    return Array.from(userStore.favorites.article).map(id => {
      // 优先从已拉取的个人文章或知识库 Store 中找
      const found = userArticles.value.find(a => String(a.id) === String(id)) 
                 || knowledgeStore.articles.find(a => String(a.id) === String(id))
      return found || { id, title: `Archive_${id}`, loading: true }
    })
  })

  const starredTools = computed(() => {
    return Array.from(userStore.favorites.tool).map(id => {
      // 这里的 ID 匹配需要极其健壮 (兼容 id 和 path)
      const found = allToolsPool.value.find(t => String(t.id) === String(id) || String(t.path) === String(id))
      return found || { id, name: `Module_${id}`, loading: true }
    })
  })

  /**
   * @description 过滤该用户发布的工具
   */
  const userTools = computed(() => {
    if (!profile.value) return []
    return allToolsPool.value.filter(t => 
      String(t.author).toLowerCase() === String(profile.value.username).toLowerCase()
    )
  })

  /**
   * @description 过滤后的文章列表 (处理 Stack 逻辑)
   */
  const filteredArticles = computed(() => {
    if (currentStack.value) {
      return userArticles.value.filter(a => String(a.parent_id) === String(currentStack.value.id))
    }
    return userArticles.value.filter(a => !a.parent_id || a.parent_id === 'null' || a.parent_id === '')
  })

  return {
    profile,
    loading,
    error,
    activeTab,
    activeStarTab,
    currentStack,
    userArticles,
    userTools,
    starredArticles,
    starredTools,
    filteredArticles,
    loadProfile: loadProfileData
  }
}
