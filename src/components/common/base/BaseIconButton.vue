<script setup>
/**
 * @description 工业风图标按钮原子组件 (通用增强版)
 * 支持：物理实体风格 (solid) 和 极简透明风格 (ghost)
 */
defineProps({
  active: { type: [Boolean, Number], default: false },
  activeClass: { type: String, default: 'text-zinc-900 border-zinc-900' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  
  // 风格变体: 'solid' (带边框阴影) | 'ghost' (透明无阴影)
  variant: { type: String, default: 'solid' },
  
  // 边框样式: 'solid' | 'dashed' | 'dotted' | 'none'
  borderStyle: { type: String, default: 'solid' },
  
  // 尺寸类名: 默认 w-[30px] h-[30px]
  size: { type: String, default: 'w-[30px] h-[30px]' },
  
  // 圆角类名: 默认无圆角
  radius: { type: String, default: 'rounded-none' }
})
</script>

<template>
  <button 
    v-bind="$attrs"
    :disabled="disabled || loading"
    class="flex items-center justify-center transition-all duration-200 outline-none relative"
    :class="[
      size, radius,
      
      // 1. 基础交互状态
      !disabled && !loading ? 'active:translate-x-0.5 active:translate-y-0.5 cursor-pointer' : 'opacity-40 cursor-not-allowed',
      
      // 2. 风格变体逻辑
      variant === 'solid' 
        ? 'bg-white border shadow-[2px_2px_0px_#f4f4f5] active:shadow-none text-zinc-300 border-zinc-100 hover:border-zinc-900 hover:text-zinc-900' 
        : 'bg-transparent border-none text-zinc-300 hover:bg-zinc-100 hover:text-zinc-900',
      
      // 3. 边框样式 (仅在 solid 或非 none 时生效)
      variant === 'solid' ? (
        borderStyle === 'dashed' ? 'border-dashed' : (borderStyle === 'dotted' ? 'border-dotted' : 'border-solid')
      ) : '',
      
      // 4. 激活状态覆盖
      active ? activeClass : ''
    ]"
  >
    <template v-if="loading">
      <div class="w-3.5 h-3.5 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full"></div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>
