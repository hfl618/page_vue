<script setup>
import InventoryDetailHeader from './InventoryDetailHeader.vue'
import InventoryDetailSpecs from './InventoryDetailSpecs.vue'
import InventoryDetailRemarks from './InventoryDetailRemarks.vue'
import InventoryDetailSource from './InventoryDetailSource.vue'

/**
 * @description 元器件详细信息展示区 (最终原子重构版)
 */
defineProps({
  item: { type: Object, required: true },
  specs: { type: Array, required: true }
})

const emit = defineEmits(['adjust-stock', 'edit', 'delete', 'upload-source'])
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    
    <!-- 1. 固定头部 (原子组件) -->
    <InventoryDetailHeader 
      :item="item" 
      @adjust-stock="(id, delta) => emit('adjust-stock', id, delta)"
      @edit="(val) => emit('edit', val)"
      @delete="() => emit('delete')"
    />

    <!-- 2. 可滚动内容区 -->
    <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-3">
      <div class="flex flex-col gap-3">
        <!-- 规格矩阵 -->
        <InventoryDetailSpecs :item="item" :specs="specs" />

        <!-- 技术备注 -->
        <InventoryDetailRemarks :remark="item.remark" />

        <!-- 资源管理 (监听上传事件) -->
        <InventoryDetailSource 
          :item="item" 
          @upload="(type) => emit('upload-source', type)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
