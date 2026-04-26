<script setup>
/**
 * @description 基础输入框原子组件 (工业风重构版)
 * 支持 standard (全边框) 和 underlined (仅下划线) 两种变体
 */
const props = defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: Boolean, default: false },
  variant: { type: String, default: 'standard' }, // standard, underlined
  
  // 允许外部覆盖核心样式
  inputClass: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full">
    <div class="relative group">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full outline-none transition-all font-black uppercase tracking-widest text-[11px] placeholder:text-zinc-300 placeholder:font-bold"
        :class="[
          // 变体基础样式
          variant === 'standard' ? 'border-2 border-zinc-100 bg-white px-4 py-2.5 focus:border-zinc-900' : 'border-b-2 border-zinc-100 bg-transparent px-0 py-2 focus:border-zinc-900',
          
          // 状态颜色
          error ? '!border-red-500 bg-red-50/30' : (success ? '!border-emerald-500 bg-emerald-50/30' : ''),
          
          disabled ? 'opacity-50 cursor-not-allowed' : 'text-zinc-900',
          
          inputClass
        ]"
      >
      <slot name="suffix"></slot>
    </div>
    <p v-if="error" class="mt-1 text-[8px] font-black text-red-500 uppercase tracking-tight pl-1">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
/* 确保 Chrome 记住密码时的背景色不会破坏工业风 */
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
