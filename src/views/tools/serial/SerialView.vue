<script setup>
import { ref } from 'vue'
import { useSerial } from './hooks/useSerial'
import SerialSidebar from './components/SerialSidebar.vue'
import SerialTerminal from './components/SerialTerminal.vue'
import SerialControlBar from './components/SerialControlBar.vue'

/**
 * @description 串口分析工具主视图
 */
const { 
  isConnected, 
  logs, 
  stats, 
  config, 
  connect, 
  disconnect, 
  sendData, 
  clearLogs 
} = useSerial()

const autoScroll = ref(true)

const handleToggleConnection = async () => {
  if (isConnected.value) {
    await disconnect()
  } else {
    const result = await connect()
    if (!result.success) {
      // 如果有全局通知组件可以在这里调用
      alert(`Connection Failed: ${result.error}`)
    }
  }
}
</script>

<template>
  <div class="absolute inset-0 flex flex-col bg-white overflow-hidden min-w-[800px]">
    <!-- 顶部状态提示 -->
    <div v-if="!isConnected" class="h-9 shrink-0 bg-amber-50 border-b border-amber-100 px-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
        <span class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Uplink Offline: Hardware authorization required.</span>
      </div>
      <span class="text-[9px] font-bold text-amber-400 uppercase tracking-tighter italic">Waiting for serial port request...</span>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <!-- 侧边栏配置 -->
      <SerialSidebar 
        :is-connected="isConnected" 
        :config="config" 
        :stats="stats"
        @toggle-connection="handleToggleConnection"
        @clear-logs="clearLogs"
      />

      <!-- 主终端区 -->
      <div class="flex-1 flex flex-col min-w-0">
        <SerialTerminal 
          :logs="logs" 
          :auto-scroll="autoScroll"
        />
        
        <!-- 发送控制栏 -->
        <SerialControlBar 
          :is-connected="isConnected"
          @send="sendData"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 针对串口工具的局部样式微调 */
</style>
