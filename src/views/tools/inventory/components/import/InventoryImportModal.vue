<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

/**
 * @description 3-Step 工业级数据导入弹窗
 */
const props = defineProps({
  show: Boolean,
  step: { type: Number, default: 1 },
  state: Object
})

const emit = defineEmits(['close', 'next', 'back', 'execute'])

// 全局 Esc 支持
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) emit('close')
}

watch(() => props.show, (val) => {
  if (isOpen) window.addEventListener('keydown', handleEsc)
  else window.removeEventListener('keydown', handleEsc)
})

onUnmounted(() => window.removeEventListener('keydown', handleEsc))

// 系统字段模拟
const SYSTEM_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'category', label: 'Registry' },
  { key: 'mpn', label: 'MPN Code' },
  { key: 'package', label: 'Footprint' },
  { key: 'stock', label: 'Quantity' },
  { key: 'price', label: 'Price' }
]
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div v-if="show" class="fixed inset-0 z-[100000] flex items-center justify-center p-6 translate-no">
        <!-- 背景遮罩 (毛玻璃效果) -->
        <div class="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" @click="emit('close')"></div>
        
        <!-- 主容器 (直角硬朗版) -->
        <div class="bg-white w-full max-w-[1200px] rounded-none shadow-2xl relative z-10 overflow-hidden border border-zinc-900 flex flex-col max-h-[90vh]">
          
          <!-- A. 头部导航与统计 -->
          <div class="px-10 py-6 border-b border-zinc-900 flex items-center justify-between bg-white">
            <div class="flex items-center gap-10">
              <div v-for="s in [1,2,3]" :key="s" class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-none border-2 flex items-center justify-center text-[11px] font-black transition-all"
                     :class="step >= s ? 'bg-zinc-900 text-white border-zinc-900 shadow-[3px_3px_0px_#dbeafe]' : 'bg-white text-zinc-300 border-zinc-100'">
                  {{ s }}
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em]"
                      :class="step >= s ? 'text-zinc-900' : 'text-zinc-300'">
                  {{ s==1 ? 'Source' : (s==2 ? 'Mapping' : 'Resolve') }}
                </span>
              </div>
            </div>

            <!-- 统计徽章 (Step 2+ 显示) -->
            <div class="flex items-center gap-4" v-if="step > 1">
              <div class="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1.5 border border-zinc-100">
                <span class="text-zinc-900">{{ state.total_rows || 0 }}</span> TOTAL | 
                <span class="text-orange-600">{{ state.conflicts.length }}</span> CONFLICTS | 
                <span class="text-emerald-600">{{ state.uniques.length }}</span> NEW
              </div>
              <BaseIconButton variant="ghost" size="w-8 h-8" @click="emit('close')">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </BaseIconButton>
            </div>
            <BaseIconButton v-else variant="ghost" size="w-8 h-8" @click="emit('close')">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </BaseIconButton>
          </div>

          <!-- B. 动态内容区 -->
          <div class="flex-1 overflow-y-auto custom-scrollbar px-10 py-8">
            
            <!-- Step 1: Source Selection -->
            <div v-if="step === 1" class="max-w-[800px] mx-auto space-y-6">
              <div class="space-y-2">
                <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">1. Primary Data Ingestion</div>
                <label class="flex flex-col items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-none hover:border-zinc-900 transition-all cursor-pointer h-20 group">
                  <input type="file" class="hidden">
                  <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    <span class="text-[10px] font-black uppercase text-zinc-400 group-hover:text-zinc-900 tracking-[0.2em]">Select Local Matrix File (.csv / .xlsx)</span>
                  </div>
                </label>
              </div>

              <div class="flex items-center gap-6 py-2">
                <div class="flex-1 h-px bg-zinc-100"></div>
                <span class="text-[8px] font-black text-zinc-300 uppercase tracking-[0.4em]">OR PLAIN TEXT INGESTION</span>
                <div class="flex-1 h-px bg-zinc-100"></div>
              </div>

              <div class="space-y-4">
                <textarea placeholder="Paste spreadsheet rows here..." class="w-full h-64 p-6 bg-zinc-50 rounded-none border border-zinc-100 text-[13px] font-mono focus:border-zinc-900 shadow-inner resize-none outline-none transition-all custom-scrollbar"></textarea>
                <button @click="emit('next')" class="w-full bg-zinc-900 text-white py-4 rounded-none text-[11px] font-black uppercase tracking-[0.4em] shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
                  Analyze Matrix Data
                </button>
              </div>
            </div>

            <!-- Step 2: Mapping (简化展示) -->
            <div v-if="step === 2" class="space-y-8">
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div v-for="col in state.columns" :key="col" class="bg-zinc-50 p-3 border border-zinc-100 flex flex-col gap-2">
                  <span class="text-[10px] font-black text-zinc-400 truncate uppercase">{{ col }}</span>
                  <select class="w-full bg-white border border-zinc-200 rounded-none px-2 py-1 text-[10px] font-bold outline-none focus:border-zinc-900">
                    <option value="">Ignore</option>
                    <option v-for="f in SYSTEM_FIELDS" :key="f.key" :value="f.key">{{ f.label }}</option>
                  </select>
                </div>
              </div>
              <div class="pt-6 flex justify-center gap-6 border-t border-zinc-50">
                <BaseActionLink @click="emit('back')" class="text-[12px]">Back</BaseActionLink>
                <button @click="emit('next')" class="bg-zinc-900 text-white px-16 py-3.5 text-[11px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">Verify Logic</button>
              </div>
            </div>

            <!-- Step 3: Resolve (简化卡片展示) -->
            <div v-if="step === 3" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="c in state.conflicts" :key="c.id" class="p-4 border border-orange-200 bg-orange-50/10">
                   <div class="text-[12px] font-black uppercase text-zinc-900 mb-2">{{ c.new.name }}</div>
                   <div class="flex gap-1 mb-4">
                      <button class="flex-1 py-1 bg-zinc-900 text-white text-[8px] font-black uppercase">Cover</button>
                      <button class="flex-1 py-1 bg-white border border-zinc-900 text-zinc-900 text-[8px] font-black uppercase">Add</button>
                      <button class="flex-1 py-1 text-zinc-300 text-[8px] font-black uppercase">Skip</button>
                   </div>
                   <div class="text-[9px] font-mono text-zinc-500">Conflict detected in Matrix Node.</div>
                </div>
              </div>
              <div class="pt-8 flex justify-center gap-6 border-t border-zinc-900">
                <BaseActionLink @click="emit('back')" class="text-[12px]">Back</BaseActionLink>
                <button @click="emit('execute')" class="bg-emerald-600 text-white px-20 py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">Sync To Cloud Registry</button>
              </div>
            </div>

          </div>
          
          <!-- 底部键盘提示 -->
          <div class="px-10 py-2 bg-zinc-50 border-t border-zinc-100 text-center">
             <span class="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Global ESC Return Active · Industrial Matrix Sync Protocol v4.1</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(20px); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }

select { -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d1d5db'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.5rem center; background-size: 0.8rem; }
</style>
