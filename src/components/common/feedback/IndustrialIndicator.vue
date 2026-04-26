<script setup>
/**
 * @description 工业风状态指示器
 * 常用于 Loading, Offline, Sync 等场景。
 */
defineProps({
  animate: { type: Boolean, default: true },
  size: { type: String, default: 'w-20 h-20' }
})
</script>

<template>
  <div :class="[size, 'border-2 border-zinc-900 flex items-center justify-center relative bg-white']">
    <div :class="['w-8 h-8 bg-zinc-900', animate ? 'animate-pulse' : '']"></div>
    <div class="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-zinc-900"></div>
    <div class="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-zinc-900"></div>
  </div>
</template>
