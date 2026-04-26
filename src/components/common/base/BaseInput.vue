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
  success: Boolean,
  // 允许父组件传入额外的 class 来控制宽度等样式
  inputClass: { type: String, default: '' }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <!-- 根节点将接收父组件传入的任何 class (如 w-64) -->
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
          disabled ? 'opacity-50 cursor-not-allowed' : '',
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
