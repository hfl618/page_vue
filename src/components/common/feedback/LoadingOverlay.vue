<script setup>
/**
 * @description 全局同步等待层 - 1:1 工业化物理还原版
 * 严格对标原版尺寸、阴影与模糊度。
 */
const uiStore = useUiStore()
</script>

<template>
  <Transition name="fade">
    <div v-if="uiStore.loading.show" class="fixed inset-0 z-[200000] flex items-center justify-center bg-white/10 backdrop-blur-xl" translate="no">
      
      <!-- 1:1 还原的外层容器 -->
      <div class="border border-zinc-900 shadow-[4px_4px_0px_rgba(0,0,0,0.15)] px-12 py-10 flex flex-col items-center gap-8" 
           style="background-color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(48px); -webkit-backdrop-filter: blur(48px);">
        
        <!-- 核心 Loader 单元 -->
        <div class="w-12 h-12 border-2 border-zinc-900/10 flex items-center justify-center relative">
          <div class="w-5 h-5 bg-zinc-900 heflos-loader-square"></div>
          <div class="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-zinc-900"></div>
          <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-zinc-900"></div>
        </div>
        
        <!-- 文本与进度单元 -->
        <div class="flex flex-col items-center gap-3">
          <div class="flex flex-col items-center text-center">
            <span class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">{{ uiStore.loading.title || 'LOADING' }}</span>
            <span class="text-[11px] font-black text-zinc-900 uppercase tracking-tight mt-1">{{ uiStore.loading.subtitle || 'ACCESSING ARCHIVE' }}</span>
          </div>
          
          <!-- 进度条系统 -->
          <div class="flex flex-col items-center gap-2 mt-4">
            <div class="w-56 h-1 bg-zinc-100 relative overflow-hidden">
              <div class="absolute inset-y-0 left-0 bg-zinc-900 transition-all duration-300" 
                   :style="{ width: uiStore.loading.percent + '%' }"></div>
            </div>
            <span class="text-[10px] font-mono font-black text-zinc-900">{{ Math.round(uiStore.loading.percent) }}%</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
