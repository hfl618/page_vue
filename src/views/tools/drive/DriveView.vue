<script setup>
import { onMounted, ref } from 'vue'
import { useDrive } from './hooks/useDrive'
import DriveDetailPanel from './components/DriveDetailPanel.vue'

/**
 * @description 云端硬盘主视图 (1:1 工业级还原版)
 */
const {
  currentPath, pathInput, isEditingPath, pathInputField, files, selectedItems, 
  isLoading, isSyncing, searchQuery, suggestions, showSuggestions, activeSuggestionIndex,
  userStore, filteredFiles,
  fetchFiles, toggleSelection, toggleSelect, handleMkdir, handleUpload, formatSize, router,
  onPathInput, moveSuggestion, selectSuggestion, handlePathSubmit, startEditingPath, closeSuggestions
} = useDrive()

const fileInput = ref(null)

// 导航回主页
const goBack = () => router.push('/discover')

// 向上级目录
const goUp = () => {
  if (currentPath.value === '/' || currentPath.value === '') return
  let parts = currentPath.value.split('/').filter(p => p)
  parts.pop()
  fetchFiles('/' + parts.join('/'))
}

// 刷新
const refresh = () => fetchFiles(currentPath.value)

// 详情面板触发的操作
const handleAction = (type) => {
  if (type === 'PREVIEW' && selectedItems.value.length === 1) {
    const file = selectedItems.value[0]
    if (file.type !== 'folder') {
      const path = currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`
      window.open(`/api/v1/drive/download?path=${encodeURIComponent(path)}`, '_blank')
    }
  }
}

const handleDblClick = (file) => {
  if (file.type === 'folder') {
    const nextPath = currentPath.value === '/' ? `/${file.name}` : `${currentPath.value}/${file.name}`
    fetchFiles(nextPath)
  } else {
    selectedItems.value = [file]
    handleAction('PREVIEW')
  }
}

onMounted(() => fetchFiles('/'))
</script>

<template>
  <div class="h-full flex flex-col bg-[#fafafa]" translate="no">
    <!-- 主滚动区域 -->
    <div class="flex-1 overflow-hidden p-6">
      <div class="max-w-[1600px] mx-auto h-full flex flex-col bg-white border border-zinc-900 shadow-[8px_8px_0px_#f4f4f5] overflow-hidden">
        
        <!-- 1. 物理路径导航条 -->
        <div class="px-4 py-2 border-b border-zinc-900 flex justify-between items-center bg-zinc-50 relative z-30">
          <div class="font-bold tracking-tight uppercase flex items-center gap-2.5 min-w-0 flex-1 mr-6 relative">
            <span class="text-zinc-400 shrink-0 text-[9px] font-black tracking-widest flex items-center gap-2">
              Device:
              <!-- 微型物理 Loader -->
              <div v-if="isSyncing" class="w-1.5 h-1.5 bg-blue-600 animate-pulse"></div>
            </span>
            <div class="flex-1 relative group">
              <!-- 静态展示态 (加载时禁用) -->
              <div v-if="!isEditingPath" 
                   @click="!isSyncing && startEditingPath()" 
                   class="border border-zinc-100 bg-zinc-50/50 px-2.5 py-1 flex items-center gap-1 min-w-[400px] max-w-full cursor-text transition-all"
                   :class="isSyncing ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white hover:border-zinc-900'">
                <span class="text-zinc-300 select-none shrink-0 font-black text-[10px] tracking-tight">{{ userStore.currentUser?.username || 'Guest' }}:</span>
                <span class="text-zinc-400 font-mono text-[12px] lowercase truncate">{{ pathInput }}</span>
              </div>
              
              <!-- 交互输入态 -->
              <!-- ... (保持不变) ... -->
              <div v-else class="relative">
                <div class="border border-zinc-900 bg-white px-2.5 py-1 flex items-center gap-1 shadow-[3px_3px_0px_#f4f4f5] -translate-y-0.5 transition-all">
                  <span class="text-zinc-400 font-black text-[10px] tracking-tight shrink-0">{{ userStore.currentUser?.username || 'Guest' }}:</span>
                  <input 
                    ref="pathInputField" 
                    v-model="pathInput" 
                    @input="onPathInput"
                    @keydown.enter="handlePathSubmit"
                    @keydown.esc="isEditingPath = false"
                    @keydown.down.prevent="moveSuggestion(1)"
                    @keydown.up.prevent="moveSuggestion(-1)"
                    @blur="closeSuggestions"
                    class="bg-transparent text-zinc-900 border-none outline-none font-mono text-[12px] w-full p-0 lowercase" 
                    spellcheck="false" 
                    autocomplete="off"
                  />
                </div>

                <!-- 自动补全建议列表 -->
                <div v-if="showSuggestions && suggestions.length > 0" class="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-900 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] z-[200] overflow-hidden">
                  <div class="bg-zinc-50 px-3 py-1 border-b border-zinc-100 text-[7px] font-black text-zinc-400 uppercase tracking-widest">Suggested Paths</div>
                  <div class="max-h-60 overflow-y-auto custom-scrollbar">
                    <div 
                      v-for="(sug, idx) in suggestions" :key="sug"
                      @mousedown="selectSuggestion(sug)"
                      class="px-3 py-1.5 text-[11px] font-mono cursor-pointer flex items-center gap-3 transition-colors"
                      :class="activeSuggestionIndex === idx ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-50 text-zinc-600'"
                    >
                      <svg class="w-3 h-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                      <span>{{ sug }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-5 items-center shrink-0">
            <!-- 加载状态字 -->
            <div v-if="isSyncing" class="text-[8px] font-black text-blue-600 animate-pulse tracking-widest mr-2">[SYNCING...]</div>
            <BaseActionLink @click="refresh" class="text-[9px]">Refresh</BaseActionLink>
            <BaseActionLink @click="fileInput.click()" class="text-[9px]">Upload</BaseActionLink>
            <BaseActionLink @click="handleMkdir" class="text-[9px]">Mkdir</BaseActionLink>
            <input type="file" ref="fileInput" class="hidden" @change="(e) => handleUpload(e.target.files[0])">
          </div>
        </div>

        <!-- 物理级同步进度条 (2px 高度, 更鲜艳) -->
        <div class="h-[2px] w-full bg-zinc-50 relative overflow-hidden">
          <div v-if="isSyncing" class="absolute inset-0 bg-blue-600 transition-all duration-300 animate-pulse"></div>
        </div>

        <!-- 2. 文件列表表格 -->
        <div class="flex-1 overflow-y-auto custom-scrollbar font-mono text-left">
          <table class="w-full border-collapse text-left">
            <thead class="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_#18181b]">
              <tr>
                <th class="w-10 px-4 py-2 text-center"><input type="checkbox" class="accent-zinc-900"></th>
                <th class="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">Name</th>
                <th class="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">Size</th>
                <th class="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">Modified</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentPath !== '/'" @click="goUp" class="cursor-pointer hover:bg-zinc-50 transition-colors">
                <td class="px-4 py-1.5 border-b border-zinc-50"></td>
                <td colspan="3" class="px-4 py-1.5 border-b border-zinc-50 font-bold text-[12px] text-left"><span class="text-zinc-300 mr-2 text-left">[^]</span>..</td>
              </tr>
              <tr v-for="file in filteredFiles" :key="file.name" 
                  @click="toggleSelect(file, $event)"
                  @dblclick="handleDblClick(file)"
                  :class="[selectedItems.some(i => i.name === file.name) ? 'bg-zinc-50 shadow-[inset_3px_0px_0px_#18181b]' : 'hover:bg-zinc-50']" 
                  class="cursor-pointer transition-all select-none group">
                <td class="px-4 py-1.5 border-b border-zinc-50 text-center" @click.stop="toggleSelection(file)">
                  <input type="checkbox" 
                         :checked="selectedItems.some(i => i.name === file.name)" 
                         @click.stop="toggleSelection(file)"
                         class="accent-zinc-900 cursor-pointer">
                </td>
                <td class="px-4 py-1.5 border-b border-zinc-50 font-bold text-zinc-900 text-[12px] text-left">
                  <div class="flex items-center gap-2 text-left">
                    <svg v-if="file.type === 'folder'" class="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    <span class="text-left">{{ file.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-1.5 border-b border-zinc-50 opacity-60 text-[10px] text-left">{{ formatSize(file.size) }}</td>
                <td class="px-4 py-1.5 border-b border-zinc-50 opacity-40 text-[10px] text-left">{{ file.modified || '--' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 3. 详情面板 -->
        <DriveDetailPanel 
          :selected-items="selectedItems"
          :current-path="currentPath"
          @preview="handleAction('PREVIEW')"
          @download="handleAction('DOWNLOAD')"
          @delete="handleAction('DELETE')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }
</style>
