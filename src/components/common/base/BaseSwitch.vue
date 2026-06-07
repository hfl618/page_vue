<script setup>
/**
 * @description 工业级逻辑开关原子组件 (BaseSwitch)
 * 支持：物理位移、尺寸自适应、自定义颜色
 */
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // 尺寸: 'sm' (w-7) | 'md' (w-9)
  size: { type: String, default: 'md' },
  // 形状: 'sharp' | 'rounded'
  shape: { type: String, default: 'sharp' },
  activeColor: { type: String, default: 'bg-zinc-900 border-zinc-900' },
  inactiveColor: { type: String, default: 'bg-zinc-100 border-zinc-200' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const toggle = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 尺寸规格映射
const sizeClasses = {
  sm: {
    track: 'w-7 h-4 p-0.5',
    thumb: 'w-2.5 h-full',
    translate: 'translate-x-3'
  },
  md: {
    track: 'w-9 h-5 p-0.5',
    thumb: 'w-3.5 h-full',
    translate: 'translate-x-4.5'
  }
}

const currentSize = sizeClasses[props.size] || sizeClasses.md
</script>

<template>
  <div 
    @click.stop="toggle"
    class="flex items-center cursor-pointer border transition-all duration-300 select-none relative overflow-hidden"
    :class="[
      currentSize.track,
      shape === 'sharp' ? 'rounded-none' : 'rounded-full',
      modelValue ? activeColor : inactiveColor
    ]"
  >
    <!-- 滑块实体 -->
    <div 
      class="bg-white shadow-sm transition-all duration-300 ease-in-out"
      :class="[
        currentSize.thumb,
        shape === 'sharp' ? 'rounded-none' : 'rounded-full',
        modelValue ? currentSize.translate : 'translate-x-0'
      ]"
    ></div>
  </div>
</template>

<style scoped>
/* 确保点击反馈稳定 */
div:active { transform: scale(0.96); }
</style>
