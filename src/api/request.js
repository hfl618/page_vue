import axios from 'axios'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'
import { STORAGE_KEYS, RESPONSE_CODES } from '@/constants'
import { storage } from '@/utils/storage'
import router from '@/router'

const service = axios.create({
  baseURL: '/api',
  timeout: 60000, 
  // withCredentials: true // 物理降噪：在纯 Token 模式下暂时关闭，防止 Cookie 干扰
})

service.interceptors.request.use(
  config => {
    const uiStore = useUiStore()
    if (!config.hideLoading) {
      uiStore.showLoading('TRANSMITTING', 'Synchronizing with core...')
    }
    const token = storage.get(STORAGE_KEYS.TOKEN)
    if (token) {
      // 暴力兼容方案：发送多种常见 Header，直到后端识别为止
      const bearerToken = `Bearer ${token}`
      config.headers['Authorization'] = bearerToken
      config.headers['Token'] = token
      config.headers['X-Token'] = token
      
      console.debug(`[Request] ${config.method?.toUpperCase()} ${config.url}`, {
        hasToken: true,
        authHeader: bearerToken.substring(0, 20) + '...'
      })
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

    // 物理加固：如果响应是二进制流 (Blob/ArrayBuffer)，直接返回，不解析 JSON 结构
    if (res instanceof Blob || res instanceof ArrayBuffer) {
      return res
    }

    if (res.code !== RESPONSE_CODES.SUCCESS && res.code !== undefined) {
      // 物理加固：如果是后台静默请求，不弹出报错弹窗
      if (!config.hideLoading) {
        uiStore.addNotice({
          title: 'PROTOCOL_ERROR',
          message: `[Code: ${res.code}] ${res.msg || 'Unknown failure.'}`,
          type: 'error',
          tag: 'protocol-err'
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
        case 423: 
          message = `[DEACTIVATED] This module is currently suspended by system core. Please check API Registry.`; 
          break
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
