/**
 * @description 身份认证业务逻辑抽离 (登录/注册)
 */

export function useAuth() {
  const router = useRouter()
  const uiStore = useUiStore()
  const userStore = useUserStore()

  // 表单状态
  const form = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  const loading = ref(false)
  const isPasswordVisible = ref(false)
  
  // 用户名校验状态
  const userStatus = reactive({ 
    loading: false, 
    error: '', 
    success: false 
  })

  let debounceTimer = null

  // 监听用户名变化进行校验
  watch(() => form.username, (val) => {
    userStatus.success = false
    if (!val) { userStatus.error = ''; return }
    if (val.length <= 4) { userStatus.error = 'Must be > 4 characters'; return }
    if (/^\d+$/.test(val)) { userStatus.error = 'Cannot be purely numeric'; return }
    
    userStatus.error = ''
    
    clearTimeout(debounceTimer)
    userStatus.loading = true
    
    debounceTimer = setTimeout(async () => {
      try {
        const res = await checkUsername(val)
        if (res.is_taken) {
          userStatus.error = 'Username already active in registry'
        } else {
          userStatus.success = true
        }
      } catch (err) {
        console.error('Check failed', err)
      } finally {
        userStatus.loading = false
      }
    }, 500)
  })

  const togglePassword = () => { isPasswordVisible.value = !isPasswordVisible.value }

  /**
   * @description 处理登录逻辑
   */
  const handleLogin = async () => {
    if (!form.username || !form.password) {
      uiStore.addNotice({ title: 'VALIDATION_ERROR', message: 'Credentials incomplete.', type: 'warning' })
      return
    }

    loading.value = true
    try {
      const data = await login(form.username, form.password)
      // 存储用户信息并跳转
      userStore.setToken(data.token)
      await userStore.fetchProfile()
      router.push('/')
    } catch (err) {
      // 错误已由 request.js 拦截处理，此处可进行额外 UI 处理
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 处理注册逻辑
   */
  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      uiStore.addNotice({ title: 'SECURITY_MISMATCH', message: 'Passwords do not align.', type: 'error' })
      return
    }

    loading.value = true
    try {
      await signup(form.username, form.password, form.firstName, form.lastName)
      uiStore.addNotice({ title: 'REGISTRY_SUCCESS', message: 'Identity created. Please log in.', type: 'success' })
      router.push('/login')
    } catch (err) {
      // 错误已处理
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    handleLogin,
    handleSignup
  }
}
