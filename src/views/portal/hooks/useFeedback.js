import { ref } from 'vue'
import { useUiStore } from '@/store/ui'

/**
 * @description 系统反馈页业务逻辑
 */
export function useFeedback() {
  const uiStore = useUiStore()
  const feedbackText = ref('')
  const loading = ref(false)

  /**
   * @description 提交反馈协议
   */
  const submitFeedback = async () => {
    if (!feedbackText.value) return
    
    loading.value = true
    try {
      // 模拟传输延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      uiStore.addNotice({
        title: 'PROTOCOL_RECEIVED',
        message: 'Feedback transmitted to system core.',
        type: 'success'
      })
      feedbackText.value = ''
    } finally {
      loading.value = false
    }
  }

  return {
    feedbackText,
    loading,
    submitFeedback
  }
}
