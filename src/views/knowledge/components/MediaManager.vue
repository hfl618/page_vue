<script setup>
import { ref } from 'vue'
import { useEditorStore } from '@/store/editor'

/**
 * @description 媒体管理抽屉 (右侧)
 */
const store = useEditorStore()
const emit = defineEmits(['insert-media'])
const fileInputRef = ref(null)

const triggerFileInput = () => fileInputRef.value.click()

const handleFileUpload = (event) => {
  const files = event.target.files
  Array.from(files).forEach(file => {
    const url = URL.createObjectURL(file)
    const isImage = file.type.startsWith('image/')
    store.addMedia({
      id: Date.now() + Math.random(),
      name: file.name,
      type: isImage ? 'image' : 'file',
      url: url,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    })
  })
  event.target.value = ''
}

const openMedia = (url) => window.open(url, '_blank')
</script>

<template>
  <div class="fixed top-0 right-0 h-full w-[360px] bg-white border-l border-zinc-100 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] transition-transform duration-500 z-50 flex flex-col"
       :class="store.isDockActive ? 'translate-x-0' : 'translate-x-full'">
    
    <!-- 触发器 (吸附在抽屉左侧) -->
    <div class="absolute left-[-40px] top-1/2 -translate-y-1/2 w-10 h-24 bg-zinc-900 flex flex-col items-center justify-center gap-4 cursor-pointer shadow-[-4px_0_10px_rgba(0,0,0,0.1)] group"
         @click="store.toggleDock">
      <div class="w-1 h-8 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
      <span class="text-white text-[10px] font-black vertical-text tracking-widest">ASSETS</span>
    </div>

    <!-- 头部 -->
    <header class="p-8 border-b border-zinc-50 flex items-center justify-between shrink-0">
      <div>
        <h3 class="text-[14px] font-black uppercase tracking-widest text-zinc-900 mb-1">Asset Library</h3>
        <p class="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Node: HEFLOS_STORAGE_01</p>
      </div>
      <BaseButton variant="primary" class="!px-4 !py-1.5 !text-[9px]" @click="triggerFileInput">
        + INGEST
      </BaseButton>
      <input type="file" ref="fileInputRef" @change="handleFileUpload" multiple hidden />
    </header>

    <!-- 列表区 -->
    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div v-if="store.mediaList.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-30">
        <div class="w-12 h-12 border-2 border-dashed border-zinc-900 mb-6 flex items-center justify-center">
          <div class="w-4 h-4 bg-zinc-900 animate-pulse"></div>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em]">No Assets Detected</p>
        <p class="text-[9px] mt-2 italic font-medium">Drag files or paste from clipboard</p>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div v-for="media in store.mediaList" :key="media.id" 
             class="group relative bg-zinc-50 border border-zinc-100 p-4 transition-all hover:bg-white hover:border-zinc-900 hover:shadow-[4px_4px_0px_#f4f4f5]">
          
          <div class="flex items-center gap-4">
            <!-- 预览图/图标 -->
            <div class="w-12 h-12 bg-white border border-zinc-100 overflow-hidden flex items-center justify-center shrink-0">
              <img v-if="media.type === 'image'" :src="media.url" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              <span v-else class="text-[14px]">📄</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="text-[11px] font-black text-zinc-900 truncate uppercase tracking-tighter mb-1" :title="media.name">
                {{ media.name }}
              </div>
              <div class="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
                {{ media.type }} // {{ media.size }}
              </div>
            </div>

            <!-- 操作 -->
            <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button class="w-6 h-6 border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
                      @click="emit('insert-media', media)">
                <span class="text-[10px] font-bold">+</span>
              </button>
              <button class="w-6 h-6 border border-zinc-200 flex items-center justify-center hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors"
                      @click="openMedia(media.url)">
                <span class="text-[8px]">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态 -->
    <footer class="p-6 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between shrink-0">
      <span class="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Buffer: {{ store.mediaList.length }} items</span>
      <div class="flex gap-2">
        <div class="w-1 h-1 bg-zinc-300 rounded-full"></div>
        <div class="w-1 h-1 bg-zinc-300 rounded-full"></div>
        <div class="w-1 h-1 bg-zinc-900 rounded-full animate-pulse"></div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.vertical-text { writing-mode: vertical-lr; transform: rotate(180deg); }
</style>
