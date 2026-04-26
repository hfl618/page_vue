<script setup>
/**
 * @description 基础按钮原子组件 (物理稳定版)
 * 修复了 Loading 状态切换时可能产生的大小跳动 Bug。
 */
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
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
    class="rounded-lg text-[13px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden border-transparent"
    :class="[
      // 默认宽度全宽，除非外部传入 w-auto
      $attrs.class && $attrs.class.includes('w-') ? '' : 'w-full',
      // 默认 py-3，除非外部传入 py- 或 h-
      $attrs.class && ($attrs.class.includes('py-') || $attrs.class.includes('h-')) ? '' : 'py-3',
      // 变体风格
      variant === 'primary' ? `${colorClass} ${hoverClass} border-zinc-900` : '',
      variant === 'secondary' ? 'bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50' : '',
      variant === 'custom' ? `${colorClass} ${hoverClass}` : ''
    ]"
  >
    <!-- 使用统一的 Flex 布局，防止 Loading 切换时内容闪烁 -->
    <template v-if="loading">
      <div class="w-3.5 h-3.5 border-2 border-zinc-400 border-t-white animate-spin shrink-0"></div>
      <span class="leading-none">Loading...</span>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </component>
</template>

<style scoped>
/* 确保按钮在切换状态时，文字基线保持一致 */
button, a {
  min-height: 2rem; /* 降低保底最小高度，允许更小的按钮尺寸 */
  box-sizing: border-box;
}
</style>
