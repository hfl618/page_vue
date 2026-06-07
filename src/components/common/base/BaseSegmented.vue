<script setup>
/**
 * @description 工业风分段控制选择器 (Segmented Control)
 * 场景：多协议切换、模式选择、视图筛选
 */
const props = defineProps({
  modelValue: { type: [String, Number, Boolean], required: true },
  options: {
    type: Array,
    required: true,
    // 格式: [{ label: string, value: any, disabled?: boolean }]
  },
  // 是否占满全宽
  block: { type: Boolean, default: false },
  size: { type: String, default: 'md' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleSelect = (option) => {
  if (option.disabled || option.value === props.modelValue) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const sizeClasses = {
  sm: 'px-4 py-1 text-[9px]',
  md: 'px-6 py-1.5 text-[10px]',
  lg: 'px-8 py-2 text-[11px]'
}
</script>

<template>
  <div 
    :class="[
      'bg-zinc-100 p-1 border border-zinc-200 flex items-center gap-1 transition-all rounded-none',
      block ? 'w-full' : 'inline-flex'
    ]"
  >
    <button 
      v-for="opt in options" 
      :key="opt.value"
      type="button"
      @click="handleSelect(opt)"
      :disabled="opt.disabled"
      class="font-black uppercase tracking-widest transition-all duration-200 relative select-none whitespace-nowrap"
      :class="[
        sizeClasses[size],
        opt.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
        modelValue === opt.value 
          ? 'bg-white text-zinc-900 shadow-sm rounded-none border border-zinc-200/50' 
          : 'text-zinc-400 hover:text-zinc-600'
      ]"
    >
      <slot name="option" :option="opt">
        {{ opt.label }}
      </slot>

      <!-- 选中时的微小指示器 (可选) -->
      <div v-if="modelValue === opt.value" class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-zinc-900 hidden"></div>
    </button>
  </div>
</template>

<style scoped>
/* 极致工业感：按钮点击无位移，保持结构稳定 */
button:active { transform: scale(0.98); }
</style>
