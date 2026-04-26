import { defineStore } from 'pinia'
import { fetchMe } from '@/api/modules/user'

/**
 * 用户全局状态管理
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: {
      id: null,
      username: '',
      role: 'USER',
      avatar: '',
      bio: '',
      stats: {
        stars: 0,
        articles: 0,
        tools: 0
      }
    },
    isLoggedIn: false
  }),
  actions: {
    async fetchProfile() {
      try {
        const data = await fetchMe()
        this.currentUser = data
        this.isLoggedIn = true
        return data
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
        this.isLoggedIn = false
        throw err
      }
    },
    setToken(token) {
      localStorage.setItem('heflos_token', token)
      this.isLoggedIn = true
    },
    logout() {
      localStorage.removeItem('heflos_token')
      this.currentUser = { id: null, username: '', stats: {} }
      this.isLoggedIn = false
    }
  }
})
