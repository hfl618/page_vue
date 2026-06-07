<script setup>
/**
 * @description 基础按钮原子组件 (工业风重构版)
 * 支持：高度定制的圆角、阴影、变体和 Loading 状态
 */
const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  
  // 风格变体: primary (黑色实心), secondary (白色描边), custom
  variant: { type: String, default: 'primary' },
  
  // 尺寸扩展
  radius: { type: String, default: 'rounded-none' }, // 工业风默认直角
  shadow: { type: String, default: 'shadow-[4px_4px_0px_#f4f4f5]' }, // 默认硬阴影
  
  colorClass: { type: String, default: 'bg-zinc-900 text-white border-zinc-900' },
  hoverClass: { type: String, default: 'hover:bg-zinc-800' }
})
</script>

<template>
  <component 
    :is="to ? 'router-link' : (href ? 'a' : 'button')"
    :type="(!to && !href) ? type : undefined"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    class="text-[11px] font-black uppercase tracking-widest transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden border"
    :class="[
      // 默认宽度控制
      $attrs.class && $attrs.class.includes('w-') ? '' : 'px-8 py-3',
      
      radius,
      !disabled && !loading ? shadow : '',

      // 变体选择
      variant === 'primary' ? `${colorClass} ${hoverClass}` : '',
      variant === 'secondary' ? 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-50' : '',
      variant === 'custom' ? `${colorClass} ${hoverClass}` : ''
    ]"
  >
    <template v-if="loading">
      <div class="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white animate-spin shrink-0"></div>
      <span class="leading-none">Processing...</span>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </component>
</template>

<style scoped>
button, a {
  min-height: 2.2rem;
  box-sizing: border-box;
}
</style>
