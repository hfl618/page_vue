<script setup>
/**
 * @description 基础按钮原子组件 (支持自定义颜色、链接与高度)
 */
defineProps({
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  variant: { type: String, default: 'primary' }, // primary, secondary, custom
  colorClass: { type: String, default: 'bg-zinc-900 text-white' },
  hoverClass: { type: String, default: 'hover:bg-black' }
})
</script>

<template>
  <component 
    :is="to ? 'router-link' : (href ? 'a' : 'button')"
    :type="(!to && !href) ? type : undefined"
    :to="to"
    :href="href"
    :disabled="disabled || loading"
    class="w-full rounded-lg text-[13px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    :class="[
      // 如果 class 中没有 py- 或 h-，则应用默认高度 py-3
      $attrs.class && ($attrs.class.includes('py-') || $attrs.class.includes('h-')) ? '' : 'py-3',
      variant === 'primary' ? 'bg-zinc-900 text-white hover:bg-black border border-zinc-900' : '',
      variant === 'secondary' ? 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50' : '',
      variant === 'custom' ? `${colorClass} ${hoverClass}` : ''
    ]"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <div class="w-3 h-3 border-2 border-zinc-400 border-t-white animate-spin rounded-full"></div>
      Loading...
    </span>
    <slot v-else></slot>
  </component>
</template>
