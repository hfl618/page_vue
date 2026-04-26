<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { driveApi } from '@/api/modules/drive'
import { useUiStore } from '@/store/ui'
import { useUserStore } from '@/store/user'

const uiStore = useUiStore()
const userStore = useUserStore()

// 状态定义
const currentPath = ref('/')
const pathInput = ref('')
const isEditingPath = ref(false)
const pathInputField = ref(null)
const files = ref([])
const selectedItems = ref([])
const suggestions = ref([])
const showSuggestions = ref(false)
const activeSuggestionIndex = ref(-1)
const clipboard = ref({ type: null, keys: [] })
const isLoading = ref(false)
const searchQuery = ref('')
const fileInput = ref(null)

// --- 逻辑处理 ---

const formatSize = (bytes) => {
  if (bytes === '--' || !bytes || isNaN(bytes)) return '--'
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fetchFiles = async (path, silent = false) => {
  isLoading.value = true
  try {
    if (!silent) files.value = []
    selectedItems.value = []
    const data = await driveApi.getFiles(path, { hideLoading: silent })
    currentPath.value = data.currentPath
    let displayPath = data.currentPath.replace(/\//g, '')
    pathInput.value = displayPath === '' ? '' : displayPath
    files.value = data.files
  } catch (e) {
    uiStore.addNotice({ title: 'DRIVE_ERROR', message: 'Directory access failed.', type: 'error' })
  } finally {
    isLoading.value = false
  }
}

const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value
  const q = searchQuery.value.toLowerCase()
  return files.value.filter(f => f.name.toLowerCase().includes(q))
})

const isAllSelected = computed(() => 
  filteredFiles.value.length > 0 && selectedItems.value.length === filteredFiles.value.length
)

const isSelected = (file) => selectedItems.value.some(i => i.name === file.name)
const isCutting = (file) => 
  clipboard.value.type === 'MOVE' && 
  clipboard.value.keys.some(k => k.endsWith(file.name) || k.endsWith(file.name + '/'))

const toggleSelect = (file, event) => {
  if (event && (event.ctrlKey || event.metaKey || event.isCheckbox)) {
    const index = selectedItems.value.findIndex(i => i.name === file.name)
    if (index > -1) selectedItems.value = selectedItems.value.filter(i => i.name !== file.name)
    else selectedItems.value = [...selectedItems.value, file]
  } else {
    if (selectedItems.value.length === 1 && selectedItems.value[0].name === file.name) selectedItems.value = []
    else selectedItems.value = [file]
  }
}

const toggleSelectAll = () => {
  selectedItems.value = isAllSelected.value ? [] : [...filteredFiles.value]
}

const onPathInput = async () => {
  activeSuggestionIndex.value = -1
  const input = pathInput.value.trim()
  if (!input.includes('')) {
    suggestions.value = files.value
      .filter(f => f.type === 'folder' && f.name.toLowerCase().startsWith(input.toLowerCase()))
      .map(f => '' + f.name)
    return
  }
  const lastSlashIndex = input.lastIndexOf('')
  const parentDirRaw = input.substring(0, lastSlashIndex)
  const parentDir = parentDirRaw === '' ? '' : parentDirRaw
  const partialName = input.substring(lastSlashIndex + 1).toLowerCase()
  try {
    const targetPath = parentDir.replace(/\/g, '/') || '/'
    const data = await driveApi.getFiles(targetPath, { hideLoading: true })
    suggestions.value = data.files
      .filter(f => f.type === 'folder' && f.name.toLowerCase().startsWith(partialName))
      .map(f => (parentDir === '' ? '' : parentDir + '') + f.name)
  } catch (e) { suggestions.value = [] }
}

const handlePathSubmit = () => {
  let inputRaw = pathInput.value.trim().replace(/\/g, '/')
  let target = inputRaw.startsWith('/') ? inputRaw : (currentPath.value.endsWith('/') ? currentPath.value + inputRaw : currentPath.value + '/' + inputRaw)
  fetchFiles(target)
}

const startEditingPath = () => {
  isEditingPath.value = true
  showSuggestions.value = true
  nextTick(() => {
    if (pathInputField.value) pathInputField.value.focus()
    onPathInput()
  })
}

const closeSuggestions = () => {
  setTimeout(() => {
    isEditingPath.value = false
    showSuggestions.value = false
  }, 200)
}

const handleUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  formData.append('path', currentPath.value)
  uiStore.showLoading('UPLOADING', 'Syncing...')
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

