import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMe } from '@/api/modules/user'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

/**
 * @module UserStore
 * @description 用户身份与全局权限状态
 */
export const useUserStore = defineStore('user', () => {
  // 从缓存中恢复用户信息
  const cachedUser = storage.get(STORAGE_KEYS.USER_INFO)
  const currentUser = ref(cachedUser || {
    id: null,
    username: '',
    avatar: '',
    bio: '',
    role: 'USER'
  })

  const isLoggedIn = ref(!!storage.get(STORAGE_KEYS.TOKEN))

  /**
   * @description 同步用户信息 (静默模式)
   */
  const fetchProfile = async () => {
    try {
      // 增加 hideLoading: true，彻底解决跳转时的卡顿感
      const data = await fetchMe({ hideLoading: true })
      currentUser.value = data
      isLoggedIn.value = true
      storage.set(STORAGE_KEYS.USER_INFO, data)
      return data
    } catch (err) {
      // 失败时不清除本地数据，保留离线状态显示
      if (!storage.get(STORAGE_KEYS.TOKEN)) {
        isLoggedIn.value = false
      }
      throw err
    }
  }

  /**
   * @description 登录状态设置
   */
  const setToken = (token) => {
    storage.set(STORAGE_KEYS.TOKEN, token)
    isLoggedIn.value = true
  }

  /**
   * @description 退出并清理
   */
  const logout = () => {
    storage.remove(STORAGE_KEYS.TOKEN)
    currentUser.value = { id: null, username: '' }
    isLoggedIn.value = false
  }

  return {
    currentUser,
    isLoggedIn,
    fetchProfile,
    setToken,
    logout
  }
})
