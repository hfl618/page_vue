<script setup>
/**
 * @description 基础输入框原子组件 (全自定义版)
 */
defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' },
  success: { type: Boolean, default: false },
  
  // 自定义背景
  bgClass: { type: String, default: 'bg-zinc-50/30' },
  // 自定义文字颜色
  colorClass: { type: String, default: 'text-zinc-900' },
  // 自定义边框颜色
  borderColorClass: { type: String, default: 'border-zinc-200' },
  // 自定义聚焦时的边框颜色
  focusBorderClass: { type: String, default: 'focus:border-black' },
  // 额外的 input class
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
        class="w-full border rounded-lg px-4 outline-none transition-all font-bold"
        :class="[
          // 默认 py-2.5，如果外部传入了 py- 或 h- 则不应用
          $attrs.class && ($attrs.class.includes('py-') || $attrs.class.includes('h-')) ? '' : 'py-2.5',
          
          error ? 'border-red-500 bg-red-50/30' : (success ? 'border-emerald-500 bg-emerald-50/30' : `${borderColorClass} ${bgClass} ${focusBorderClass}`),
          
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          colorClass,
          inputClass
        ]"
      >
      <slot name="suffix"></slot>
    </div>
    <p v-if="error" class="mt-1 text-[9px] font-black text-red-500 uppercase tracking-tight pl-1">
      {{ error }}
    </p>
  </div>
</template>
