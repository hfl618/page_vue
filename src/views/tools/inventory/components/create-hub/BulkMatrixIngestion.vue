<script setup>
import { ref, reactive, watch } from 'vue'
import IngestionStep1Source from './bulk/IngestionStep1Source.vue'
import IngestionStep2Mapping from './bulk/IngestionStep2Mapping.vue'
import IngestionStep3Resolve from './bulk/IngestionStep3Resolve.vue'

/**
 * @description 批量矩阵摄取流 (API 三段式调度器)
 * 流程：Parse -> Verify -> Execute
 */
const emit = defineEmits(['execute', 'step-change'])

const step = ref(1)

// 监听步骤变化并通知父组件 (用于页头进度条)
watch(step, (newStep) => {
  emit('step-change', newStep)
}, { immediate: true })

const state = reactive({
  // Step 1 -> 2 产物
  columns: [],
  previewData: [],
  suggestedMapping: {},
  totalCount: 0,
  allRows: [],
  
  // Step 2 -> 3 产物
  conflicts: [],
  uniquesCount: 0
})

/**
 * 处理解析完成 (Step 1 -> 2)
 */
const handleParsed = (data) => {
  state.columns = data.columns
  state.previewData = data.previewData
  state.suggestedMapping = data.suggestedMapping
  state.totalCount = data.totalCount
  state.allRows = data.allRows
  step.value = 2
}

/**
 * 处理预检完成 (Step 2 -> 3)
 */
const handleVerified = (data) => {
  state.conflicts = data.conflicts
  state.uniquesCount = data.uniquesCount
  step.value = 3
}

/**
 * 处理最终提交完成 (Step 3 -> Finish)
 */
const handleExecuted = () => {
  emit('execute') // 通知父组件关闭 Hub 并刷新列表
}
</script>

<template>
  <div class="flex flex-col gap-10">
    
    <!-- 步骤容器 (带平滑切换动效) -->
    <Transition name="fade-slide" mode="out-in">
      
      <!-- 步骤 1: Source (Parse) -->
      <IngestionStep1Source 
        v-if="step === 1" 
        @parsed="handleParsed" 
      />

      <!-- 步骤 2: Mapping (Verify) -->
      <IngestionStep2Mapping 
        v-else-if="step === 2" 
        :columns="state.columns"
        :preview-data="state.previewData"
        :total-count="state.totalCount"
        :all-rows="state.allRows"
        :suggested-mapping="state.suggestedMapping"
        @back="step = 1"
        @verified="handleVerified"
      />

      <!-- 步骤 3: Resolve (Execute) -->
      <IngestionStep3Resolve 
        v-else-if="step === 3" 
        :conflicts="state.conflicts"
        :uniques-count="state.uniquesCount"
        @back="step = 2"
        @executed="handleExecuted"
      />

    </Transition>

  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
