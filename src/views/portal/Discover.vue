<script setup>
import { ref, computed, onMounted } from 'vue'
import ToolCard from '@/components/common/cards/ToolCard.vue'

/**
 * Discover 页面检索与排序逻辑说明：
 * 1. 采用 Computed 过滤模式，确保网格布局在筛选时自动重排（无空洞）。
 * 2. 引入 localStorage 持久化，同步用户的分类导航偏好。
 * 3. 逻辑权重：All > Favorites > Tags。
 */

// 状态定义
const activeCategory = ref('All')
const navCategories = ref(['All', 'Favorites']) // 基础分类
const showConfigModal = ref(false)

// 模拟从后端/源码中提取的完整分类池
const allPool = [
  { id: 1, name: 'Utility' },
  { id: 2, name: 'Hardware' },
  { id: 3, name: 'Network' },
  { id: 4, name: 'System' }
]

// 工具原始数据
const allTools = ref([
  {
    name: 'Inventory System',
    description: 'Hardware and component stocks management.',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    tag: 'Utility',
    version: 'V1.2.0',
    isCore: true,
    favStatus: true,
    author: 'HEFLOS',
    url: '/tools/inventory'
  },
  {
    name: 'Cloud Drive',
    description: 'Centralized engineering assets storage.',
    iconPath: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    tag: 'Utility',
    version: 'V2.0.4',
    isCore: true,
    favStatus: false,
    author: 'SYSTEM',
    url: '/tools/drive'
  },
  {
    name: 'Serial Port',
    description: 'Real-time embedded debugging terminal.',
    iconPath: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    tag: 'Hardware',
    version: 'V0.9.1',
    isCore: false,
    favStatus: true,
    author: 'LAB_TECH',
    url: '/tools/serial'
  }
])

/**
 * 核心检索逻辑：计算属性
 * 确保筛选时列表是“排序并紧凑”的
 */
const filteredTools = computed(() => {
  return allTools.value.filter(tool => {
    if (activeCategory.value === 'All') return true
    if (activeCategory.value === 'Favorites') return tool.favStatus
    return tool.tag === activeCategory.value
  })
})

// 初始化持久化数据
onMounted(() => {
  const saved = localStorage.getItem('heflos_discover_nav')
  if (saved) {
    navCategories.value = JSON.parse(saved)
  } else {
    // 默认展示
    navCategories.value = ['All', 'Favorites', 'Utility', 'Hardware']
  }
})

// 切换分类方法
const setCategory = (cat) => {
  activeCategory.value = cat
}
</script>

<template>
  <div class="h-full flex flex-col relative bg-[#fafafa]" translate="no">
    <!-- 主滚动容器 -->
    <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">
      <div class="max-w-[1600px] mx-auto">
        
        <!-- 头部：Utility Archive 标题区 -->
        <div class="flex items-end justify-between mb-12 flex-wrap gap-10">
          <div class="max-w-xl text-left">
            <h1 class="text-[28px] font-bold text-zinc-900 tracking-tight uppercase leading-none">Utility Archive</h1>
            <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-3 italic">System Core & Community Deployments</p>
          </div>

          <!-- 分类筛选区：复刻原项目动态按钮 -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <button 
                v-for="cat in navCategories" 
                :key="cat"
                @click="setCategory(cat)"
                class="px-3 py-1.5 border-2 text-[11px] font-black uppercase transition-all duration-200 whitespace-nowrap outline-none rounded-0"
                :class="activeCategory === cat ? 'bg-white border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_#f4f4f5] -translate-y-0.5' : 'border-transparent text-zinc-400 hover:text-zinc-900'"
              >
                {{ cat }}
              </button>
            </div>
            
            <div class="h-6 w-px bg-zinc-200 mx-0.5"></div>
            
            <!-- 配置按钮 -->
            <button @click="showConfigModal = true" class="w-8 h-8 flex items-center justify-center border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all rounded-0" title="Registry Config">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.756 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.756 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.756 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.756 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.756 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.756 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.756 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>

            <div class="h-6 w-px bg-zinc-200 mx-0.5"></div>

            <!-- 部署按钮：精准复刻 action_link.html -->
            <router-link to="/tools/publish" class="text-[11px] font-black text-zinc-900 border-b-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all px-2 py-0.5 tracking-widest uppercase">
              + DEPLOY_ASSET
            </router-link>
          </div>
        </div>

        <!-- 工具网格：使用 TransitionGroup 增强排序时的视觉流畅度 -->
        <transition-group 
          tag="div" 
          name="list"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          <ToolCard 
            v-for="tool in filteredTools" 
            :key="tool.name"
            v-bind="tool"
          />
        </transition-group>

        <!-- 空状态提示 -->
        <div v-if="filteredTools.length === 0" class="py-20 text-center">
          <p class="text-zinc-400 text-[11px] font-black uppercase tracking-widest italic">No matching protocols found in archive.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/**
 * 丝滑重排动画方案：
 * 1. list-move: 负责正在移动的卡片（平滑滑位）。
 * 2. list-enter/leave: 负责显示和消失。
 * 3. leave-active + absolute: 核心！让离开的元素不占位，使其他元素能立即平滑移动。
 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* 关键：防止离开时的跳动与重影 */
.list-leave-active {
  position: absolute;
  /* 必须根据网格列数锁定宽度，防止 absolute 导致宽度塌陷产生重影 */
  width: calc((100% - (4 * 1.5rem)) / 5); /* 适配 5 列布局，减去 gap */
}

/* 针对不同屏幕宽度的响应式宽度锁定 */
@media (max-width: 1280px) {
  .list-leave-active { width: calc((100% - (2 * 1.5rem)) / 3); }
}
@media (max-width: 1024px) {
  .list-leave-active { width: calc((100% - (1 * 1.5rem)) / 2); }
}
@media (max-width: 640px) {
  .list-leave-active { width: 100%; }
}
</style>