const handleBatchDelete = async () => {
  if (!confirm(`Delete ${selectedItems.value.length} items?`)) return
  const keys = selectedItems.value.map(f => f.r2_key)
  await driveApi.delete(keys)
  fetchFiles(currentPath.value)
}

const handleRename = async () => {
  if (selectedItems.value.length !== 1) return
  const file = selectedItems.value[0]
  let namePart = file.name, extPart = ""
  const lastDot = file.name.lastIndexOf('.')
  if (file.type !== 'folder' && lastDot !== -1) {
    extPart = file.name.substring(lastDot)
    namePart = file.name.substring(0, lastDot)
  }
  const newName = prompt(`Rename (${extPart}):`, namePart)
  if (!newName || newName === namePart) return
  const oldKey = file.r2_key
  await driveApi.rename({ old_key: oldKey, new_name: newName + extPart })
  fetchFiles(currentPath.value)
}

const handleClipboardExecute = async () => {
  const api = clipboard.value.type === 'MOVE' ? driveApi.move : driveApi.paste
  await api({ keys: clipboard.value.keys, path: currentPath.value })
  fetchFiles(currentPath.value)
  clipboard.value = { type: null, keys: [] }
}

const handlePreview = () => {
  if (selectedItems.value.length !== 1) return
  const file = selectedItems.value[0]
  if (file.type === 'folder') return
  window.open(`/api/v1/drive/view/${encodeURIComponent(file.name)}?key=${encodeURIComponent(file.r2_key)}`, '_blank')
}

const goUp = () => {
  if (currentPath.value === '/' || currentPath.value === '') return
  let parts = currentPath.value.split('/').filter(p => p)
  parts.pop()
  fetchFiles('/' + parts.join('/'))
}

onMounted(() => fetchFiles('/'))
</script>

