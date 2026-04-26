import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import { updateProfile } from '@/api/modules/user'
import request from '@/api/request'

/**
 * @description 用户设置页面业务逻辑
 */
export function useUserSettings() {
  const userStore = useUserStore()
  const uiStore = useUiStore()
  const { currentUser } = storeToRefs(userStore)

  // 局部状态
  const activeNav = ref('general')
  const loading = ref(false)
  
  // 表单克隆副本，避免直接修改 Store 导致界面闪烁
  const form = reactive({
    username: currentUser.value.username,
    bio: currentUser.value.bio,
    location: currentUser.value.location,
    website: currentUser.value.website,
    publicProfile: true
  })

  /**
   * @description 处理保存协议
   */
  const handleSave = async () => {
    loading.value = true
    try {
      // 屏蔽全局 Loading，使用按钮自带的局部 Loading 效果
      await updateProfile(form, { hideLoading: true })
      await userStore.fetchProfile() 
      uiStore.addNotice({ title: 'SUCCESS', message: 'Registry protocol updated.', type: 'success' })
    } catch (err) {
      console.error('Update Failed:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 头像上传
   */
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      uiStore.addNotice({ title: 'LIMIT_EXCEEDED', message: 'MAX_LOAD: 1MB.', type: 'error' })
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    // 头像上传也改为静默模式
    try {
      await request.post('/v1/user/avatar', formData, { hideLoading: true })
      await userStore.fetchProfile()
      uiStore.addNotice({ title: 'SUCCESS', message: 'Avatar synchronized.', type: 'success' })
    } finally {
      // 局部加载状态由调用方控制，或此处无需额外 Loading
    }
  }

  return {
    activeNav,
    form,
    loading,
    currentUser,
    handleSave,
    handleAvatarUpload
  }
}
