<script setup>
/**
 * @description 基础文本域原子组件
 */
defineProps({
  modelValue: [String, Number],
  placeholder: String,
  rows: { type: Number, default: 4 },
  required: Boolean,
  disabled: Boolean
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
      class="w-full px-4 py-2.5 text-[14px] border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:shadow-[2px_2px_0px_#f4f4f5] outline-none transition-all font-medium italic text-zinc-600 resize-none"
    ></textarea>
  </div>
</template>
