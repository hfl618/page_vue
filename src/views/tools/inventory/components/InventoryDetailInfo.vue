<script setup>
import InventoryDetailHeader from './InventoryDetailHeader.vue'
import InventoryDetailSpecs from './InventoryDetailSpecs.vue'
import InventoryDetailRemarks from './InventoryDetailRemarks.vue'
import InventoryDetailSource from './InventoryDetailSource.vue'

/**
 * @description 元器件单项详情展示 (Orchestrator)
 */
defineProps({
  item: { type: Object, required: true },
  specs: { type: Array, required: true }
})

const emit = defineEmits(['adjust-stock', 'edit', 'delete', 'upload-source', 'delete-source'])
</script>

<template>
  <div class="flex flex-col h-full bg-white relative">
    <!-- 固定头 -->
    <InventoryDetailHeader 
      :item="item" 
      @adjust-stock="(id, delta) => emit('adjust-stock', id, delta)"
      @edit="(item) => emit('edit', item)"
      @delete="() => emit('delete')"
    />

    <!-- 可滚动内容区 (优化：py-2 减小边距, gap-1.5 紧凑排列) -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-2 flex flex-col gap-1.5">
      <!-- 规格矩阵 -->
      <InventoryDetailSpecs :item="item" :specs="specs" />

      <!-- 技术备注 (始终显示，内部处理空值) -->
      <InventoryDetailRemarks :remark="item.remark" />

      <!-- 资源管理 -->
      <InventoryDetailSource 
        :item="item" 
        @upload="(payload) => emit('upload-source', payload)"
        @delete-source="(type) => emit('delete-source', type)"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
