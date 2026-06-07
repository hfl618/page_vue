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

  const requestCount = ref(0)
  let _timer = null
  let _safetyTimer = null
  let _debounceTimer = null

  const showLoading = (title = 'LOADING', subtitle = 'ACCESSING ARCHIVE', debounce = 300) => {
    requestCount.value++
    
    // 如果已经显示，直接更新标题（不重置进度以防抖动）
    if (loading.show) {
      loading.title = title
      loading.subtitle = subtitle
      return
    }

    // 防闪烁延迟
    if (_debounceTimer) clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      if (requestCount.value > 0) {
        performShow(title, subtitle)
      }
    }, debounce)
  }

  const performShow = (title, subtitle) => {
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

    // 15s 强制保底关闭，防止协议挂起 (对于大文件上传可能需要更久)
    _safetyTimer = setTimeout(() => {
      if (loading.show) forceHideLoading()
    }, 15000)
  }

  const hideLoading = () => {
    requestCount.value = Math.max(0, requestCount.value - 1)
    if (requestCount.value === 0) {
      if (_debounceTimer) clearTimeout(_debounceTimer)
      performHide()
    }
  }

  const forceHideLoading = () => {
    requestCount.value = 0
    if (_debounceTimer) clearTimeout(_debounceTimer)
    performHide()
  }

  const performHide = () => {
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

  // --- 全局设置 ---
  const settings = reactive({
    currencySymbol: '￥'
  })

  const setCurrencySymbol = (symbol) => {
    settings.currencySymbol = symbol
  }

  // --- 系统完整性状态 ---
  const integrityError = ref(null)

  const reportIntegrityViolation = (error) => {
    console.error('[INTEGRITY_VIOLATION]', error)
    integrityError.value = {
      message: error?.message || 'Unknown protocol violation.',
      stack: error?.stack || '',
      timestamp: new Date().toISOString()
    }
  }

  const resetIntegrity = () => {
    integrityError.value = null
    window.location.reload()
  }

  return {
    loading,
    notices,
    settings,
    integrityError,
    showLoading,
    hideLoading,
    forceHideLoading,
    addNotice,
    removeNotice,
    setCurrencySymbol,
    reportIntegrityViolation,
    resetIntegrity
  }
})
