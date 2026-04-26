/**
 * @description 本地存储实用工具
 */

import { STORAGE_KEYS } from '@/constants'

export const storage = {
  set(key, value) {
    const content = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, content)
  },

  get(key) {
    const value = localStorage.getItem(key)
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clear() {
    localStorage.clear()
  },

  // 快捷获取 Token
  getToken() {
    return this.get(STORAGE_KEYS.TOKEN)
  }
}
