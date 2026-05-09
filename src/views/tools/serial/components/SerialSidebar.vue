<script setup>
const props = defineProps({
  isConnected: Boolean,
  config: Object,
  stats: Object
})

const emit = defineEmits(['toggle-connection', 'clear-logs'])

const baudRates = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600]
</script>

<template>
  <div class="w-64 bg-zinc-50 border-r border-zinc-100 flex flex-col p-5 shrink-0">
    <div class="mb-8">
      <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Configuration</div>
      
      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-[9px] font-black text-zinc-500 uppercase">Baud Rate</label>
          <select 
            v-model="config.baudRate"
            :disabled="isConnected"
            class="bg-white border border-zinc-200 p-2 text-[11px] font-bold outline-none focus:border-zinc-900 disabled:opacity-50"
          >
            <option v-for="rate in baudRates" :key="rate" :value="rate">{{ rate }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-black text-zinc-500 uppercase">Data Bits</label>
            <select v-model="config.dataBits" :disabled="isConnected" class="bg-white border border-zinc-200 p-2 text-[11px] font-bold">
              <option :value="8">8</option>
              <option :value="7">7</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[9px] font-black text-zinc-500 uppercase">Stop Bits</label>
            <select v-model="config.stopBits" :disabled="isConnected" class="bg-white border border-zinc-200 p-2 text-[11px] font-bold">
              <option :value="1">1</option>
              <option :value="2">2</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Control</div>
      <button 
        @click="emit('toggle-connection')"
        :class="isConnected ? 'bg-rose-600 hover:bg-rose-700' : 'bg-zinc-900 hover:bg-black'"
        class="w-full py-3 text-white text-[11px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
      >
        {{ isConnected ? 'Disconnect' : 'Connect' }}
      </button>
      
      <button 
        @click="emit('clear-logs')"
        class="w-full mt-3 py-2 border-2 border-zinc-900 text-zinc-900 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
      >
        Clear Terminal
      </button>
    </div>

    <div class="mt-auto pt-6 border-t border-zinc-100">
      <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Live Statistics</div>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-bold text-zinc-400 uppercase">Received</span>
          <span class="text-[12px] font-mono font-black text-zinc-900">{{ stats.rx }} B</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-bold text-zinc-400 uppercase">Transmitted</span>
          <span class="text-[12px] font-mono font-black text-zinc-900">{{ stats.tx }} B</span>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <div :class="isConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-200'" class="w-1.5 h-1.5 rounded-full"></div>
          <span class="text-[9px] font-black uppercase tracking-tighter" :class="isConnected ? 'text-emerald-600' : 'text-zinc-400'">
            {{ isConnected ? 'System Online' : 'System Offline' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
