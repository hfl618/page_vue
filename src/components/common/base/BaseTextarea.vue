<script setup>
/**
 * @description 基础文本域原子组件 (全自定义版)
 */
defineProps({
  modelValue: [String, Number],
  placeholder: String,
  rows: { type: Number, default: 4 },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  
  // 自定义背景
  bgClass: { type: String, default: 'bg-zinc-50' },
  // 自定义文字颜色
  colorClass: { type: String, default: 'text-zinc-600' },
  // 自定义边框
  borderColorClass: { type: String, default: 'border-zinc-200' },
  // 自定义聚焦效果
  focusClass: { type: String, default: 'focus:bg-white focus:border-zinc-900 focus:shadow-[2px_2px_0px_#f4f4f5]' }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full text-left">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      class="w-full px-4 py-2.5 text-[14px] border outline-none transition-all font-medium italic resize-none"
      :class="[
        bgClass,
        colorClass,
        borderColorClass,
        focusClass,
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      ]"
    ></textarea>
  </div>
</template>
