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
  const currentUser = ref({
    id: null,
    username: '',
    avatar: '',
    bio: '',
    role: 'USER'
  })

  const isLoggedIn = ref(!!storage.get(STORAGE_KEYS.TOKEN))

  /**
   * @description 同步用户信息
   */
  const fetchProfile = async () => {
    try {
      const data = await fetchMe()
      currentUser.value = data
      isLoggedIn.value = true
      return data
    } catch (err) {
      isLoggedIn.value = false
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
