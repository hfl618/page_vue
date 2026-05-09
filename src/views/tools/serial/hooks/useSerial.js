import { ref, reactive, onUnmounted } from 'vue'

/**
 * @description WebSerial 核心逻辑 Hook
 */
export function useSerial() {
  const port = ref(null)
  const reader = ref(null)
  const isConnected = ref(false)
  const logs = ref([])
  const stats = reactive({ rx: 0, tx: 0 })
  const config = reactive({
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none'
  })

  /**
   * @description 请求并打开串口
   */
  const connect = async () => {
    try {
      if (!navigator.serial) {
        throw new Error('WebSerial API not supported in this browser.')
      }
      port.value = await navigator.serial.requestPort()
      await port.value.open(config)
      isConnected.value = true
      startReadLoop()
      return { success: true }
    } catch (e) {
      console.error('Serial Connection Error:', e)
      return { success: false, error: e.message }
    }
  }

  /**
   * @description 断开连接
   */
  const disconnect = async () => {
    try {
      isConnected.value = false
      if (reader.value) {
        await reader.value.cancel()
        reader.value = null
      }
      if (port.value) {
        await port.value.close()
        port.value = null
      }
    } catch (e) {
      console.error('Disconnect Error:', e)
    }
  }

  /**
   * @description 读取循环
   */
  const startReadLoop = async () => {
    while (port.value?.readable && isConnected.value) {
      const currentReader = port.value.readable.getReader()
      reader.value = currentReader
      try {
        while (true) {
          const { value, done } = await currentReader.read()
          if (done) break
          
          stats.rx += value.length
          const text = new TextDecoder().decode(value)
          
          logs.value.push({
            id: Date.now() + Math.random(),
            type: 'rx',
            time: new Date().toLocaleTimeString(),
            content: text
          })
          
          // 限制日志长度防止性能问题
          if (logs.value.length > 1000) logs.value.shift()
        }
      } catch (err) {
        console.error('Read Loop Error:', err)
        break
      } finally {
        currentReader.releaseLock()
      }
    }
    // 如果循环结束且仍标记为已连接，说明可能是非正常断开（如拔出设备）
    if (isConnected.value) {
      disconnect()
    }
  }

  /**
   * @description 发送数据
   */
  const sendData = async (data, lineEnding = '\r\n') => {
    if (!port.value?.writable || !isConnected.value) return
    
    const writer = port.value.writable.getWriter()
    try {
      const encoder = new TextEncoder()
      const payload = data + lineEnding
      await writer.write(encoder.encode(payload))
      stats.tx += payload.length
      logs.value.push({
        id: Date.now() + Math.random(),
        type: 'tx',
        time: new Date().toLocaleTimeString(),
        content: data
      })
    } catch (e) {
      console.error('Send Error:', e)
    } finally {
      writer.releaseLock()
    }
  }

  const clearLogs = () => {
    logs.value = []
    stats.rx = 0
    stats.tx = 0
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    logs,
    stats,
    config,
    connect,
    disconnect,
    sendData,
    clearLogs
  }
}
