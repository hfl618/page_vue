<script setup>
import { computed } from 'vue'

/**
 * @description 工业级选择器原子组件 (BaseSelect)
 * 支持：Ghost/Solid 变体、自动选项归一化、多种尺寸、错误状态、加载态。
 */
const props = defineProps({
  modelValue: [String, Number],
  // 选项：支持 ['A', 'B'] 或 [{label: 'A', value: '1'}]
  options: {
    type: Array,
    default: () => []
  },
  label: String,
  placeholder: String,
  // 变体: 'ghost' (无边框背景), 'solid' (标准工业边框)
  variant: { type: String, default: 'solid' },
  // 尺寸: 'xs', 'sm', 'md'
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  error: String,
  // 宽度是否铺满
  block: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object') return opt
    return { label: String(opt), value: opt }
  })
})

const sizeClasses = {
  xs: 'py-0.5 px-2 text-[8px]',
  sm: 'py-1.5 px-3 text-[10px]',
  md: 'py-2 px-4 text-[11px]'
}

const variantClasses = {
  solid: 'bg-white border border-zinc-200 focus:border-zinc-900 focus:shadow-[2px_2px_0px_#f4f4f5]',
  ghost: 'bg-transparent border-none focus:text-zinc-900'
}

const handleChange = (e) => {
  const val = e.target.value
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<template>
  <div 
    class="base-select-container flex flex-col gap-1.5" 
    :class="[
      block ? 'w-full' : 'w-auto',
      disabled ? 'opacity-40 pointer-events-none' : ''
    ]"
  >
    <!-- Label -->
    <label v-if="label" class="text-[9px] font-black text-zinc-400 uppercase tracking-widest px-0.5">
      {{ label }}
    </label>

    <div class="relative group">
      <select
        :value="modelValue"
        @change="handleChange"
        class="w-full outline-none transition-all font-black uppercase tracking-widest cursor-pointer appearance-none rounded-none"
        :class="[
          sizeClasses[size],
          variantClasses[variant],
          error ? '!border-red-500' : ''
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <slot>
          <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </slot>
      </select>

      <!-- 工业风箭头图标 -->
      <div 
        class="absolute pointer-events-none transition-colors"
        :class="[
          variant === 'ghost' ? 'right-0' : 'right-3',
          'top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-zinc-900'
        ]"
      >
        <svg 
          :class="size === 'xs' ? 'w-2 h-2' : 'w-3 h-3'"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Error Message -->
    <span v-if="error" class="text-[8px] font-bold text-red-500 uppercase tracking-tighter px-0.5">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
/* 移除原生滚动条样式以对齐 UI */
select::-ms-expand {
  display: none;
}
option {
  background: white;
  color: #18181b;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
