import { useUiStore } from '@/store/ui'

/**
 * @description 获取资源完整 URL (R2 协议自愈增强版)
 * 特性：
 * 1. 域名统一：强制将 .r2.dev 替换为 618002.xyz
 * 2. 缓存击穿：增加随机指纹，确保覆盖上传后浏览器能立即看到新图
 */
export function getAssetUrl(path) {
  if (!path) return ''
  
  let cleanPath = String(path).trim()
  const customDomain = 'https://618002.xyz'
  
  // A. 处理绝对地址
  if (cleanPath.startsWith('http')) {
    // 1. 域名替换
    if (cleanPath.includes('.r2.dev')) {
      cleanPath = cleanPath.replace(/https:\/\/[^/]+/, customDomain)
    }
  } 
  // B. 处理相对路径
  else if (cleanPath.startsWith('tools/inventory/') || cleanPath.startsWith('inventory-assets/')) {
    cleanPath = `${customDomain}/${cleanPath}`
  }
  // C. 本地 fallback
  else {
    cleanPath = `/api${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`
  }

  // 工业级加固：为 R2 资源增加缓存击穿参数 (10分钟一个批次)
  if (cleanPath.includes(customDomain)) {
    const fingerprint = Math.floor(Date.now() / 600000) 
    cleanPath += `${cleanPath.includes('?') ? '&' : '?'}v=${fingerprint}`
  }

  return cleanPath
}

/**
 * @description 格式化货币
 */
export function formatCurrency(value, symbol = null) {
  const uiStore = useUiStore()
  const currentSymbol = symbol || uiStore.settings.currencySymbol
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  return `${currentSymbol}${num.toFixed(2)}`
}
