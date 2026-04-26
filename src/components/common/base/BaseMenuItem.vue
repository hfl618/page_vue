<script setup>
/**
 * @description 工业风菜单项组件 (增强版)
 * 支持自定义字体颜色、大小、字重及统一的悬停反馈。
 */
defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  active: { type: Boolean, default: false },
  // 自定义文字颜色 (常态)
  colorClass: { type: String, default: 'text-zinc-600' },
  // 自定义激活时的颜色
  activeColorClass: { type: String, default: 'text-zinc-900' },
  // 自定义字体大小 (Tailwind 类)
  sizeClass: { type: String, default: 'text-[11px]' },
  // 是否加粗
  bold: { type: Boolean, default: true }
})
</script>

<template>
  <component 
    :is="to ? 'router-link' : (href ? 'a' : 'button')"
    :to="to"
    :href="href"
    class="w-full flex items-center gap-3 px-3 py-2 transition-all group outline-none uppercase tracking-widest"
    :class="[
      active ? `bg-zinc-50 ${activeColorClass}` : `hover:bg-zinc-50 ${colorClass}`,
      sizeClass,
      bold ? 'font-black' : 'font-bold'
    ]"
  >
    <!-- 图标插槽 -->
    <div class="shrink-0 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 transition-colors">
      <slot name="icon"></slot>
    </div>

    <!-- 文字内容 -->
    <span class="group-hover:text-zinc-900 transition-colors whitespace-nowrap">
      <slot></slot>
    </span>
  </component>
</template>
