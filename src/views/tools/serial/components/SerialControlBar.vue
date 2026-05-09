<script setup>
import { ref } from 'vue'

const props = defineProps({
  isConnected: Boolean
})

const emit = defineEmits(['send'])

const inputMessage = ref('')
const lineEnding = ref('\r\n')

const handleSend = () => {
  if (inputMessage.value.trim()) {
    emit('send', inputMessage.value, lineEnding.value)
    inputMessage.value = ''
  }
}
</script>

<template>
  <div class="h-14 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 gap-4">
    <div class="flex-1 relative">
      <input 
        v-model="inputMessage"
        @keyup.enter="handleSend"
        type="text"
        placeholder="ENTER_COMMAND_DATA_HERE..."
        class="w-full bg-zinc-800 border border-zinc-700 text-white text-[12px] font-mono px-4 py-2 outline-none focus:border-zinc-500 transition-all"
        :disabled="!isConnected"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <select 
          v-model="lineEnding"
          class="bg-transparent text-[9px] font-black text-zinc-500 uppercase outline-none cursor-pointer"
        >
          <option value="\r\n">CRLF</option>
          <option value="\n">LF</option>
          <option value="">NONE</option>
        </select>
      </div>
    </div>
    
    <button 
      @click="handleSend"
      :disabled="!isConnected || !inputMessage.trim()"
      class="h-9 px-6 bg-white text-zinc-900 text-[11px] font-black uppercase tracking-widest hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all flex items-center gap-2"
    >
      <span>Execute</span>
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</template>
