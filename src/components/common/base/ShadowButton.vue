<script setup>
/**
 * ShadowButton 原子组件：
 * 还原 Nexus Hub 标志性的硬阴影物理按钮。
 * 
 * @props {String} type - 按钮类型 (primary, secondary, danger)
 * @props {Boolean} disabled - 禁用状态
 */
defineProps({
  type: { type: String, default: 'primary' },
  disabled: Boolean
})

const emit = defineEmits(['click'])
</script>

<template>
  <button 
    @click="emit('click')"
    :disabled="disabled"
    class="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all relative active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed"
    :class="{
      'bg-zinc-900 text-white shadow-[4px_4px_0px_#f4f4f5] hover:bg-black': type === 'primary',
      'bg-white text-zinc-900 border border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] hover:bg-zinc-50': type === 'secondary',
      'bg-red-50 text-red-600 border border-red-200 shadow-[4px_4px_0px_#fef2f2] hover:bg-red-100': type === 'danger'
    }"
  >
    <slot></slot>
  </button>
</template>
