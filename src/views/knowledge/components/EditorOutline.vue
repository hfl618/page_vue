<script setup>
import { useEditorStore } from '@/store/editor'

/**
 * @description 编辑器大纲组件 (左侧)
 */
const store = useEditorStore()

const scrollToHeading = (text) => {
  // 跨组件寻找 Tiptap 渲染的真实 DOM 节点并滚动
  const container = document.querySelector('.ProseMirror')
  if (!container) return
  const elements = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  const target = elements.find(el => el.textContent.trim() === text.trim())
  
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <aside class="flex flex-col h-full bg-white border-r border-zinc-100 p-8 select-none overflow-hidden">
    <div class="flex items-center gap-2 mb-8">
      <div class="w-1 h-3 bg-zinc-900"></div>
      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Document Outline</span>
    </div>

    <div v-if="store.tocList.length === 0" class="flex-1 flex flex-col items-center justify-center text-center px-4">
      <div class="w-8 h-8 border border-zinc-100 flex items-center justify-center mb-4">
        <div class="w-2 h-2 bg-zinc-100"></div>
      </div>
      <p class="text-[9px] font-bold text-zinc-300 uppercase tracking-widest leading-relaxed">
        Empty Registry<br>
        Input # for header
      </p>
    </div>
    
    <nav v-else class="flex-1 overflow-y-auto custom-scrollbar pr-2">
      <div 
        v-for="(item, index) in store.tocList" 
        :key="index"
        class="group flex items-start gap-3 py-2 cursor-pointer transition-all hover:translate-x-1"
        :style="{ paddingLeft: (item.level - 1) * 12 + 'px' }"
        @click="scrollToHeading(item.text)"
      >
        <span class="text-[9px] font-mono text-zinc-300 mt-1 group-hover:text-zinc-900">0{{ index + 1 }}</span>
        <span class="text-[12px] text-zinc-500 font-medium group-hover:text-zinc-900 transition-colors truncate">
          {{ item.text }}
        </span>
      </div>
    </nav>

    <div class="mt-8 pt-8 border-t border-zinc-50">
      <div class="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">
        Node: {{ store.tocList.length }} Entries
      </div>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e4e4e7; }
</style>
