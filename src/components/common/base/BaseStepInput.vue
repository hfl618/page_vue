<script setup>
import { ref, watch, computed } from 'vue'

/**
 * @description 通用工业级步进输入组件 (智能步长增强版)
 * 特性：
 * 1. 智能步长：根据当前值自动判定步长 (100倍数走100, 10倍数走10, 否则走1)
 * 2. 物理加固：兼容后端 String/Number 混合数据
 * 3. 绝对录入：支持回车提交绝对数值
 * 4. 视觉稳定：固定倍率显示区宽度，防止抖动
 */
const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  label: { type: String, default: '' },
  min: { type: Number, default: 0 },
  max: { type: Number, default: Infinity },
  // 默认步长 (如果不满足智能判定则使用此值)
  step: { type: Number, default: 1 },
  size: { type: String, default: 'sm' },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 本地显示值
const localVal = ref(parseInt(props.modelValue) || 0)

// 监听外部更新
watch(() => props.modelValue, (newVal) => {
  localVal.value = parseInt(newVal) || 0
})

/**
 * 核心：计算智能步长
 * 逻辑：优先检测 100 整数倍，其次 10 整数倍
 */
const smartStep = computed(() => {
  const current = parseInt(props.modelValue) || 0
  if (current === 0) return 1 // 0 的时候从 1 开始
  if (current % 100 === 0) return 100
  if (current % 10 === 0) return 10
  return props.step
})

/**
 * 处理 +/- 点击
 */
const handleAdjust = (direction) => {
  const currentNum = parseInt(props.modelValue) || 0
  const delta = direction * smartStep.value
  const newValue = currentNum + delta
  
  if (newValue >= props.min && newValue <= props.max) {
    emit('update:modelValue', newValue)
    emit('change', newValue, delta)
  }
}

/**
 * 处理手动输入提交
 */
const handleManualCommit = (e) => {
  if (props.readonly) return
  
  let targetVal = parseInt(e.target.value)
  const currentNum = parseInt(props.modelValue) || 0
  
  if (isNaN(targetVal)) {
    localVal.value = currentNum
    return
  }
  
  targetVal = Math.max(props.min, Math.min(props.max, targetVal))
  const delta = targetVal - currentNum
  
  if (delta !== 0) {
    emit('update:modelValue', targetVal)
    emit('change', targetVal, delta)
  } else {
    localVal.value = currentNum
  }
}

const handleEnter = (e) => {
  e.target.blur()
}
</script>

<template>
  <div 
    :class="[
      'flex items-center border border-zinc-200 bg-white transition-colors hover:border-zinc-300',
      size === 'sm' ? 'px-1 py-0.5 gap-0.5' : 'px-2 py-1 gap-2'
    ]"
  >
    <!-- 标签区 -->
    <span v-if="label" :class="['font-black text-zinc-400 uppercase select-none', size === 'sm' ? 'text-[8px] px-1' : 'text-[10px] px-1.5']">
      {{ label }}:
    </span>

    <!-- 减少按钮 -->
    <button 
      @click="handleAdjust(-1)"
      :disabled="parseInt(modelValue) <= min"
      :title="`Decrement by ${smartStep}`"
      class="flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-sm shrink-0"
      :class="size === 'sm' ? 'w-4 h-4 text-[12px]' : 'w-6 h-6 text-[14px]'"
    >
      -
    </button>

    <!-- 数值输入 -->
    <input 
      v-model.number="localVal"
      @blur="handleManualCommit"
      @keydown.enter="handleEnter"
      :readonly="readonly"
      type="text"
      class="bg-transparent font-mono font-bold text-center text-zinc-900 outline-none p-0 border-none shrink-0"
      :class="size === 'sm' ? 'text-[10px] w-9' : 'text-[12px] w-12'"
    >

    <!-- 增加按钮 -->
    <button 
      @click="handleAdjust(1)"
      :disabled="parseInt(modelValue) >= max"
      :title="`Increment by ${smartStep}`"
      class="flex items-center justify-center hover:bg-zinc-100 text-zinc-600 font-bold transition-colors disabled:opacity-20 disabled:cursor-not-allowed rounded-sm shrink-0"
      :class="size === 'sm' ? 'w-4 h-4 text-[12px]' : 'w-6 h-6 text-[14px]'"
    >
      +
    </button>

    <!-- 步长倍率显示 (关键改进：始终显示 + 固定宽度防止抖动) -->
    <div 
      class="flex items-center justify-center border-l border-zinc-100 ml-0.5 pl-1.5"
      :class="size === 'sm' ? 'w-6' : 'w-8'"
    >
       <span 
         class="text-[7px] font-black uppercase transition-colors"
         :class="smartStep > 1 ? 'text-blue-500 opacity-100' : 'text-zinc-300 opacity-60'"
       >
         x{{ smartStep }}
       </span>
    </div>
  </div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
