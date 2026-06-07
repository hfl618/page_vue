<script setup>
import BladeHeader from './blade/BladeHeader.vue'
import BladeArchitecture from './blade/BladeArchitecture.vue'
import BladeResponseMatrix from './blade/BladeResponseMatrix.vue'
import BladeTerminal from './blade/BladeTerminal.vue'
import BladeFooter from './blade/BladeFooter.vue'

/**
 * @description API 详情 Blade (模块化架构版 - 物理加固版)
 * 集成了 Markdown 风格代码块与上帝视角权限感知
 */
const props = defineProps({
  api: Object,
  meta: Object,
  resolvedPath: String,
  testInputs: Object,
  testResult: Object,
  isTesting: Boolean
})

const emit = defineEmits(['close', 'test', 'toggle-status', 'copy'])
</script>

<template>
  <div v-if="api" class="fixed inset-y-0 right-0 w-[580px] bg-white z-[100] shadow-[-40px_0_100px_rgba(0,0,0,0.06)] flex flex-col border-l border-zinc-100 font-sans overflow-hidden">
    
    <!-- 交互手柄 -->
    <button @click="emit('close')" class="absolute left-[-12px] top-1/2 -translate-y-1/2 w-3 h-12 bg-white border border-zinc-100 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all z-20 rounded-l shadow-sm">
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M9 5l7 7-7 7" /></svg>
    </button>

    <!-- 1. 模块化页眉 (权限等级展示) -->
    <BladeHeader 
      :api="api" 
      @toggle-status="emit('toggle-status', $event)" 
    />

    <!-- 2. 数据滚动区 -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-10 text-left">
      
      <!-- 说明与描述 -->
      <section>
        <p class="text-[11px] font-medium text-zinc-400 leading-relaxed italic border-l-2 border-zinc-100 pl-4">
          {{ api.description || 'NODE_PROTOCOL_SPEC_ACTIVE' }}
        </p>
      </section>

      <!-- 01. 模块化 Specs 渲染 (Markdown 风格 Contract) -->
      <BladeArchitecture :meta="meta" />

      <!-- 02. 模块化响应矩阵 -->
      <BladeResponseMatrix :meta="meta" />

      <!-- 03. 模块化调试终端 (变量注入) -->
      <BladeTerminal 
        :api="api"
        :meta="meta"
        :test-inputs="testInputs"
        :resolved-path="resolvedPath"
        :test-result="testResult"
        :is-testing="isTesting"
        @test="emit('test')"
        @copy="emit('copy', $event)"
      />

    </div>

    <!-- 3. 模块化页脚 -->
    <BladeFooter 
      :api="api" 
      @copy="emit('copy', $event)" 
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; }
</style>
