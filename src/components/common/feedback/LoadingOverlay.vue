<script setup>
/**
 * @description 全局同步等待层 - 工业化物理 2.0 版
 */
const uiStore = useUiStore()
</script>

<template>
  <Transition name="loading-zoom">
    <div v-if="uiStore.loading.show" class="fixed inset-0 z-[200000] flex items-center justify-center bg-white/10 backdrop-blur-xl" translate="no">
      
      <!-- 物理容器：增加进场缩放动画 -->
      <div class="loading-box border border-zinc-900 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] px-12 py-10 flex flex-col items-center gap-8 bg-white/80">
        
        <!-- 核心 Loader 单元 -->
        <div class="w-14 h-14 border-2 border-zinc-900/10 flex items-center justify-center relative">
          <div class="heflos-loader-square"></div>
          <!-- 装饰角 -->
          <div class="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-zinc-900"></div>
          <div class="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-zinc-900"></div>
        </div>
        
        <!-- 文本与进度 -->
        <div class="flex flex-col items-center gap-3">
          <div class="flex flex-col items-center text-center">
            <span class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">{{ uiStore.loading.title || 'TRANSMITTING' }}</span>
            <span class="text-[11px] font-black text-zinc-900 uppercase tracking-tight mt-1">{{ uiStore.loading.subtitle || 'SYNC_CORE_ACTIVE' }}</span>
          </div>
          
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
/* 容器缩放淡入动画 */
.loading-zoom-enter-active, .loading-zoom-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.loading-zoom-enter-from, .loading-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 核心方块：物理旋转、圆角、缩放动画 */
.heflos-loader-square {
  width: 24px;
  height: 24px;
  background-color: #18181b;
  animation: square-physics 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes square-physics {
  0% { 
    transform: rotate(0deg) scale(1); 
    border-radius: 0; 
  }
  50% { 
    transform: rotate(270deg) scale(0.4); 
    border-radius: 50%;
    background-color: #3f3f46;
  }
  100% { 
    transform: rotate(360deg) scale(1); 
    border-radius: 0; 
  }
}
</style>
