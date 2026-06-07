<script setup>
import { reactive, onMounted, computed } from 'vue'
import { inventoryApi } from '@/api/modules/inventory'
import { useUiStore } from '@/store/ui'

/**
 * @description 批量摄取 - 步骤 2: 字段映射矩阵 (API 校验版)
 */
const props = defineProps({
  columns: { type: Array, default: () => [] },
  previewData: { type: Array, default: () => [] },
  totalCount: { type: Number, default: 0 },
  allRows: { type: Array, default: () => [] },
  suggestedMapping: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['back', 'verified'])
const uiStore = useUiStore()

const SYSTEM_FIELDS = [
  { key: 'category', label: 'Category' },
  { key: 'name', label: 'Name' },
  { key: 'model', label: 'Model' },
  { key: 'package', label: 'Package' },
  { key: 'quantity', label: 'Stock' },
  { key: 'price', label: 'Price' },
  { key: 'supplier', label: 'Mfr' },
  { key: 'channel', label: 'Channel' },
  { key: 'location', label: 'Bin' },
  { key: 'remark', label: 'Remark' },
  { key: 'unit', label: 'Unit' },
  { key: 'buy_time', label: 'Date' }
]

const mapping = reactive({})

onMounted(() => {
  // 使用后端建议的映射初始化
  props.columns.forEach(col => {
    mapping[col] = props.suggestedMapping[col] || ''
  })
})

/**
 * 第二阶段：冲突预检 (Verify)
 */
const handleVerify = async () => {
  try {
    uiStore.showLoading('VERIFYING', 'Running duplicate detection logic...')
    
    // 发送到后端进行深度查重 (name + model + package)
    const res = await inventoryApi.importVerify({
      rows: props.allRows,
      mapping: { ...mapping }
    })
    
    // 后端期待返回: conflicts (差异列表), new_count
    emit('verified', {
      conflicts: res.conflicts,
      uniquesCount: res.new_count
    })
    
  } catch (e) {
    console.error('[Import] Verify Failed:', e)
  } finally {
    uiStore.hideLoading()
  }
}

const mappedPreview = computed(() => {
  const activeMappings = Object.entries(mapping).filter(([_, sysKey]) => sysKey !== '')
  return props.previewData.map(row => {
    const mappedRow = {}
    activeMappings.forEach(([rawCol, sysKey]) => {
      const field = SYSTEM_FIELDS.find(f => f.key === sysKey)
      if (field) mappedRow[field.label] = row[rawCol]
    })
    return mappedRow
  })
})

const mappedLabels = computed(() => {
  const activeSysKeys = Object.values(mapping).filter(v => v !== '')
  return SYSTEM_FIELDS.filter(f => activeSysKeys.includes(f.key)).map(f => f.label)
})
</script>

<template>
  <div class="space-y-6 animate-in slide-in-from-right-4 duration-300">
    <!-- 1. 原始摄取预览 -->
    <div class="bg-zinc-50/50 p-4 border border-zinc-100">
      <div class="flex items-center justify-between mb-3">
        <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">1. Raw Data Ingestion Preview</div>
        <div class="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 uppercase tracking-widest">
          Total Ingested: {{ totalCount }} Units
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr class="border-b border-zinc-200">
              <th v-for="col in columns" :key="col" class="py-1.5 px-3 font-black text-zinc-400 uppercase tracking-tighter">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in previewData" :key="idx" class="border-b border-zinc-50 last:border-0">
              <td v-for="col in columns" :key="col" class="py-1.5 px-3 font-bold text-zinc-600 truncate max-w-[150px]">{{ row[col] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. 映射网格 -->
    <div>
      <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3 ml-1">2. Field Mapping Matrix</div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <div v-for="col in columns" :key="col" class="bg-zinc-50 p-3 border border-zinc-100 flex flex-col gap-1.5 shadow-sm transition-all hover:border-zinc-300">
          <span class="text-[9px] font-black text-zinc-400 truncate uppercase tracking-tighter pl-0.5">{{ col }}</span>
          <select 
            v-model="mapping[col]"
            class="w-full bg-white border border-zinc-200 rounded-none px-2 py-1 text-[10px] font-bold outline-none focus:border-zinc-900 transition-colors"
            :class="mapping[col] ? 'text-zinc-900' : 'text-zinc-300'"
          >
            <option value="">Ignore</option>
            <option v-for="f in SYSTEM_FIELDS" :key="f.key" :value="f.key">{{ f.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 3. 系统映射预览 -->
    <div v-if="mappedLabels.length > 0" class="bg-zinc-900 p-4 border border-zinc-900 shadow-xl animate-in fade-in zoom-in-95 duration-500">
      <div class="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
        <div class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">3. System Mapped Preview (Registry Ready)</div>
        <div class="text-[8px] font-bold text-emerald-500 uppercase animate-pulse">[VALID_FOR_REGISTRATION]</div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr>
              <th v-for="label in mappedLabels" :key="label" class="py-1.5 px-3 font-black text-zinc-600 uppercase tracking-tighter">{{ label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in mappedPreview" :key="idx" class="border-t border-zinc-800/50 first:border-none">
              <td v-for="label in mappedLabels" :key="label" class="py-1.5 px-3 font-bold text-zinc-300 truncate max-w-[150px]">{{ row[label] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 动作栏 -->
    <div class="pt-6 flex justify-center gap-10 border-t border-zinc-100">
      <BaseActionLink @click="emit('back')" class="text-[10px]" color-class="text-zinc-400 hover:text-zinc-900" bold>
        Back_To_Source
      </BaseActionLink>
      <BaseButton 
        @click="handleVerify" 
        class="!w-[280px] !py-3.5"
        shadow="shadow-[4px_4px_0px_#f4f4f5]"
      >
        Verify Matrix Schema
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
select { 
  -webkit-appearance: none; 
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d1d5db'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); 
  background-repeat: no-repeat; 
  background-position: right 0.4rem center; 
  background-size: 0.7rem; 
}
select:focus {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2318181b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
}
</style>
