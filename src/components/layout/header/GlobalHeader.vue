<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 全局统一顶栏组件
 * 1. 物理高度锁定为 48px (h-12)。
 * 2. 具备全局统一的返回逻辑。
 * 3. 样式精准对标 Nexus Hub 极简工业风。
 */
const props = defineProps({
  parentLabel: { type: String, default: '' },
  currentLabel: { type: String, default: 'CORE' },
  showSearch: { type: Boolean, default: true }
})

const router = useRouter()
const searchQuery = ref('')
const emit = defineEmits(['search'])

// 统一的返回逻辑：优先返回上一页，若无法返回则跳转回首页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<template>
  <!-- 容器锁定 h-12，全局统一 -->
  <header class="h-12 border-b border-zinc-100 bg-white flex items-center justify-between px-10 sticky top-0 z-40 w-full shrink-0">
    
    <!-- 左侧：导航与返回 -->
    <div class="flex items-center gap-4">
      <!-- 动态返回按钮：仅在二级页面显示（由路由 meta.parent 决定） -->
      <button 
        v-if="parentLabel && parentLabel !== ''" 
        @click="goBack"
        class="w-7 h-7 flex items-center justify-center border border-zinc-100 hover:border-zinc-900 transition-all group shrink-0"
        title="Go Back"
      >

        <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- 统一的面包屑样式 -->
      <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden">
        <span v-if="parentLabel" class="text-zinc-400">{{ parentLabel }}</span>
        <span v-if="parentLabel" class="text-zinc-200">/</span>
        <span class="text-zinc-900">{{ currentLabel }}</span>
      </div>
    </div>

    <!-- 右侧：统一搜索模块 -->
    <div v-if="showSearch" class="relative group ml-4">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg class="w-3.5 h-3.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="SEARCH ARCHIVE..." 
        @input="handleSearch"
        class="w-[400px] bg-zinc-50 border border-zinc-100 py-1 pl-9 pr-4 text-[9px] font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:bg-white focus:border-zinc-900 focus:shadow-[2px_2px_0px_#f4f4f5] transition-all"
      />
    </div>
  </header>
</template>