<template>
  <div class="h-full flex flex-col bg-[#fafafa]" translate="no">
    <!-- Header -->
    <div class="px-10 py-6 border-b border-zinc-100 flex items-center justify-between bg-white relative z-[100]">
        <div class="flex items-center gap-4">
            <button @click="$router.push('/discover')" class="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:border-zinc-900 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div>
                <h1 class="text-xl font-black text-zinc-900 uppercase tracking-tighter leading-none">Cloud Drive</h1>
                <p class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Industrial Asset Repository</p>
            </div>
        </div>
        
        <div class="flex items-center gap-6">
            <input v-model="searchQuery" placeholder="SEARCH_OBJECTS..." class="bg-zinc-50 border border-zinc-100 px-3 py-1.5 text-[11px] font-mono w-64 outline-none focus:border-zinc-900 transition-all">
            <button @click="handleMkdir" class="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all shadow-[2px_2px_0px_#f4f4f5]">New_Folder</button>
            <button @click="fileInput.click()" class="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-zinc-900 text-white hover:bg-black transition-all shadow-[4px_4px_0px_#f4f4f5]">Upload</button>
            <input type="file" ref="fileInput" class="hidden" @change="handleUpload">
        </div>
    </div>

    <div class="flex-1 overflow-hidden p-6">
        <div class="max-w-[1600px] mx-auto h-full flex flex-col bg-white border border-zinc-900 shadow-[8px_8px_0px_#f4f4f5] overflow-hidden">
            <!-- Path Bar -->
            <div class="px-6 py-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-50 relative z-30">
                <div class="flex-1 flex items-center gap-3 mr-6 relative">
                    <span class="text-zinc-400 text-[10px] font-black tracking-widest uppercase">Registry:</span>
                    <div class="flex-1 relative">
                        <div v-if="!isEditingPath" @click="startEditingPath" class="border border-zinc-100 bg-zinc-50/50 px-2.5 py-1 flex items-center gap-1 cursor-text hover:bg-white hover:border-zinc-900 transition-all">
                            <span class="text-zinc-300 font-black text-[11px] tracking-tight">{{ userStore.user?.username || 'Guest' }}:</span>
                            <span class="text-zinc-400 font-mono text-[13px] lowercase truncate">{{ pathInput }}</span>
                        </div>
                        <div v-else class="border border-zinc-900 bg-white px-2.5 py-1 flex items-center gap-1 shadow-[4px_4px_0px_#f4f4f5] -translate-y-0.5 transition-all">
                            <span class="text-zinc-400 font-black text-[11px] tracking-tight">{{ userStore.user?.username || 'Guest' }}:</span>
                            <input ref="pathInputField" v-model="pathInput" @input="onPathInput" @keydown.enter="handlePathSubmit" @keydown.esc="isEditingPath = false" @blur="closeSuggestions" class="bg-transparent text-zinc-900 border-none outline-none font-mono text-[13px] w-full p-0 lowercase" spellcheck="false" autocomplete="off" />
                        </div>
                    </div>
                </div>
                <div class="flex gap-6 items-center shrink-0">
                    <button v-if="clipboard.keys.length > 0" @click="handleClipboardExecute" class="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Paste ({{ clipboard.keys.length }})</button>
                    <button @click="fetchFiles(currentPath)" class="text-[10px] font-black uppercase tracking-widest hover:text-blue-600">Refresh</button>
                </div>
            </div>

            <!-- Table -->
            <div class="flex-1 overflow-y-auto custom-scrollbar font-mono">
                <table class="w-full border-collapse text-left">
                    <thead class="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_#18181b]">
                        <tr>
                            <th class="w-10 px-4 py-2.5 text-center"><input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" class="accent-zinc-900"></th>
                            <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Name</th>
                            <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Size</th>
                            <th class="px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="currentPath !== '/'" @click="goUp" class="cursor-pointer hover:bg-zinc-50 transition-colors">
                            <td class="px-4 py-2.5 border-b border-zinc-50"></td>
                            <td colspan="3" class="px-4 py-2.5 border-b border-zinc-50 font-bold"><span class="text-zinc-300 mr-2">[^]</span>..</td>
                        </tr>
                        <tr v-for="file in filteredFiles" :key="file.name" @click="toggleSelect(file, $event)" @dblclick="file.type === 'folder' ? fetchFiles(currentPath + (currentPath === '/' ? '' : '/') + file.name) : handlePreview()" :class="[isSelected(file) ? 'bg-zinc-50' : 'hover:bg-zinc-50']" class="cursor-pointer transition-all select-none">
                            <td class="px-4 py-2.5 border-b border-zinc-50 text-center"><input type="checkbox" :checked="isSelected(file)" class="accent-zinc-900"></td>
                            <td class="px-4 py-2.5 border-b border-zinc-50 font-bold text-zinc-900">{{ file.name }}</td>
                            <td class="px-4 py-2.5 border-b border-zinc-50 opacity-60">{{ formatSize(file.size) }}</td>
                            <td class="px-4 py-2.5 border-b border-zinc-50 opacity-40">{{ file.modified }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom Panel (路径精简修复版) -->
            <div v-if="selectedItems.length > 0" class="p-4 border-t-2 border-zinc-900 bg-zinc-50">
                <div class="flex justify-between items-end gap-10">
                    <div class="min-w-0 flex-1">
                        <div class="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">{{ selectedItems.length }} TARGETS_IDENTIFIED</div>
                        <div class="text-lg font-black tracking-tighter uppercase text-zinc-900 truncate">{{ selectedItems.length === 1 ? selectedItems[0].name : 'BULK_PAYLOAD' }}</div>
                        
                        <!-- 核心修复：物理精简路径显示 -->
                        <div v-if="selectedItems.length === 1" class="mt-3 grid grid-cols-2 gap-6 pt-3 border-t border-zinc-200">
                             <div>
                                <div class="text-[8px] font-black text-zinc-300 uppercase mb-0.5">Physical_Origin</div>
                                <div class="text-[11px] font-bold text-zinc-600 truncate">
                                    {{ 'drive' + (currentPath === '/' ? '' : currentPath) + '/' + selectedItems[0].name }}
                                </div>
                             </div>
                             <div>
                                <div class="text-[8px] font-black text-zinc-300 uppercase mb-0.5">Asset_Type</div>
                                <div class="text-[11px] font-bold text-zinc-600 uppercase">{{ selectedItems[0].category || 'GENERIC' }}</div>
                             </div>
                        </div>
                    </div>
                    <div class="flex gap-6 shrink-0 pb-1">
                        <button @click="handleDownload" class="text-[10px] font-black uppercase tracking-widest hover:underline">Download</button>
                        <button @click="clipboard = { type: 'MOVE', keys: selectedItems.map(f => f.r2_key) }" class="text-[10px] font-black uppercase tracking-widest hover:underline">Move</button>
                        <button @click="handleBatchDelete" class="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline">Purge</button>
                        <button v-if="selectedItems.length === 1" @click="handleRename" class="text-[10px] font-black uppercase tracking-widest hover:underline">Rename</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }
</style>
