import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { fetchMe, fetchUserFavorites } from '@/api/modules/user'
import { fetchAppInitData } from '@/api/modules/app'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(storage.get(STORAGE_KEYS.USER_INFO) || { id: null, username: '' })
  const isLoggedIn = ref(!!storage.get(STORAGE_KEYS.TOKEN))
  const isAppReady = ref(false)

  const favorites = reactive({
    article: new Set(),
    tool: new Set()
  })

  // 这里的 allTools 和 allCategories 建议放在专门的 store，但为了快速实现聚合，暂时存放在此或由组件消费
  const bootstrapData = reactive({
    tools: [],
    categories: [],
    initialNav: [],
    notes: [] // 新增：预加载的个人笔记
  })

  /**
   * @description 终极优化：聚合初始化
   */
  const initializeApp = async () => {
    if (!isLoggedIn.value) {
      isAppReady.value = true
      return
    }

    try {
      const data = await fetchAppInitData()
      
      // 1. 同步用户信息
      if (data.user) {
        currentUser.value = data.user
        storage.set(STORAGE_KEYS.USER_INFO, data.user)
      }

      // 2. 同步收藏状态 (适配对象数组结构)
      if (data.favorites) {
        favorites.article.clear()
        data.favorites.articles?.forEach(item => {
          const id = typeof item === 'object' ? item.id : item
          favorites.article.add(String(id))
        })
        
        favorites.tool.clear()
        data.favorites.tools?.forEach(item => {
          const id = typeof item === 'object' ? item.id : item
          favorites.tool.add(String(id))
        })
      }

      // 3. 注入其它启动数据
      bootstrapData.tools = data.tools || []
      bootstrapData.categories = data.categories || []
      bootstrapData.initialNav = data.initial_nav || []
      bootstrapData.notes = data.notes || [] // 注入笔记

      // 4. 关键：同步到 KnowledgeStore (如果已经实例化)
      const { useKnowledgeStore } = await import('@/store/knowledge')
      const knowledgeStore = useKnowledgeStore()
      knowledgeStore.hydrate(data.notes)

      isAppReady.value = true
      return data

    } catch (err) {
      console.error('[AppInit] Global Protocol Sync Failed.', err)
      isAppReady.value = true // 即使失败也标记 ready，避免阻塞 UI
    }
  }

  const isFavorited = (type, id) => {
    return favorites[type]?.has(String(id))
  }

  /**
   * @description 切换收藏状态 (对标统一交互接口 /v1/interact/toggle)
   * @param {string} type 'article' | 'tool'
   * @param {string|number} id 目标标识
   * @param {string} label 可选：用于通知显示的标题或名称
   */
  const toggleFavorite = async (type, id, label = '') => {
    const uiStore = useUiStore()
    if (!isLoggedIn.value) {
      uiStore.addNotice({
        title: 'AUTH_REQUIRED',
        message: 'Please login to use Star Protocol.',
        type: 'warning'
      })
      return
    }
    
    const targetId = String(id)
    const displayName = label || targetId
    const isAdding = !favorites[type].has(targetId)

    // A. 乐观更新
    if (isAdding) favorites[type].add(targetId)
    else favorites[type].delete(targetId)

    try {
      // B. 调用统一交互接口
      const res = await request.post('/v1/interact/toggle', { 
        target_id: targetId, 
        target_type: type 
      }, { hideLoading: true })
      
      // C. 根据后端 is_active 状态校准
      const finalActive = res.data?.is_active
      const totalStars = res.data?.total_stars // 后端通常会返回更新后的总数
      
      if (finalActive !== undefined) {
        if (finalActive) favorites[type].add(targetId)
        else favorites[type].delete(targetId)
      }

      // D. 物理同步：如果是文章，同步更新 KnowledgeStore 中的计数
      if (type === 'article') {
        const { useKnowledgeStore } = await import('@/store/knowledge')
        const knowledgeStore = useKnowledgeStore()
        const target = knowledgeStore.articles.find(a => String(a.id) === targetId)
        if (target) {
          // 如果后端返回了总数，使用后端的；否则前端手动增减
          if (totalStars !== undefined) {
            target.stars = totalStars
          } else {
            target.stars = Math.max(0, (target.stars || 0) + (finalActive ? 1 : -1))
          }
        }
      }

      // E. 成功反馈
      uiStore.addNotice({
        title: isAdding ? 'STAR_LINKED' : 'STAR_DECOUPLED',
        message: isAdding ? `[${displayName}] synced to your archive.` : `[${displayName}] removed from archive.`,
        type: 'success',
        tag: 'interaction'
      })
      
    } catch (err) {
      // D. 失败回滚
      if (isAdding) favorites[type].delete(targetId)
      else favorites[type].add(targetId)
      console.error(`[Interaction Failure] ${type}:${targetId}`, err)
    }
  }

  /**
   * @description 同步用户信息
   */
  const fetchProfile = async () => {
    try {
      const data = await fetchMe({ hideLoading: true })
      currentUser.value = data
      isLoggedIn.value = true
      storage.set(STORAGE_KEYS.USER_INFO, data)
      return data
    } catch (err) {
      if (!storage.get(STORAGE_KEYS.TOKEN)) {
        isLoggedIn.value = false
      }
      throw err
    }
  }

  const setToken = (token) => {
    storage.set(STORAGE_KEYS.TOKEN, token)
    isLoggedIn.value = true
  }

  const logout = () => {
    storage.remove(STORAGE_KEYS.TOKEN)
    currentUser.value = { id: null, username: '' }
    isLoggedIn.value = false
    favorites.article.clear()
    favorites.tool.clear()
  }

  return {
    currentUser,
    isLoggedIn,
    isAppReady,
    favorites,
    bootstrapData,
    isFavorited,
    toggleFavorite,
    fetchProfile,
    initializeApp,
    setToken,
    logout
  }
})
