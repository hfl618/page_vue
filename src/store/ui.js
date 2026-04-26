import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { NOTICE_TYPES } from '@/constants'

/**
 * @module UiStore
 * @description 全局 UI 交互状态管理 (Loading, Notice)
 */
export const useUiStore = defineStore('ui', () => {
  // --- Loading 状态 ---
  const loading = reactive({
    show: false,
    title: 'LOADING',
    subtitle: 'ACCESSING ARCHIVE',
    percent: 0
  })

  let _timer = null
  let _safetyTimer = null

  const showLoading = (title = 'LOADING', subtitle = 'ACCESSING ARCHIVE') => {
    loading.show = true
    loading.title = title
    loading.subtitle = subtitle
    loading.percent = 5
    
    if (_timer) clearInterval(_timer)
    if (_safetyTimer) clearTimeout(_safetyTimer)
    
    _timer = setInterval(() => {
      if (loading.percent < 95) {
        const step = (96 - loading.percent) * 0.05
        loading.percent += step
      }
    }, 100)

    // 8s 强制保底关闭，防止协议挂起
    _safetyTimer = setTimeout(() => {
      if (loading.show) hideLoading()
    }, 8000)
  }

  const hideLoading = () => {
    if (_timer) clearInterval(_timer)
    if (_safetyTimer) clearTimeout(_safetyTimer)
    
    loading.percent = 100
    setTimeout(() => {
      loading.show = false
      setTimeout(() => { loading.percent = 0 }, 300)
    }, 300)
  }

  // --- 通知系统 ---
  const notices = ref([])

  const addNotice = ({ title, message, type = NOTICE_TYPES.INFO, duration = 3000, tag = null }) => {
    if (tag) {
      notices.value = notices.value.filter(n => n.tag !== tag)
    }
    const id = Date.now()
    notices.value.push({ id, title, message, type, tag, visible: true })
    
    if (duration > 0) {
      setTimeout(() => removeNotice(id), duration)
    }
  }

  const removeNotice = (id) => {
    const idx = notices.value.findIndex(n => n.id === id)
    if (idx !== -1) {
      notices.value[idx].visible = false
      setTimeout(() => {
        notices.value = notices.value.filter(n => n.id !== id)
      }, 300)
    }
  }

  return {
    loading,
    notices,
    showLoading,
    hideLoading,
    addNotice,
    removeNotice
  }
})
