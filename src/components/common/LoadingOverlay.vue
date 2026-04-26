<script setup>
import { useUiStore } from '@/store/ui'
const uiStore = useUiStore()
</script>

<template>
  <Transition name="fade">
    <div v-if="uiStore.loading.show" class="fixed inset-0 z-[200000] flex items-center justify-center bg-zinc-900/10 backdrop-blur-xl" translate="no">
      <!-- 物理复原：半透明面板与毛玻璃 -->
      <div class="border border-zinc-900 shadow-[12px_12px_0px_rgba(24,24,27,0.1)] px-16 py-12 flex flex-col items-center gap-10 bg-white/40 backdrop-blur-[32px] animate-in zoom-in-95 duration-300">
        
        <div class="w-16 h-16 border-2 border-zinc-900/10 flex items-center justify-center relative">
          <div class="w-6 h-6 bg-zinc-900 loader-square-kinetic"></div>
          <div class="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-zinc-900"></div>
          <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-zinc-900"></div>
        </div>

        <div class="flex flex-col items-center gap-3">
          <div class="flex flex-col items-center text-center">
            <span class="text-[9px] font-black text-zinc-400 uppercase tracking-[0.4em]">{{ uiStore.loading.title || 'TRANSMITTING' }}</span>
            <span class="text-[12px] font-black text-zinc-900 uppercase tracking-tight mt-1">{{ uiStore.loading.subtitle || 'Synchronizing with core...' }}</span>
          </div>
          <div class="flex items-center justify-center relative mt-4">
            <div class="w-8 mr-3"></div> 
            <div class="w-48 h-1 bg-zinc-100 relative overflow-hidden">
              <div class="absolute inset-y-0 left-0 bg-zinc-900 transition-all duration-700 ease-out" 
                   :style="`width: ${uiStore.loading.percent}%`"></div>
            </div>
            <span class="text-[10px] font-mono font-black text-zinc-900 w-8 text-right ml-3">{{ Math.round(uiStore.loading.percent) }}%</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader-square-kinetic { animation: square-morph 2s infinite cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes square-morph {
  0% { transform: rotate(0deg) scale(1); border-radius: 0; }
  50% { transform: rotate(180deg) scale(0.6); border-radius: 50%; }
  100% { transform: rotate(360deg) scale(1); border-radius: 0; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
