import { ref, reactive, computed, watch } from 'vue'
import request from '@/api/request'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'
import { NOTICE_TYPES } from '@/constants'

/**
 * @description API 管理器核心逻辑 Hook (权控增强版 + 上帝视角)
 */
export function useApiManager() {
  const uiStore = useUiStore()
  const userStore = useUserStore()
  const apis = ref([])
  const loading = ref(false)
  const searchQuery = ref('')
  
  const filters = reactive({
    method: '',
    module: '',
    security: ''
  })
  
  const selectedApi = ref(null)
  const testResult = ref(null)
  const isTesting = ref(false)
  
  const testInputs = reactive({
    params: {},   
    payload: {},  
    body: ''      
  })

  // 权限感知 (物理加固：兼容中英文角色名)
  const isAdmin = computed(() => {
    const role = String(userStore.currentUser?.role || '').toLowerCase().trim()
    return ['admin', '管理员', 'administrator', 'root'].includes(role)
  })

  watch(() => testInputs.payload, (newVal) => {
    try {
      testInputs.body = JSON.stringify(newVal, null, 2)
    } catch (e) {
      console.warn('[Terminal] Payload Serialization Error')
    }
  }, { deep: true })

  const safeMetadata = computed(() => {
    if (!selectedApi.value) return {}
    let raw = selectedApi.value.metadata
    if (!raw) return { params: [], inferred: true }

    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      const finalMeta = parsed.data || parsed

      if (!finalMeta.params || finalMeta.params.length === 0) {
        const inferredParams = []
        const matches = selectedApi.value.path.match(/<([^>]+)>/g) || []
        matches.forEach(m => {
          inferredParams.push({
            name: m.replace(/[<>]/g, '').replace('int:', ''),
            type: m.includes('int:') ? 'int' : 'any',
            required: true,
            desc: 'INFERRED_FROM_ENDPOINT_URI'
          })
        })
        finalMeta.params = inferredParams
        finalMeta.inferred = true
      }
      return finalMeta
    } catch (e) {
      console.error('[Registry] Manifest Compromised:', e)
      return { params: [], error: true }
    }
  })

  const fetchApis = async () => {
    loading.value = true
    try {
      const data = await request.get('/v1/docs/list', { hideLoading: true })
      apis.value = data || []
    } finally {
      loading.value = false
    }
  }

  const filteredApis = computed(() => {
    return apis.value.filter(api => {
      const q = searchQuery.value.toLowerCase()
      const matchesSearch = !q || api.path.toLowerCase().includes(q) || api.title.toLowerCase().includes(q)
      const matchesMethod = !filters.method || (Array.isArray(api.methods) ? api.methods.includes(filters.method) : api.method === filters.method)
      const matchesModule = !filters.module || api.module === filters.module
      const matchesSecurity = !filters.security || api.security === filters.security
      return matchesSearch && matchesMethod && matchesModule && matchesSecurity
    })
  })

  const filterOptions = computed(() => {
    const methods = new Set()
    const modules = new Set()
    apis.value.forEach(api => {
      if (Array.isArray(api.methods)) api.methods.forEach(m => methods.add(m))
      else if (api.method) methods.add(api.method)
      if (api.module) modules.add(api.module)
    })
    return {
      methods: Array.from(methods).sort(),
      modules: Array.from(modules).sort()
    }
  })

  const toggleStatus = async (api) => {
    if (!api) return
    
    // 物理权控拦截
    if (!isAdmin.value) {
      uiStore.addNotice({
        title: 'PRIVILEGE_REQUIRED',
        message: 'Administrator status is mandatory for gate transition.',
        type: NOTICE_TYPES.ERROR
      })
      return
    }

    const nextStatus = !api.isActive
    if (!window.confirm(`[ADMIN_GATE_CONTROL]\nTransition node ${api.path} to ${nextStatus ? 'OPERATIONAL' : 'LOCKED'}?`)) return

    try {
      api.isActive = nextStatus
      await request.post('/v1/docs/toggle', { endpoint: api.endpoint, isActive: nextStatus })
      uiStore.addNotice({
        title: 'GATE_SYNCHRONIZED',
        message: `Node ${api.path} state physically updated.`,
        type: nextStatus ? NOTICE_TYPES.SUCCESS : NOTICE_TYPES.WARNING
      })
    } catch (err) {
      api.isActive = !nextStatus
    }
  }

  watch(selectedApi, (api) => {
    testResult.value = null
    if (!api) return
    
    const meta = safeMetadata.value
    
    const params = {}
    const pathMatches = api.path.match(/<([^>]+)>/g) || []
    pathMatches.forEach(m => {
      // 物理加固：提取冒号后的实际变量名 (如 int:id -> id)
      const key = m.replace(/[<>]/g, '').split(':').pop()
      params[key] = '1'
    })
    testInputs.params = params

    const payload = {}
    const activeSample = meta.body || meta.query
    if (activeSample && typeof activeSample === 'object') {
      Object.keys(activeSample).forEach(key => {
        payload[key] = activeSample[key]
      })
    }
    testInputs.payload = payload
    testInputs.body = JSON.stringify(payload, null, 2)
  }, { immediate: true })

  const runProtocolTest = async () => {
    if (!selectedApi.value) return
    isTesting.value = true
    testResult.value = null
    
    let finalPath = selectedApi.value.path
    Object.keys(testInputs.params).forEach(key => {
      // 物理合成：匹配 <可选前缀:key>
      const regex = new RegExp(`<([^:>]+:)?${key}>`, 'g')
      finalPath = finalPath.replace(regex, testInputs.params[key])
    })

    try {
      const res = await request.post('/v1/docs/test', {
        path: finalPath,
        method: (Array.isArray(selectedApi.value.methods) ? selectedApi.value.methods[0] : selectedApi.value.method),
        body: JSON.parse(testInputs.body)
      })
      testResult.value = res
    } catch (err) {
      testResult.value = { status: err.response?.status || '500', data: err.response?.data || err.message }
    } finally {
      isTesting.value = false
    }
  }

  const resolvedPath = computed(() => {
    if (!selectedApi.value) return ''
    let p = selectedApi.value.path
    Object.keys(testInputs.params).forEach(key => {
      const val = testInputs.params[key] || `<${key}>`
      p = p.replace(new RegExp(`<int:${key}>|<${key}>`, 'g'), val)
    })
    return p
  })

  return {
    apis, loading, searchQuery, filters, filterOptions, selectedApi, testResult, isTesting, isAdmin,
    testInputs, safeMetadata, resolvedPath, fetchApis, filteredApis, toggleStatus, runProtocolTest
  }
}
