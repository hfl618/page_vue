import axios from 'axios'
import { useUiStore } from '@/store/ui'

const service = axios.create({
  baseURL: '/api',
  timeout: 60000, // 强制锁定 60s 超时
  withCredentials: true
})

service.interceptors.request.use(
  config => {
    const uiStore = useUiStore()
    if (!config.hideLoading) {
      uiStore.showLoading('TRANSMITTING', 'Synchronizing with core...')
    }
    const token = localStorage.getItem('heflos_token')
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

    if (res.code !== 0 && res.code !== undefined) {
      uiStore.addNotice({
        title: 'PROTOCOL_ERROR',
        message: res.msg || 'Unknown failure.',
        type: 'error'
      })
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
    uiStore.hideLoading()

    let message = 'Connection Interrupted.'
    if (error.code === 'ECONNABORTED') message = 'Protocol timeout. System busy.'
    if (error.response) {
      switch (error.response.status) {
        case 401: message = 'Authentication required.'; break
        case 403: message = 'Access protocol denied.'; break
        case 500: message = 'System core failure.'; break
      }
    }

    uiStore.addNotice({
      title: 'NETWORK_FAILURE',
      message: message,
      type: 'error',
      tag: 'network-err'
    })

    return Promise.reject(error)
  }
)

export default service
