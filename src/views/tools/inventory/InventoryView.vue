<script setup>
import { onMounted, ref } from 'vue'
import { useInventory } from './hooks/useInventory'
import InventoryToolbar from './components/InventoryToolbar.vue'
import InventoryTable from './components/InventoryTable.vue'
import InventoryDetailPanel from './components/InventoryDetailPanel.vue'

/**
 * @description 元器件管理主视图 (复原边距 & 高度自适应版)
 */
const {
  components, categories, selectedItems, isSyncing, searchQuery, selectedCategories,
  showAdvancedSearch, advancedFilters,
  filteredComponents, allSelected, uiStore,
  fetchAll, toggleSelect, toggleAll, handleAdjustStock, handleDelete
} = useInventory()

const columns = [
  { key: 'img', label: 'Img', width: '5%', align: 'center' },
  { key: 'category', label: 'Category', width: '10%', align: 'center' },
  { key: 'name', label: 'Name', width: '15%', align: 'left' },
  { key: 'mpn', label: 'MPN / Package', width: '20%', align: 'left' },
  { key: 'stock', label: 'Stock', width: '6%', align: 'center' },
  { key: 'price', label: 'Price / Unit', width: '10%', align: 'center' },
  { key: 'bin', label: 'Bin', width: '8%', align: 'center' },
  { key: 'mfr', label: 'Mfr / Channel', width: '12%', align: 'left' },
  { key: 'actions', label: 'Actions', width: '11%', align: 'center' }
]

const handleAdd = () => {
  uiStore.addNotice({ title: 'PROTOCOL_UPDATE', message: 'Add logic in deployment.', type: 'info' })
}

const handleEdit = (item) => {
  uiStore.addNotice({ title: 'PROTOCOL_UPDATE', message: 'Edit logic for ' + item.name, type: 'info' })
}

const handleImport = () => {
  uiStore.addNotice({ title: 'PROTOCOL_UPDATE', message: 'Import logic in deployment.', type: 'info' })
}

const handleExport = () => {
  uiStore.addNotice({ title: 'PROTOCOL_EXPORT', message: 'Generating manifest...', type: 'info' })
}

const handleUploadSource = (type) => {
  uiStore.addNotice({ 
    title: 'UPLOAD_INITIATED', 
    message: `Ready to synchronize ${type.toUpperCase()} payload.`, 
    type: 'info' 
  })
}

// --- 全局 Esc 返回逻辑 (用于收缩内容区) ---
const handleGlobalEsc = (e) => {
  if (e.key === 'Escape' && selectedItems.value.length > 0) {
    selectedItems.value = []
  }
}

watch(() => selectedItems.value.length, (count) => {
  if (count > 0) {
    window.addEventListener('keydown', handleGlobalEsc)
  } else {
    window.removeEventListener('keydown', handleGlobalEsc)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalEsc)
})

onMounted(fetchAll)
</script>

<template>
  <div class="h-full flex flex-col bg-[#fafafa]" translate="no">
    <!-- 1. 复原外层边距 p-6 -->
    <div class="flex-1 overflow-hidden p-6">
      
      <!-- 2. 复原主容器限制 max-w-[1600px] 与居中 -->
      <div class="max-w-[1600px] mx-auto h-full flex flex-col bg-white border border-zinc-100 shadow-sm overflow-hidden">
        
        <!-- 1. 顶部工具栏 -->
        <InventoryToolbar 
          v-model:search-query="searchQuery"
          v-model:show-advanced-search="showAdvancedSearch"
          :advanced-filters="advancedFilters"
          :is-syncing="isSyncing"
          @add="handleAdd"
          @import="handleImport"
        />

        <!-- 2. 数据表格 (关键：此处已支持 flex-1 垂直拉伸) -->
        <InventoryTable 
          :columns="columns"
          :items="filteredComponents"
          :selected-items="selectedItems"
          :all-selected="allSelected"
          @toggle-all="toggleAll"
          @toggle-select="toggleSelect"
          @edit="handleEdit"
          @adjust-stock="handleAdjustStock"
        />

        <!-- 3. 详情与操作面板 -->
        <InventoryDetailPanel 
          :selected-items="selectedItems"
          @adjust-stock="handleAdjustStock"
          @sync="fetchAll"
          @export="handleExport"
          @edit="handleEdit"
          @delete="handleDelete"
          @upload-source="handleUploadSource"
        />
      </div>
    </div>
  </div>
</template>
