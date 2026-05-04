<script setup>
import { ref, watch, computed } from 'vue'

/**
 * @description 工业级原子化头像/图片展示组件
 */
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'Avatar' },
  // 尺寸：xs(24), sm(32), md(40), lg(48), xl(64) 或自定义数值(px)
  size: { type: [String, Number], default: 'md' },
  // 形状：circle(圆), square(方), rounded(工业微圆角 2px)
  shape: { type: String, default: 'square' },
  // 边框：none, thin(1px), thick(2px)
  border: { type: String, default: 'none' },
  // 边框样式：solid, dashed, dotted
  borderStyle: { type: String, default: 'solid' },
  // 边框颜色类
  borderColor: { type: String, default: 'border-zinc-900' },
  // 背景颜色类 (Tailwind)
  bgColor: { type: String, default: 'bg-zinc-100' },
  // 文字颜色类 (用于 Fallback 和 Slot)
  textColor: { type: String, default: 'text-zinc-400' },
  // 图片内边距 (用于图标容器效果，如 p-1.5)
  imgPadding: { type: String, default: 'p-0' },
  // 回退显示文字 (如用户首字母)
  fallbackText: { type: String, default: '?' },
  // 回退态的角度偏移 (工业戳印效果)
  angle: { type: Number, default: -5 },
  // 是否启用悬停提升效果
  hoverLift: { type: Boolean, default: false }
})

const status = ref('loading') // loading | success | error

// 计算容器尺寸
const sizeStyle = computed(() => {
  const presets = {
    xs: '24px', sm: '32px', md: '40px', lg: '48px', xl: '64px'
  }
  const s = presets[props.size] || (typeof props.size === 'number' ? `${props.size}px` : props.size)
  return { width: s, height: s }
})

// 计算形状类
const shapeClass = computed(() => {
  return {
    'circle': 'rounded-full',
    'square': 'rounded-none',
    'rounded': 'rounded-[2px]'
  }[props.shape]
})

// 计算边框类
const borderClass = computed(() => {
  const base = {
    'none': '',
    'thin': 'border',
    'thick': 'border-2'
  }[props.border]
  
  const style = {
    'solid': 'border-solid',
    'dashed': 'border-dashed',
    'dotted': 'border-dotted'
  }[props.borderStyle]

  // 使用传入的 borderColor
  return props.border === 'none' ? '' : `${base} ${style} ${props.borderColor}`
})

const handleLoad = () => { status.value = 'success' }
const handleError = () => { status.value = 'error' }

// 监听 src 变化，重置状态
watch(() => props.src, (newVal) => {
  if (newVal) status.value = 'loading'
  else status.value = 'error'
}, { immediate: true })
</script>

<template>
  <div 
    class="relative inline-flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300"
    :class="[
      shapeClass, 
      borderClass,
      bgColor,
      { 'hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(24,24,27,0.1)]': hoverLift }
    ]"
    :style="sizeStyle"
  >
    <!-- 1. 骨架屏加载态 (参考工具卡片逻辑) -->
    <div 
      v-if="status === 'loading' && src" 
      class="absolute inset-0 bg-zinc-200 animate-pulse z-20"
    ></div>

    <!-- 2. 图片主体 -->
    <div :class="['w-full h-full flex items-center justify-center', imgPadding]">
      <img 
        v-if="src"
        :src="src" 
        :alt="alt"
        loading="lazy"
        @load="handleLoad"
        @error="handleError"
        class="max-w-full max-h-full object-contain transition-opacity duration-500"
        :class="status === 'success' ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <!-- 3. 回退态 (错误、无图片或自定义 Slot) -->
    <div 
      v-if="status === 'error' || !src || $slots.default" 
      class="absolute inset-0 flex items-center justify-center text-zinc-400 select-none z-10"
    >
      <slot v-if="$slots.default"></slot>
      <span 
        v-else
        class="font-black italic uppercase tracking-tighter"
        :style="{ 
          transform: `rotate(${angle}deg)`,
          fontSize: `calc(${sizeStyle.width} * 0.35)`
        }"
      >
        {{ fallbackText }}
      </span>
    </div>

    <!-- 4. 工业蒙版 (装饰性压纹) -->
    <div v-if="border === 'thick'" class="absolute inset-0 pointer-events-none border border-black/5 z-30"></div>
  </div>
</template>

<style scoped>
/* 骨架屏动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
