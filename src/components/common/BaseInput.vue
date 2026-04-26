<script setup>
/**
 * @description 基础输入框原子组件
 */
defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  success: Boolean
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
        class="w-full border rounded-lg px-4 py-2.5 text-[14px] outline-none transition-all font-bold bg-zinc-50/30"
        :class="[
          error ? 'border-red-500 bg-red-50/30' : (success ? 'border-emerald-500 bg-emerald-50/30' : 'border-zinc-200 focus:border-black'),
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
      <slot name="suffix"></slot>
    </div>
    <p v-if="error" class="mt-1 text-[9px] font-black text-red-500 uppercase tracking-tight pl-1">
      {{ error }}
    </p>
  </div>
</template>
