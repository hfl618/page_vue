<script setup>
import { onMounted } from 'vue'
import { useApiManager } from './hooks/useApiManager'
import ApiRegistryTable from './components/ApiRegistryTable.vue'
import ApiDetailBlade from './components/ApiDetailBlade.vue'
import BaseTitle from '@/components/common/base/BaseTitle.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseInput from '@/components/common/base/BaseInput.vue'
import { useEsc } from '@/utils/useEsc'

/**
 * @description 系统 API 注册中心 (模块化全功能版)
 * 极致紧凑、逻辑隔离、物理对齐、支持全局 Esc 返回
 */
const {
  loading, searchQuery, filters, filterOptions, selectedApi, testResult, isTesting,
  testInputs, safeMetadata, resolvedPath, fetchApis, filteredApis, toggleStatus, runProtocolTest
} = useApiManager()

const handleCopy = (text) => {
  navigator.clipboard.writeText(text)
}

const columns = [
  { key: 'method', label: 'PROTOCOL', width: '130px', align: 'center' },
  { key: 'path', label: 'ENDPOINT_URI', align: 'left' },
  { key: 'title', label: 'IDENTIFICATION', align: 'left' },
  { key: 'isActive', label: 'GATE', width: '120px', align: 'right' }
]

const handleFilterChange = ({ key, value }) => {
  filters[key] = value
}

// 注册全局 Esc 响应：关闭详情面板
useEsc(() => {
  if (selectedApi.value) {
    selectedApi.value = null
    testResult.value = null
    return true // 拦截事件，防止冒泡到更上层逻辑
  }
})

onMounted(() => {
  fetchApis()
})
</script>

<template>
  <div class="h-full flex flex-col bg-white overflow-hidden select-none" translate="no">
    
    <!-- 1. 精致顶栏 -->
    <header class="h-16 shrink-0 border-b border-zinc-50 px-10 flex items-center justify-between z-20">
      <div class="flex items-center gap-10">
        <div class="flex flex-col text-left">
          <BaseTitle level="h2" size="text-[14px]" class="tracking-[0.3em] !mb-0">API_REGISTRY</BaseTitle>
          <span class="text-[7px] text-zinc-300 font-bold uppercase tracking-widest mt-1 ml-0.5">Node_Protocol_v4.1</span>
        </div>
        
        <div class="w-80">
          <BaseInput 
            v-model="searchQuery" 
            placeholder="FILTER_NODES..." 
            size="sm"
            class="!bg-zinc-50/50"
          >
            <template #prefix>
              <svg class="w-3.5 h-3.5 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </template>
          </BaseInput>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <span v-if="filters.method || filters.module" class="text-[8px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Filter_Active</span>
        
        <BaseButton 
          variant="secondary" 
          @click="fetchApis" 
          :loading="loading" 
          class="!py-1.5 !px-6 !text-[9px] !w-auto !bg-zinc-50 hover:!bg-zinc-100"
        >
          RE_SYNC_CORE
        </BaseButton>
      </div>
    </header>

    <!-- 2. 主列表组件 -->
    <main class="flex-1 overflow-hidden">
      <ApiRegistryTable 
        :columns="columns" 
        :items="filteredApis" 
        :filters="filters"
        :options="filterOptions"
        @row-click="selectedApi = $event" 
        @filter-change="handleFilterChange"
      />
    </main>

    <!-- 3. 详情 Blade 组件 -->
    <Transition name="slide-right">
      <ApiDetailBlade 
        v-if="selectedApi"
        :api="selectedApi"
        :meta="safeMetadata"
        :resolved-path="resolvedPath"
        :test-inputs="testInputs"
        :test-result="testResult"
        :is-testing="isTesting"
        @close="selectedApi = null"
        @toggle-status="toggleStatus"
        @test="runProtocolTest"
        @copy="handleCopy"
      />
    </Transition>

  </div>
</template>

<style scoped>
.slide-right-enter-active, .slide-right-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); opacity: 0; }
</style>
