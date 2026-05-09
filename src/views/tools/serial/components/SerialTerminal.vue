<script setup>
import { ref, watch, onUpdated, nextTick } from 'vue'

const props = defineProps({
  logs: { type: Array, default: () => [] },
  autoScroll: { type: Boolean, default: true }
})

const terminalRef = ref(null)

const scrollToBottom = () => {
  if (terminalRef.value) {
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight
  }
}

watch(() => props.logs.length, () => {
  if (props.autoScroll) {
    nextTick(scrollToBottom)
  }
})
</script>

<template>
  <div 
    ref="terminalRef"
    class="flex-1 bg-zinc-950 p-4 font-mono text-[12px] overflow-y-auto custom-scrollbar selection:bg-zinc-700 selection:text-white"
  >
    <div v-for="log in logs" :key="log.id" class="mb-1 leading-relaxed break-all">
      <span class="text-zinc-600 mr-2">[{{ log.time }}]</span>
      <span :class="log.type === 'rx' ? 'text-emerald-400' : 'text-blue-400'">
        {{ log.type.toUpperCase() }}:
      </span>
      <span class="text-zinc-200 ml-2 whitespace-pre-wrap">{{ log.content }}</span>
    </div>
    
    <div v-if="logs.length === 0" class="h-full flex flex-col items-center justify-center opacity-20">
      <div class="text-[40px] font-black italic tracking-tighter">NO_DATA_STREAM</div>
      <div class="text-[10px] uppercase tracking-[0.4em] mt-2 font-black">Waiting for serial uplink...</div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}
</style>
