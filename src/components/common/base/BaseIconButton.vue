<script setup>
/**
 * @description 工业风小方块图标按钮 (增强版)
 * 支持物理反馈、禁用状态、局部转圈反馈及事件透传。
 */
defineProps({
  active: { type: [Boolean, Number], default: false },
  activeClass: { type: String, default: 'text-zinc-900 border-zinc-900' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})
</script>

<template>
  <button 
    v-bind="$attrs"
    :disabled="disabled || loading"
    class="w-[30px] h-[30px] border flex items-center justify-center bg-white transition-all duration-200 outline-none shadow-[2px_2px_0px_#f4f4f5] relative"
    :class="[
      // 基础样式：正在加载时也禁用位移，防止视觉错位
      !disabled && !loading ? 'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer' : 'opacity-70 cursor-not-allowed',
      // 颜色状态
      active ? activeClass : 'text-zinc-300 border-zinc-100 hover:border-zinc-900 hover:text-zinc-900',
    ]"
  >
    <template v-if="loading">
      <!-- 极简工业旋转器 -->
      <div class="w-3.5 h-3.5 border-2 border-zinc-200 border-t-zinc-900 animate-spin rounded-full"></div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>
