<script setup>
import { computed } from 'vue'
import InventoryDetailInfo from './InventoryDetailInfo.vue'

/**
 * @description 元器件详情面板 (物理原名对齐版)
 * 键名对齐 API: location, model, quantity, supplier, buy_time...
 */
const props = defineProps({
  selectedItems: { type: Array, default: () => [] }
})

const emit = defineEmits(['adjust-stock', 'edit', 'delete', 'sync', 'export', 'upload-source', 'delete-source'])

const mainItem = computed(() => props.selectedItems[0] || null)
const isBulk = computed(() => props.selectedItems.length > 1)

/**
 * 物理规格矩阵：严格对齐数据库原始字段
 */
const specs = computed(() => {
  if (!mainItem.value) return []
  const item = mainItem.value
  return [
    { label: 'Bin', value: item.location || '--' },
    { label: 'Registry', value: item.category || '--' },
    { label: 'MPN_Model', value: item.model || '--' },
    { label: 'Footprint', value: item.package || '--' },
    { label: 'Unit_Cost', value: item.price ? `￥${item.price}` : '--' },
    { label: 'UOM', value: item.unit || 'pcs' }
  ]
})
</script>

<template>
  <Transition 
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-y-8 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-8 opacity-0"
  >
    <div v-if="mainItem" class="flex flex-col border-t border-zinc-900 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] relative z-40">
      
      <!-- 模式 A: 批量操作 -->
      <div v-if="isBulk" class="px-6 py-3.5 flex flex-row items-center justify-between bg-zinc-50/50">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-0 shadow-[3px_3px_0px_#dbeafe] flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Selected: {{ selectedItems.length }} Units
            </span>
          </div>
          <div class="h-4 w-px bg-zinc-200"></div>
          <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Matrix Operation Logic Enabled</p>
        </div>

        <div class="flex items-center gap-6">
          <BaseActionLink @click="emit('sync')" color-class="text-blue-600" bold>Bulk Sync</BaseActionLink>
          <BaseActionLink @click="emit('export')" color-class="text-zinc-500" bold>Export Manifest</BaseActionLink>
          <BaseActionLink @click="emit('delete')" color-class="text-red-500" active-border-class="hover:border-red-500" bold>Wipe Registry</BaseActionLink>
        </div>
      </div>

      <!-- 模式 B: 单项详情 -->
      <template v-else>
        <InventoryDetailInfo 
          :item="mainItem" 
          :specs="specs" 
          @adjust-stock="(id, delta) => emit('adjust-stock', id, delta)"
          @edit="(item) => emit('edit', item)"
          @delete="() => emit('delete')"
          @upload-source="(payload) => emit('upload-source', payload)"
          @delete-source="(type) => emit('delete-source', type)"
        />
      </template>
    </div>
  </Transition>
</template>
