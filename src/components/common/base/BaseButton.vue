<script setup>
/**
 * @description 基础按钮原子组件
 */
defineProps({
  type: { type: String, default: 'button' },
  disabled: Boolean,
  loading: Boolean,
  variant: { type: String, default: 'primary' } // primary, secondary, outline
})
</script>

<template>
  <!-- 父组件传入的 class (如 w-auto, px-10) 会自动应用到此 button 根节点 -->
  <button 
    :type="type" 
    :disabled="disabled || loading"
    class="w-full py-3 rounded-lg text-[13px] font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
    :class="[
      variant === 'primary' ? 'bg-zinc-900 text-white hover:bg-black' : '',
      variant === 'secondary' ? 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50' : '',
    ]"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <div class="w-3 h-3 border-2 border-zinc-400 border-t-white animate-spin rounded-full"></div>
      Loading...
    </span>
    <slot v-else></slot>
  </button>
</template>
