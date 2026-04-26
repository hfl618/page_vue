/**
 * @description 用户个人资料页业务逻辑
 */

export function useUserProfile() {
  const userStore = useUserStore()
  const profile = ref(null)
  const loading = ref(true)
  const error = ref(null)

  /**
   * @description 加载用户档案
   */
  const loadProfile = async () => {
    loading.value = true
    error.value = null
    try {
      // 优先从后端获取完整档案
      const data = await fetchMe()
      profile.value = data
    } catch (err) {
      console.error('Profile Sync Failure:', err)
      error.value = 'Failed to establish connection with User Registry.'
      // 降级使用 Store 中的基础信息
      profile.value = userStore.currentUser
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    loadProfile
  }
}
