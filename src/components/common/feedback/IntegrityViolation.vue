<script setup>
import { useUiStore } from '@/store/ui'

/**
 * @description 核心完整性违规兜底组件
 * 当系统发生不可恢复的运行时错误时展示。
 */
const uiStore = useUiStore()

const router = useRouter()

const handleReset = () => {
  uiStore.resetIntegrity()
}

const handleExit = () => {
  router.push('/')
}
</script>

<template>
  <div v-if="uiStore.integrityError" class="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center p-6 font-mono">
    <div class="max-w-2xl w-full border-2 border-red-600 bg-zinc-900 p-8 shadow-[8px_8px_0px_#7f1d1d]">
      <!-- 头部装饰 -->
      <div class="flex items-center justify-between border-b border-red-900/30 pb-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-red-600 animate-pulse"></div>
          <h2 class="text-red-600 font-black text-xl tracking-[0.2em] uppercase">Core Integrity Violation</h2>
        </div>
        <span class="text-zinc-600 text-xs">ERR_PROTOCOL_CRASH</span>
      </div>

      <!-- 错误内容 -->
      <div class="space-y-4 mb-8">
        <p class="text-zinc-400 text-sm leading-relaxed">
          The system core has encountered an unrecoverable protocol violation. All active operations have been suspended to prevent data corruption.
        </p>
        
        <div class="bg-black/50 border border-zinc-800 p-4 overflow-auto max-h-48 custom-scrollbar">
          <div class="text-red-500/80 text-xs mb-2">>> FAULT_LOG:</div>
          <code class="text-zinc-500 text-[10px] whitespace-pre-wrap break-all">
            {{ uiStore.integrityError.message }}
            <br><br>
            {{ uiStore.integrityError.stack }}
          </code>
        </div>
        
        <div class="text-[10px] text-zinc-600 flex justify-between">
          <span>TIMESTAMP: {{ uiStore.integrityError.timestamp }}</span>
          <span>NODE: HEFLOS_LOCAL_CORE</span>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="flex justify-end gap-4">
        <BaseButton 
          variant="custom" 
          color-class="bg-zinc-800 text-zinc-400 border-zinc-700"
          hover-class="hover:bg-zinc-700"
          @click="handleExit"
        >
          Exit to Root
        </BaseButton>
        <BaseButton 
          variant="custom" 
          color-class="bg-red-600 text-white border-red-700"
          hover-class="hover:bg-red-500"
          @click="handleReset"
        >
          Initiate Core Reset
        </BaseButton>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
      <div v-for="i in 20" :key="i" class="text-[8px] whitespace-nowrap mb-1">
        PROTOCOL_VIOLATION_DETECTION_SUBROUTINE_ACTIVE_MEM_DUMP_0x{{(Math.random()*0xFFFFFF<<0).toString(16).toUpperCase()}}
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
</style>
