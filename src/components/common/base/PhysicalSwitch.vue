<script setup>
/**
 * @description 物理级直角逻辑开关 (支持自定义颜色)
 */
const props = defineProps({
  modelValue: Boolean,
  activeColor: { type: String, default: 'bg-zinc-900' },
  inactiveColor: { type: String, default: 'bg-zinc-200' }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button 
    @click.prevent="toggle"
    class="w-10 h-5 transition-all duration-300 rounded-0 flex items-center p-1 relative outline-none"
    :class="modelValue ? activeColor : inactiveColor"
  >
    <div 
      class="w-3 h-3 bg-white shadow-sm transition-all duration-300"
      :style="{ transform: modelValue ? 'translateX(20px)' : 'translateX(0)' }"
    ></div>
  </button>
</template>
