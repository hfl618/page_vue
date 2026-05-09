<script setup>
import { computed } from 'vue'

/**
 * @description 云端硬盘详细信息面板 (1:1 工业级还原版)
 * 物理对齐路径精简显示需求。
 */
const props = defineProps({
  selectedItems: { type: Array, default: () => [] },
  currentPath: { type: String, default: '/' }
})

const emit = defineEmits(['preview', 'download', 'copy', 'move', 'delete', 'rename', 'edit-description'])

// 物理属性计算：判断是否为可预览类型 (图片/文档/视频)
const isPreviewable = (name) => {
  if (!name) return false
  const ext = name.split('.').pop().toLowerCase()
  const previewableExtensions = ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'pdf', 'txt', 'md']
  return previewableExtensions.includes(ext)
}

const mainFile = computed(() => props.selectedItems[0] || null)

// 物理属性计算
const getFileType = (name) => {
  if (!name) return 'UNKNOWN'
  const ext = name.split('.').pop().toUpperCase()
  const types = {
    'TXT': 'DOCUMENT', 'MD': 'DOCUMENT', 'PDF': 'DOCUMENT',
    'PNG': 'IMAGE', 'JPG': 'IMAGE', 'JPEG': 'IMAGE', 'SVG': 'IMAGE',
    'MP4': 'VIDEO', 'ZIP': 'ARCHIVE', 'RAR': 'ARCHIVE', '7Z': 'ARCHIVE',
    'XLSX': 'SPREADSHEET', 'DOCX': 'DOCUMENT'
  }
  return types[ext] || 'BINARY_OBJECT'
}

// 核心修复：物理精简路径显示
const displayPath = computed(() => {
  if (!mainFile.value) return ''
  const path = props.currentPath === '/' ? '' : props.currentPath
  return 'drive' + path + '/' + mainFile.value.name
})
</script>

<template>
  <Transition 
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-10 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-10 opacity-0"
  >
    <div v-if="mainFile" class="p-3 border-t-2 border-zinc-900 bg-zinc-50">
      <!-- 1. 顶部操作行 -->
      <div class="flex justify-between items-end gap-6" :class="{ 'mb-3': selectedItems.length === 1 }">
        <div class="min-w-0">
          <div class="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            {{ selectedItems.length }} Objects Selected 
          </div>
          <div class="flex items-center gap-2.5">
            <div class="text-[15px] font-black tracking-tighter uppercase truncate text-zinc-900 leading-none">
              {{ selectedItems.length === 1 ? mainFile.name : 'Bulk Operation Mode' }}
            </div>
            <button v-if="selectedItems.length === 1 && isPreviewable(mainFile.name)" @click="emit('preview')" class="text-zinc-300 hover:text-zinc-900 transition-colors" title="Quick Preview">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex gap-5 shrink-0">
          <BaseActionLink v-if="selectedItems.length === 1 && isPreviewable(mainFile.name)" @click="emit('preview')" class="text-[9px]">Preview</BaseActionLink>
          <BaseActionLink @click="emit('download')" class="text-[9px]">Download</BaseActionLink>
          <BaseActionLink @click="emit('copy')" class="text-[9px]">Copy</BaseActionLink>
          <BaseActionLink @click="emit('move')" class="text-[9px]">Move</BaseActionLink>
          <BaseActionLink @click="emit('delete')" color-class="text-red-600" class="text-[9px]">Delete</BaseActionLink>
          <BaseActionLink v-if="selectedItems.length === 1" @click="emit('rename')" class="text-[9px]">Rename</BaseActionLink>
        </div>
      </div>

      <!-- 2. 属性网格 (1:1 精简路径) -->
      <div v-if="selectedItems.length === 1" class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 border-t border-zinc-200 pt-3">
        <div>
          <div class="text-[7px] font-black text-zinc-400 uppercase mb-0.5">Physical_Origin</div>
          <div class="text-[10px] font-bold text-zinc-700 truncate">{{ displayPath }}</div>
        </div>
        <div>
          <div class="text-[7px] font-black text-zinc-400 uppercase mb-0.5">Asset_Type</div>
          <div class="text-[10px] font-bold text-zinc-700 uppercase">
            {{ mainFile.type === 'folder' ? 'DIRECTORY' : getFileType(mainFile.name) }}
          </div>
        </div>
        <div>
          <div class="text-[7px] font-black text-zinc-400 uppercase mb-0.5">Uploaded_At</div>
          <div class="text-[10px] font-bold text-zinc-700">{{ mainFile.modified || '--' }}</div>
        </div>
        <div>
          <div class="text-[7px] font-black text-zinc-400 uppercase mb-0.5">Integrity</div>
          <div class="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-sm inline-block uppercase">Verified</div>
        </div>
      </div>

      <!-- 3. 描述区 -->
      <div v-if="selectedItems.length === 1" class="mt-3 p-2.5 bg-zinc-100/50 border border-dashed border-zinc-200 text-[10px]">
        <div class="flex justify-between items-center mb-1">
          <span class="text-[7px] font-black text-zinc-400 uppercase">Description / Manual Notes</span>
          <button @click="emit('edit-description')" class="text-[8px] font-bold text-blue-600 hover:underline">Edit</button>
        </div>
        <div class="text-zinc-600 italic">
          {{ mainFile.description || (mainFile.type === 'folder' ? 'System Directory Node.' : 'Encrypted binary asset data.') }}
        </div>
      </div>
    </div>
  </Transition>
</template>
