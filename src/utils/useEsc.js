import { onMounted, onUnmounted } from 'vue'

// 简单的全局事件总线
const escSubscribers = new Set()

/**
 * @description 全局 Esc 按键监听 Hook
 * @param {Function} callback 当按下 Esc 时执行的回调
 */
export function useEsc(callback) {
  if (!callback) return

  onMounted(() => {
    escSubscribers.add(callback)
  })

  onUnmounted(() => {
    escSubscribers.delete(callback)
  })
}

/**
 * @description 触发全局 Esc 信号 (供根组件调用)
 */
export function triggerGlobalEsc(event) {
  const subscriberCount = escSubscribers.size
  console.debug(`[Global_Esc] Processing signal. active_subscribers: ${subscriberCount}`)
  
  if (subscriberCount === 0) return

  // 逆序执行，模拟冒泡：最后一个注册的先执行
  const handlers = Array.from(escSubscribers).reverse()
  for (const handler of handlers) {
    try {
      const isHandled = handler(event)
      if (isHandled === true) {
        console.debug('[Global_Esc] Protocol handled and consumed.')
        // 如果订阅者返回 true，则停止事件进一步分发
        event.preventDefault()
        event.stopPropagation()
        break
      }
    } catch (e) {
      console.error('[Global_Esc] Subscriber execution failure:', e)
    }
  }
}
