<script setup>
import { ref, onMounted } from 'vue'
import { inventoryApi } from '@/api/modules/inventory'
import { useUiStore } from '@/store/ui'

/**
 * @description 批量摄取 - 步骤 3: 冲突解决协议 (API 执行版 - Raw Schema 对齐)
 */
const props = defineProps({
  conflicts: { type: Array, default: () => [] },
  uniquesCount: { type: Number, default: 0 }
})

const emit = defineEmits(['back', 'executed'])
const uiStore = useUiStore()

// 策略库: 管理每一个冲突项的处理方式 ('add', 'cover', 'new', 'skip')
const strategies = ref([])

onMounted(() => {
  // 默认策略：如果检测到冲突，默认选择 'add' (增加库存)
  strategies.value = props.conflicts.map(() => 'add')
})

const setStrategy = (index, type) => {
  strategies.value[index] = type
}

const getStrategyClass = (index) => {
  const type = strategies.value[index]
  if (type === 'add') return 'bg-white border-zinc-200'
  if (type === 'cover') return 'bg-red-50/30 border-red-200 shadow-[4px_4px_0px_#fee2e2]'
  if (type === 'new') return 'bg-emerald-50/30 border-emerald-200 shadow-[4px_4px_0px_#d1fae5]'
  if (type === 'skip') return 'opacity-40 grayscale border-dashed border-zinc-300'
  return ''
}

/**
 * 第三阶段：正式执行 (Execute)
 */
const handleFinalExecute = async () => {
  try {
    uiStore.showLoading('EXECUTING', 'Committing matrix to Cloudflare D1...')
    
    // 构造载荷
    const payload = {
      conflicts: props.conflicts.map((c, i) => ({
        id: c.old.id, // 指向现有数据库 ID
        data: c.new,  // 新数据
        strategy: strategies.value[i]
      }))
    }

    const res = await inventoryApi.importExecute(payload)
    
    if (res.success) {
      uiStore.addNotice({ 
        title: 'IMPORT_COMPLETE', 
        message: `Successfully imported ${res.imported} units.`, 
        type: 'success' 
      })
      emit('executed')
    }
    
  } catch (e) {
    console.error('[Import] Execute Failed:', e)
  } finally {
    uiStore.hideLoading()
  }
}
</script>

<template>
  <div class="space-y-10 animate-in slide-in-from-right-4 duration-500">
    
    <!-- 1. 新增项提示 -->
    <div v-if="uniquesCount > 0" class="p-4 bg-emerald-50/50 border border-emerald-100 flex items-center justify-center gap-3">
       <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
       <span class="text-[10px] font-black text-emerald-700 uppercase tracking-[0.3em] text-center">
         {{ uniquesCount }} New registry nodes detected. Automated synchronization ready.
       </span>
    </div>

    <!-- 2. 冲突解决矩阵 -->
    <div v-if="conflicts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(c, i) in conflicts" 
        :key="i"
        :class="[
          'p-5 border transition-all duration-300 flex flex-col gap-5 relative',
          getStrategyClass(i)
        ]"
      >
        <!-- 头部信息 -->
        <div class="flex flex-col items-center text-center gap-1">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span class="text-[14px] font-black text-zinc-900 truncate uppercase tracking-tight">{{ c.new.name }}</span>
          </div>
          <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {{ c.new.model || '-' }} · {{ c.new.package || '-' }}
          </span>
        </div>

        <!-- 策略选择按钮组 -->
        <div class="flex p-0.5 bg-zinc-100 rounded-none gap-0.5 border border-zinc-200">
           <BaseButton 
             v-for="type in ['add', 'cover', 'new', 'skip']" 
             :key="type"
             @click="setStrategy(i, type)"
             variant="custom"
             :color-class="strategies[i] === type ? 'bg-white text-zinc-900 border border-zinc-200/50' : 'bg-transparent text-zinc-400 border-transparent'"
             :hover-class="strategies[i] === type ? '' : 'hover:text-zinc-600'"
             shadow="none"
             class="!py-1 !px-0 flex-1 !text-[8px] !min-h-0"
           >
             {{ type === 'add' ? 'ADD_QTY' : type }}
           </BaseButton>
        </div>

        <!-- 差异对比区 (对齐物理字段：quantity, price, location, remark) -->
        <div class="space-y-2 pt-2 border-t border-zinc-100/50">
           <div v-for="f in ['quantity', 'price', 'location', 'remark']" :key="f" class="flex items-center justify-between text-[11px]">
              <span class="text-[9px] font-black text-zinc-300 uppercase w-12">{{ f === 'quantity' ? 'QTY' : f }}</span>
              <div class="flex-1 flex items-center gap-2 justify-end min-w-0">
                 <span 
                   class="truncate text-zinc-400 font-medium"
                   :class="{'line-through opacity-50': strategies[i] === 'cover' || (strategies[i] === 'add' && f === 'quantity')}"
                 >
                   {{ c.old[f] || '-' }}
                 </span>
                 <svg class="w-2.5 h-2.5 text-zinc-200 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                 <span 
                   class="truncate font-black text-right min-w-[30px]"
                   :class="{
                     'text-blue-600': strategies[i] === 'add' && f === 'quantity',
                     'text-red-600': strategies[i] === 'cover',
                     'text-emerald-600': strategies[i] === 'new'
                   }"
                 >
                    <template v-if="f === 'quantity' && strategies[i] === 'add'">
                      {{ (parseInt(c.old[f]) || 0) + (parseInt(c.new[f]) || 0) }}
                    </template>
                    <template v-else>
                      {{ c.new[f] || '-' }}
                    </template>
                 </span>
              </div>
           </div>
        </div>

        <div class="text-center mt-auto pt-2">
           <span class="text-[8px] font-black uppercase tracking-tighter" :class="strategies[i] === 'skip' ? 'text-zinc-400' : 'text-zinc-300'">
             Strategy: {{ strategies[i] }} mode active
           </span>
        </div>
      </div>
    </div>

    <!-- 3. 全局动作 -->
    <div class="pt-12 border-t border-zinc-100 flex flex-col items-center gap-6">
       <div class="flex gap-10">
         <BaseActionLink @click="emit('back')" class="text-[10px]" color-class="text-zinc-400 hover:text-zinc-900" bold>
           REVISE_MAPPING_MATRIX
         </BaseActionLink>
       </div>
       <BaseButton 
         @click="handleFinalExecute"
         shadow="shadow-[8px_8px_0px_#dbeafe]"
         class="!w-[480px] !py-5 !text-[12px]"
       >
         Execute_Cloud_Registry_Sync
       </BaseButton>
    </div>

  </div>
</template>

<style scoped>
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
</style>
