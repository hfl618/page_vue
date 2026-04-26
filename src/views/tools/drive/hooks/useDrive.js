import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { driveApi } from '@/api/modules/drive'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'

/**
 * @description 云端硬盘核心业务逻辑 (1:1 物理对标工业级还原版)
 */
export function useDrive() {
  const uiStore = useUiStore()
  const userStore = useUserStore()
  const router = useRouter()

  // --- 状态定义 ---
  const currentPath = ref('/')
  const pathInput = ref('\\')
  const isEditingPath = ref(false)
  const pathInputField = ref(null)
  const suggestions = ref([])
  const showSuggestions = ref(false)
  const activeSuggestionIndex = ref(-1)
  const files = ref([])
  const selectedItems = ref([])
  const isLoading = ref(false)
  const isSyncing = ref(false) // 背景同步状态
  const searchQuery = ref('')
  const clipboard = ref({ type: null, keys: [] })

  // --- 计算属性 ---
  const filteredFiles = computed(() => {
    if (!searchQuery.value) return files.value
    const q = searchQuery.value.toLowerCase()
    return files.value.filter(f => f.name.toLowerCase().includes(q))
  })

  // --- 核心方法 ---

  const formatSize = (bytes) => {
    if (bytes === '--' || !bytes || isNaN(bytes)) return '--'
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const fetchFiles = async (path) => {
    // 物理优化：进入文件夹不再触发全局遮罩，而是后台静默刷新
    isSyncing.value = true
    try {
      selectedItems.value = []
      const data = await driveApi.getFiles(path, { hideLoading: true })
      
      currentPath.value = data.currentPath
      let displayPath = data.currentPath.replace(/\//g, '\\')
      pathInput.value = displayPath === '' ? '\\' : displayPath
      files.value = data.files
    } catch (e) {
      uiStore.addNotice({ title: 'DRIVE_SYNC_ERR', message: 'Neural link failed to fetch remote units.', type: 'error' })
    } finally {
      isSyncing.value = false
    }
  }

  /**
   * @description 强制切换选中 (用于复选框点击)
   */
  const toggleSelection = (file) => {
    const index = selectedItems.value.findIndex(i => i.name === file.name)
    if (index > -1) {
      selectedItems.value = selectedItems.value.filter(i => i.name !== file.name)
    } else {
      selectedItems.value = [...selectedItems.value, file]
    }
  }

  /**
   * @description 智能行级选择
   */
  const toggleSelect = (file, event) => {
    const isMultiAction = (event && (event.ctrlKey || event.metaKey))
    const index = selectedItems.value.findIndex(i => i.name === file.name)
    
    if (isMultiAction) {
      toggleSelection(file)
    } else {
      // 普通点击逻辑
      if (selectedItems.value.length === 1 && selectedItems.value[0].name === file.name) {
        selectedItems.value = []
      } else {
        selectedItems.value = [file]
      }
    }
  }

  const handleUpload = async (file) => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', currentPath.value)
    uiStore.showLoading('UPLOADING', 'Synchronizing asset...')
    try {
      await driveApi.uploadFile(formData)
      fetchFiles(currentPath.value)
    } finally { uiStore.hideLoading() }
  }

  const handleMkdir = async () => {
    const name = prompt("Folder name:")
    if (!name) return
    await driveApi.mkdir({ path: currentPath.value, name })
    fetchFiles(currentPath.value)
  }

  // --- 路径交互逻辑 (极致体感优化版) ---

  const onPathInput = async () => {
    activeSuggestionIndex.value = -1
    const rawInput = pathInput.value.trim()
    if (!rawInput) {
      suggestions.value = []
      showSuggestions.value = false
      return
    }

    // 物理优化 1：本地即时匹配 (零延迟)
    // 逻辑：如果输入不包含路径深度变化（即不含多余反斜杠），直接从当前内存过滤
    if (!rawInput.includes('\\') || rawInput === '\\') {
      const matchName = rawInput.replace(/\\/g, '').toLowerCase()
      suggestions.value = files.value
        .filter(f => f.type === 'folder' && f.name.toLowerCase().startsWith(matchName))
        .map(f => '\\' + f.name)
      
      showSuggestions.value = suggestions.value.length > 0
      return
    }

    // 物理优化 2：深层匹配 (后台异步同步)
    const lastSlashIndex = rawInput.lastIndexOf('\\')
    const parentDirRaw = rawInput.substring(0, lastSlashIndex)
    const partialName = rawInput.substring(lastSlashIndex + 1).toLowerCase()

    try {
      const targetPath = parentDirRaw.replace(/\\/g, '/') || '/'
      const data = await driveApi.getFiles(targetPath, { hideLoading: true })
      
      if (data && data.files) {
        suggestions.value = data.files
          .filter(f => f.type === 'folder' && f.name.toLowerCase().startsWith(partialName))
          .map(f => (parentDirRaw === '\\' ? '\\' : parentDirRaw + '\\') + f.name)
        showSuggestions.value = suggestions.value.length > 0
      }
    } catch (e) { 
      showSuggestions.value = false
    }
  }

  const moveSuggestion = (dir) => {
    if (!showSuggestions.value || suggestions.value.length === 0) return
    activeSuggestionIndex.value += dir
    if (activeSuggestionIndex.value < 0) activeSuggestionIndex.value = suggestions.value.length - 1
    if (activeSuggestionIndex.value >= suggestions.value.length) activeSuggestionIndex.value = 0
  }

  const selectSuggestion = (sug) => {
    pathInput.value = sug + '\\'
    showSuggestions.value = false
    nextTick(() => { if (pathInputField.value) pathInputField.value.focus() })
  }

  const handlePathSubmit = () => {
    if (activeSuggestionIndex.value > -1) {
      selectSuggestion(suggestions.value[activeSuggestionIndex.value])
      return
    }
    let inputRaw = pathInput.value.trim().replace(/\\/g, '/')
    if (!inputRaw.startsWith('/')) inputRaw = '/' + inputRaw
    fetchFiles(inputRaw)
    isEditingPath.value = false
    showSuggestions.value = false
  }

  const startEditingPath = () => {
    isEditingPath.value = true
    nextTick(() => { if (pathInputField.value) { pathInputField.value.focus(); onPathInput() } })
  }

  const closeSuggestions = () => {
    // 物理优化：缩短延迟至 100ms
    setTimeout(() => { isEditingPath.value = false; showSuggestions.value = false }, 100)
  }

  return {
    currentPath, pathInput, isEditingPath, pathInputField, files, selectedItems, 
    isLoading, isSyncing, searchQuery, suggestions, showSuggestions, activeSuggestionIndex,
    userStore, filteredFiles, clipboard,
    fetchFiles, toggleSelection, toggleSelect, handleMkdir, handleUpload, formatSize, router,
    onPathInput, moveSuggestion, selectSuggestion, handlePathSubmit, startEditingPath, closeSuggestions
  }
}
