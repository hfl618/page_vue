import axios from 'axios'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'
import { STORAGE_KEYS, RESPONSE_CODES } from '@/constants'
import { storage } from '@/utils/storage'
import router from '@/router'

const service = axios.create({
  baseURL: '/api',
  timeout: 60000, // 强制改为 60s
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    const uiStore = useUiStore()
    if (!config.hideLoading) {
      uiStore.showLoading('TRANSMITTING', 'Synchronizing with core...')
    }
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    const uiStore = useUiStore()
    uiStore.hideLoading()

    const res = response.data
    const config = response.config

    if (res.code !== RESPONSE_CODES.SUCCESS && res.code !== undefined) {
      // 物理加固：如果是后台静默请求，不弹出报错弹窗
      if (!config.hideLoading) {
        uiStore.addNotice({
          title: 'PROTOCOL_ERROR',
          message: `[Code: ${res.code}] ${res.msg || 'Unknown failure.'}`,
          type: 'error'
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }

    if (config.successMsg) {
      uiStore.addNotice({
        title: 'OPERATION_SUCCESS',
        message: config.successMsg,
        type: 'success'
      })
    }

    return res.data
  },
  error => {
    const uiStore = useUiStore()
    const userStore = useUserStore()
    uiStore.hideLoading()

    let message = 'Connection failed.'
    const status = error.response ? error.response.status : null

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      message = 'NETWORK_TIMEOUT: System core is not responding.'
    } else if (status) {
      switch (status) {
        case RESPONSE_CODES.UNAUTHORIZED: 
          message = `[${status}] Session expired. Please login again.`
          // 401 处理：清除状态并跳转
          userStore.logout()
          if (router.currentRoute.value.name !== 'login') {
            router.push({ 
              name: 'login', 
              query: { redirect: router.currentRoute.value.fullPath } 
            })
          }
          break
        case RESPONSE_CODES.FORBIDDEN: message = `[${status}] Access protocol denied.`; break
        case RESPONSE_CODES.NOT_FOUND: message = `[${status}] Registry path not found.`; break
        case RESPONSE_CODES.SERVER_ERROR: message = `[${status}] System core failure.`; break
        default: message = `PROTOCOL_ERR_${status}`; break
      }
    }

    // 避免在 401 时弹出重复的报错，如果已经在登录页则不重复提示
    if (status !== RESPONSE_CODES.UNAUTHORIZED || router.currentRoute.value.name !== 'login') {
      uiStore.addNotice({
        title: 'NETWORK_FAILURE',
        message: message,
        type: 'error',
        tag: 'network-err'
      })
    }

    return Promise.reject(error)
  }
)

export default service
