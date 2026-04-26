<script setup>
import { computed } from 'vue'

/**
 * PasswordValidator 还原说明：
 * 1. 实时检测：长度 >= 8、包含数字、包含特殊字符。
 * 2. 视觉反馈：对标 gray-400 (未达成) 与 black font-bold (已达成) 的物理切换。
 * 
 * @props {String} value - 当前输入的密码字符串
 */
const props = defineProps({
  value: { type: String, default: '' }
})

const rules = computed(() => ({
  length: props.value.length >= 8,
  number: /\d/.test(props.value),
  special: /[!@#$%^&*(),.?":{}|<>]/.test(props.value)
}))
</script>

<template>
  <div class="flex flex-col gap-1.5 mt-1 ml-1 text-left" translate="no">
    <!-- 长度校验 -->
    <div class="flex items-center gap-2 text-[12px] transition-all duration-200"
         :class="rules.length ? 'text-black font-bold' : 'text-gray-400'">
      <svg class="w-3.5 h-3.5 transition-opacity" :class="rules.length ? 'opacity-100' : 'opacity-50'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      At least 8 characters
    </div>

    <!-- 数字校验 -->
    <div class="flex items-center gap-2 text-[12px] transition-all duration-200"
         :class="rules.number ? 'text-black font-bold' : 'text-gray-400'">
      <svg class="w-3.5 h-3.5 transition-opacity" :class="rules.number ? 'opacity-100' : 'opacity-50'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      Contains a number
    </div>

    <!-- 特殊字符校验 -->
    <div class="flex items-center gap-2 text-[12px] transition-all duration-200"
         :class="rules.special ? 'text-black font-bold' : 'text-gray-400'">
      <svg class="w-3.5 h-3.5 transition-opacity" :class="rules.special ? 'opacity-100' : 'opacity-50'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      Contains a special character
    </div>
  </div>
</template>
