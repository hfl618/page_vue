<script setup>
/**
 * @description 通用工业级步进输入组件 (Step Input)
 * 常用于库存调整、数量选择等场景。
 */
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  label: { type: String, default: '' },
  min: { type: Number, default: -Infinity },
  max: { type: Number, default: Infinity },
  step: { type: Number, default: 1 },
  // 尺寸规格: 'sm' | 'md'
  size: { type: String, default: 'sm' },
  // 是否禁用输入，仅允许按钮操作
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleAdjust = (delta) => {
  const newValue = props.modelValue + delta
  if (newValue >= props.min && newValue <= props.max) {
    emit('update:modelValue', newValue)
    emit('change', newValue, delta)
  }
}

const handleInput = (e) => {
  if (props.readonly) return
  let val = parseInt(e.target.value)
  if (isNaN(val)) val = props.min !== -Infinity ? props.min : 0
  val = Math.max(props.min, Math.min(props.max, val))
  emit('update:modelValue', val)
  emit('change', val, 0)
}
</script>

<template>
  <div 
    :class="[
      'flex items-center border border-zinc-200 bg-white transition-colors hover:border-zinc-300',
      size === 'sm' ? 'px-1 py-0.5 gap-1.5' : 'px-2 py-1 gap-3'
    ]"
  >
    <!-- 标签区 -->
    <span v-if="label" :class="['font-black text-zinc-400 uppercase select-none', size === 'sm' ? 'text-[8px] px-1' : 'text-[10px] px-1.5']">
      {{ label }}:
    </span>

    <!-- 减少按钮 -->
    <button 
      @click="handleAdjust(-step)"
      :disabled="modelValue <= min"
      class="flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-sm"
      :class="size === 'sm' ? 'w-4 h-4 text-[12px]' : 'w-6 h-6 text-[14px]'"
    >
      -
    </button>

    <!-- 数值显示/输入 -->
    <input 
      :value="modelValue"
      @input="handleInput"
      :readonly="readonly"
      type="text"
      class="bg-transparent font-mono font-bold text-center text-zinc-900 outline-none p-0 border-none"
      :class="size === 'sm' ? 'text-[10px] w-8' : 'text-[12px] w-12'"
    >

    <!-- 增加按钮 -->
    <button 
      @click="handleAdjust(step)"
      :disabled="modelValue >= max"
      class="flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-sm"
      :class="size === 'sm' ? 'w-4 h-4 text-[12px]' : 'w-6 h-6 text-[14px]'"
    >
      +
    </button>
  </div>
</template>

<style scoped>
/* 隐藏 Chrome/Safari/Edge 的默认步进器箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* 隐藏 Firefox 的默认步进器箭头 */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
