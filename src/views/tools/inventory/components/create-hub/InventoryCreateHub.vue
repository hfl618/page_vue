<script setup>
import ManualEntryForm from './ManualEntryForm.vue'
import BulkMatrixIngestion from './BulkMatrixIngestion.vue'

/**
 * @description 注册控制中心 (Orchestrator - 修复版)
 */
defineProps({
  show: Boolean,
  state: Object
})

const emit = defineEmits(['close', 'submit-manual', 'execute-bulk'])
</script>

<template>
  <BaseModal 
    :show="show" 
    max-width="max-w-[1000px]" 
    container-class="bg-white border border-zinc-900 rounded-none shadow-2xl"
    @close="emit('close')"
  >
    <!-- 1. 头部区域 (直接写在默认插槽最上方) -->
    <div class="px-10 py-5 border-b border-zinc-900 bg-white flex items-center justify-between shrink-0">
      <div class="flex items-center gap-10">
        <div class="flex flex-col min-w-[140px]">
          <div class="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Registry Protocol</div>
          <div class="text-[18px] font-black tracking-tighter uppercase text-zinc-900 leading-none">
            {{ state.mode === 'manual' ? 'Manual_Entry' : 'Matrix_Flow' }}
          </div>
        </div>

        <BaseSegmented 
          v-model="state.mode"
          size="sm"
          :options="[
            { label: 'SINGLE_NODE', value: 'manual' },
            { label: 'BULK_MATRIX', value: 'bulk' }
          ]"
        />

        <!-- 1-2-3 流程指示器 (简约圆形版) -->
        <Transition name="fade">
          <div v-if="state.mode === 'bulk'" class="flex items-center gap-6 ml-4 border-l border-zinc-100 pl-10">
            <div v-for="s in [1,2,3]" :key="s" class="flex items-center gap-2">
              <div 
                class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all"
                :class="state.bulkStep >= s ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'"
              >
                {{ s }}
              </div>
              <span 
                class="text-[9px] font-black uppercase tracking-widest"
                :class="state.bulkStep >= s ? 'text-zinc-900' : 'text-zinc-400'"
              >
                {{ s==1 ? 'Source' : (s==2 ? 'Mapping' : 'Resolve') }}
              </span>
            </div>
          </div>
        </Transition>      </div>

      <BaseIconButton variant="ghost" size="w-8 h-8" @click="emit('close')">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
      </BaseIconButton>
    </div>

    <!-- 2. 内容区域 (带 min-h-0 确保滚动条正常) -->
    <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-10 py-8 bg-white">
      <Transition name="fade" mode="out-in">
        <ManualEntryForm 
          v-if="state.mode === 'manual'" 
          :form="state.form" 
          @submit="emit('submit-manual')" 
          @cancel="emit('close')"
        />
        <BulkMatrixIngestion 
          v-else 
          @step-change="(val) => state.bulkStep = val"
          @execute="(data) => emit('execute-bulk', data)" 
        />
      </Transition>
    </div>

    <!-- 3. 底部区域 -->
    <div class="px-10 py-2 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center shrink-0">
       <span class="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">System_Ready: Selection_Enabled</span>
       <span class="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">ESC to Return</span>
    </div>
  </BaseModal>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; display: block !important; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f4f4f5; }
</style>
