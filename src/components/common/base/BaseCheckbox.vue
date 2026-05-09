<script setup>
/**
 * @description 高级通用复选框模块
 * 支持：圆角自定义、圆形切换、颜色自定义、图标自定义。
 */
const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Object], default: null },
  
  // 尺寸规格: 'sm' | 'md' | 'lg' | 或自定义类名
  size: { type: String, default: 'sm' },
  
  // 基础圆角类名: 'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-full' (圆形)
  radius: { type: String, default: 'rounded-sm' },
  
  // 选中时的背景/边框颜色
  colorClass: { type: String, default: 'bg-zinc-900 border-zinc-900 text-white' },
  
  // 选中时的图标 (Heroicons 名称或自定义)
  icon: { type: String, default: 'check' },
  
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isChecked = () => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
}

const toggle = () => {
  if (props.disabled) return
  
  let newValue
  if (Array.isArray(props.modelValue)) {
    newValue = [...props.modelValue]
    const index = newValue.indexOf(props.value)
    if (index > -1) newValue.splice(index, 1)
    else newValue.push(props.value)
  } else {
    newValue = !props.modelValue
  }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

// 预设尺寸映射
const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4.5 h-4.5',
  lg: 'w-6 h-6'
}
</script>

<template>
  <div 
    @click.stop="toggle"
    class="flex items-center justify-center border transition-all duration-200 cursor-pointer select-none group/checkbox"
    :class="[
      sizeMap[size] || size,
      radius,
      disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95',
      isChecked() ? colorClass : 'bg-white border-zinc-200 hover:border-zinc-400'
    ]"
  >
    <!-- 图标区：支持自定义插槽 -->
    <Transition name="scale">
      <div v-if="isChecked()" class="w-[85%] h-[85%] flex items-center justify-center">
        <slot name="icon">
          <!-- 默认对号 -->
          <svg v-if="icon === 'check'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <!-- 默认实心点 (用于圆形) -->
          <div v-else-if="icon === 'dot'" class="w-2 h-2 bg-current rounded-full"></div>
          <!-- 默认减号 (用于半选状态) -->
          <svg v-else-if="icon === 'minus'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.scale-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.scale-leave-active { transition: all 0.1s ease-in; }
.scale-enter-from, .scale-leave-to { transform: scale(0); opacity: 0; }

svg { width: 100%; height: 100%; }
</style>
