<script setup>
/**
 * PhysicalSwitch 原子组件：
 * 还原 Nexus Hub 标志性的直角物理逻辑开关。
 * 
 * @props {Boolean} modelValue - 绑定值
 * @props {String} activeColor - 激活时的背景色类名 (默认 bg-zinc-900)
 */
const props = defineProps({
  modelValue: Boolean,
  activeColor: { type: String, default: 'bg-zinc-900' }
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
    :class="modelValue ? activeColor : 'bg-zinc-200'"
  >
    <!-- 物理滑块：对标 3x3 纯方块 -->
    <div 
      class="w-3 h-3 bg-white shadow-sm transition-all duration-300"
      :style="{ transform: modelValue ? 'translateX(20px)' : 'translateX(0)' }"
    ></div>
  </button>
</template>
