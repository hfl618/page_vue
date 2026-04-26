<script setup>
/**
 * @description 工业风标签原子组件
 * 支持高度自定义颜色、背景、边框及尺寸。
 */
defineProps({
  // 文字颜色
  colorClass: { type: String, default: 'text-zinc-400' },
  // 背景颜色 (建议使用浅色系)
  bgClass: { type: String, default: 'bg-transparent' },
  // 边框颜色
  borderColorClass: { type: String, default: 'border-zinc-100' },
  // 字体加粗程度
  bold: { type: Boolean, default: true }
})
</script>

<template>
  <span 
    class="border px-1.5 py-0.5 text-[8px] uppercase tracking-wider inline-flex items-center justify-center transition-colors"
    :class="[
      colorClass,
      bgClass,
      borderColorClass,
      bold ? 'font-black' : 'font-bold',
      $attrs.class
    ]"
  >
    <slot></slot>
  </span>
</template>
