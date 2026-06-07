<script setup>
import { computed } from 'vue'

/**
 * @description 极致简约工业风代码块 (物理加固增强版)
 * 支持 字符串/对象/数组 自动序列化，彻底解决 [object Object] 显示问题
 */
const props = defineProps({
  label: String,
  code: [String, Object, Array],
  active: Boolean,
  showCopy: { type: Boolean, default: true }
})

// 物理加固：自动处理非字符串数据
const displayCode = computed(() => {
  if (!props.code) return '--'
  if (typeof props.code === 'string') return props.code
  try {
    return JSON.stringify(props.code, null, 2)
  } catch (e) {
    return String(props.code)
  }
})

const handleCopy = () => {
  navigator.clipboard.writeText(displayCode.value)
}
</script>

<template>
  <div class="base-code-block group">
    <!-- 1. 顶层标签 (精密小字) -->
    <div v-if="label" class="flex items-center justify-between mb-1 px-0.5">
      <div class="flex items-center gap-2">
        <div class="w-1 h-1 bg-zinc-200" :class="{ 'bg-amber-400 animate-pulse': active }"></div>
        <span class="text-[7px] font-bold text-zinc-300 uppercase tracking-widest">{{ label }}</span>
      </div>
      <button v-if="showCopy" @click="handleCopy" class="text-[7px] font-black text-zinc-300 hover:text-zinc-900 transition-colors uppercase opacity-0 group-hover:opacity-100 tracking-tighter">[ COPY_STREAM ]</button>
    </div>

    <!-- 2. 纯净容器 -->
    <div 
      class="bg-zinc-50/50 border border-zinc-100 p-3 rounded-sm transition-all"
      :class="{ 'border-zinc-200 bg-white shadow-inner': active }"
    >
      <code class="text-[10px] font-mono font-bold text-zinc-500 break-all select-all leading-relaxed block whitespace-pre-wrap">
        <slot>{{ displayCode }}</slot>
      </code>
    </div>
  </div>
</template>

<style scoped>
.base-code-block { width: 100%; }
</style>
