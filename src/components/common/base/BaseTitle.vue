<script setup>
/**
 * @description 工业风统一标题组件
 */
defineProps({
  // 标题等级：h1, h2, h3, h4
  level: { type: String, default: 'h1' },
  // 字体大小类名 (Tailwind)
  size: { type: String, default: '' },
  // 是否强制大写
  uppercase: { type: Boolean, default: true },
  // 是否紧凑字间距
  tight: { type: Boolean, default: true }
})
</script>

<template>
  <component 
    :is="level"
    class="text-zinc-900 leading-tight transition-colors"
    :class="[
      size,
      uppercase ? 'uppercase' : '',
      tight ? 'tracking-tighter' : '',
      'font-black' // 工业风默认使用最粗字重
    ]"
  >
    <slot></slot>
  </component>
</template>

<style scoped>
/* 可以在此处绑定 CSS 变量以备后用 */
h1, h2, h3, h4 {
  font-family: var(--font-main);
}
</style>
