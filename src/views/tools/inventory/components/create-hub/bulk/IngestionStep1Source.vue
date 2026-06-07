<script setup>
import { ref } from 'vue'
import { inventoryApi } from '@/api/modules/inventory'
import { useUiStore } from '@/store/ui'

/**
 * @description 批量摄取 - 步骤 1: 数据源摄取 (API 三段式版)
 */
const emit = defineEmits(['parsed'])
const uiStore = useUiStore()

const rawInput = ref('')
const selectedFile = ref(null)
const firstRowIsHeader = ref(true)

/**
 * 第一阶段：数据解析 (Parse)
 */
const handleAnalyze = async () => {
  if (!rawInput.value.trim() && !selectedFile.value) return
  
  try {
    uiStore.showLoading('PARSING', 'Analyzing matrix structure...')
    
    const formData = new FormData()
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    } else {
      formData.append('text', rawInput.value)
    }
    formData.append('firstRowIsHeader', firstRowIsHeader.value)

    const res = await inventoryApi.importParse(formData)
    
    // 后端期待返回: rows (前几行预览), mapping (建议映射), total_count
    emit('parsed', {
      columns: Object.keys(res.rows[0] || {}),
      previewData: res.rows.slice(0, 3),
      suggestedMapping: res.mapping,
      totalCount: res.total_count,
      allRows: res.rows // 保存全量解析后的数据供下一步 verify 使用
    })
    
  } catch (e) {
    console.error('[Import] Parse Failed:', e)
  } finally {
    uiStore.hideLoading()
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    rawInput.value = '' // 清空文本，优先使用文件
    handleAnalyze()
  }
}
</script>

<template>
  <div class="max-w-[850px] mx-auto space-y-8 w-full animate-in fade-in duration-300">
    <!-- 1. 文件摄取区 -->
    <div class="space-y-3">
      <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex justify-between">
        <span>1. Binary Matrix Uplink</span>
        <span v-if="selectedFile" class="text-emerald-500 font-bold uppercase tracking-tight">[Ready: {{ selectedFile.name }}]</span>
      </div>
      <label class="flex flex-col items-center justify-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-none hover:border-zinc-900 transition-all cursor-pointer h-24 group">
        <input type="file" class="hidden" @change="handleFileChange">
        <div class="flex items-center gap-4">
          <svg class="w-6 h-6 text-zinc-300 group-hover:text-zinc-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          <span class="text-[11px] font-black uppercase text-zinc-400 group-hover:text-zinc-900 tracking-[0.2em]">Deploy Matrix Manifest From Disk</span>
        </div>
      </label>
    </div>

    <!-- 2. 文本粘贴区 -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-6 py-2 flex-1">
          <div class="flex-1 h-px bg-zinc-100"></div>
          <span class="text-[8px] font-black text-zinc-300 uppercase tracking-[0.4em]">OR SPREADSHEET_DIRECT_PASTE</span>
          <div class="flex-1 h-px bg-zinc-100"></div>
        </div>
        
        <div class="ml-6 flex items-center gap-2.5 shrink-0">
          <span class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">First row is header:</span>
          <BaseSwitch v-model="firstRowIsHeader" size="sm" />
        </div>
      </div>

      <div class="relative group">
        <textarea 
          v-model="rawInput"
          :placeholder="firstRowIsHeader ? 'Paste with headers (MPN, QTY, etc.)...' : 'Paste raw data rows directly (e.g. 4.7R, 100...)'" 
          class="w-full h-64 p-8 bg-zinc-50 rounded-none border border-zinc-100 text-[13px] font-mono focus:border-zinc-900 shadow-inner resize-none outline-none transition-all custom-scrollbar placeholder:text-zinc-200"
        ></textarea>
        
        <div v-if="!rawInput && !firstRowIsHeader" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div class="text-center">
              <div class="text-[10px] font-black uppercase tracking-[0.5em] text-orange-600 mb-1">DATA_ONLY_MODE_ACTIVE</div>
              <div class="text-[8px] font-bold text-zinc-300">Targeting all rows for registry ingestion.</div>
           </div>
        </div>
      </div>

      <BaseButton 
        @click="handleAnalyze"
        :disabled="!rawInput.trim() && !selectedFile"
        shadow="shadow-[6px_6px_0px_#dbeafe]"
        class="!py-5"
      >
        Execute Matrix Analysis
      </BaseButton>
    </div>
  </div>
</template>
