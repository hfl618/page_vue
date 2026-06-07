<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useInventory } from './hooks/useInventory'
import { inventoryApi } from '@/api/modules/inventory'
import InventoryToolbar from './components/InventoryToolbar.vue'
import InventoryTable from './components/InventoryTable.vue'
import InventoryDetailPanel from './components/InventoryDetailPanel.vue'
import InventoryCreateHub from './components/create-hub/InventoryCreateHub.vue'
import { useCreateHub } from './components/create-hub/useCreateHub'

/**
 * @description 元器件管理主视图 (Raw Schema 1:1 版)
 */
const {
  components, categories, selectedItems, isSyncing, searchQuery, selectedCategories,
  showAdvancedSearch, advancedFilters, sortState,
  filteredComponents, allSelected, uiStore,
  fetchAll, toggleSelect, toggleAll, handleAdjustStock, handleDelete, handleSort
} = useInventory()

const createHub = useCreateHub()

/**
 * 表格列定义 - 严格对齐数据库原始字段 (Raw Schema)
 */
const columns = [
  { key: 'img_path', label: 'Img', width: '5%', align: 'center' },
  { key: 'category', label: 'Category', width: '10%', align: 'center', sortable: true },
  { key: 'name', label: 'Name', width: '15%', align: 'left', sortable: true },
  { key: 'model', label: 'MPN / Package', width: '20%', align: 'left', sortable: true },
  { key: 'quantity', label: 'Stock', width: '6%', align: 'center', sortable: true },
  { key: 'price', label: 'Price / Unit', width: '10%', align: 'center', sortable: true },
  { key: 'location', label: 'Bin', width: '8%', align: 'center', sortable: true },
  { key: 'supplier', label: 'Mfr / Channel', width: '12%', align: 'left', sortable: true },
  { key: 'actions', label: 'Actions', width: '11%', align: 'center' }
]

/**
 * 自动为指定 ID 生成并上传二维码 (高可用版)
 * NEW: This now calls the backend endpoint to perform the fetch and upload.
 */
const autoUplinkQR = async (id) => {
  console.log(`[Auto-QR] Generating manifest for Node #${id}...`)
  try {
    const res = await inventoryApi.uplinkQr(id)
    const newPath = res?.url || res?.data?.url
    if (newPath) {
      console.log(`[Auto-QR] Pipeline Complete. Cloud Resource: ${newPath}`)
      return newPath
    } else {
      throw new Error(res?.message || 'QR uplink failed')
    }
  } catch (e) {
    console.error(`[Auto-QR] Pipeline Crash:`, e)
    uiStore.addNotice({ 
      title: 'QR_GENERATION_FAILED', 
      message: e.message || 'Network error or no reachable QR providers.', 
      type: 'error',
      tag: 'qr-uplink-error'
    })
    return null
  }
}

const handleSubmitManual = async () => {
  const form = createHub.state.form
  const editingId = createHub.state.editingId
  try {
    // 物理对齐防重
    const targetName = (form.name || '').trim().toLowerCase()
    const targetModel = (form.model || '').trim().toLowerCase()
    
    if (!editingId && targetName && targetModel) {
      const isDuplicate = components.value.some(c => 
        (c.name || '').trim().toLowerCase() === targetName &&
        (c.model || '').trim().toLowerCase() === targetModel
      )
      if (isDuplicate) {
        uiStore.addNotice({ title: 'CONFLICT', message: `Registry Error: Node already exists.`, type: 'warning' })
        return
      }
    }

    uiStore.showLoading('COMMITTING', 'Verifying registry payload...')
    const cleanPayload = {
      category: form.category,
      name: form.name,
      model: form.model,
      package: form.package,
      quantity: parseInt(form.quantity) || 0,
      unit: form.unit,
      price: parseFloat(form.price) || 0.0,
      supplier: form.supplier,
      channel: form.channel,
      location: form.location,
      buy_time: form.buy_time,
      remark: form.remark
    }

    if (editingId) {
      await inventoryApi.updateComponent(editingId, cleanPayload)
      // 同步更新本地 QR
      const newQrPath = await autoUplinkQR(editingId)
      if (newQrPath) {
        const item = components.value.find(c => c.id === editingId)
        if (item) item.qrcode_path = newQrPath
      }
      uiStore.addNotice({ title: 'UPDATED', message: 'Registry synchronized.', type: 'success' })
    } else {
      const res = await inventoryApi.addComponent(cleanPayload)
      if (res?.id) await autoUplinkQR(res.id)
      uiStore.addNotice({ title: 'REGISTERED', message: 'Physical node registered.', type: 'success' })
    }
    createHub.close()
    createHub.resetForm()
    setTimeout(fetchAll, 1000)
  } catch (e) {
    console.error('[Registry] Operation Failed:', e)
  } finally {
    uiStore.hideLoading()
  }
}

const handleExecuteBulk = async () => {
  uiStore.showLoading('SYNCING', 'Ingesting batch payload...')
  for (const row of createHub.state.rawData) {
    const data = {}
    createHub.state.columns.forEach((col, i) => { data[col] = row[i] })
    data.quantity = parseInt(data.quantity) || 0
    data.price = parseFloat(data.price) || 0
    const res = await inventoryApi.addComponent(data).catch(() => null)
    if (res?.id) await autoUplinkQR(res.id)
  }
  uiStore.addNotice({ title: 'BATCH_SUCCESS', message: 'Matrix ingested.', type: 'success' })
  createHub.close()
  await fetchAll()
  uiStore.hideLoading()
}

const handleDeleteSource = async (type) => {
  const targetId = selectedItems.value[0]?.id
  if (!targetId) return
  try {
    await inventoryApi.deleteSource(targetId, type)
    uiStore.addNotice({ title: 'WIPED', message: 'Cloud resource removed.', type: 'success' })
    await fetchAll()
  } catch (e) {}
}

const handleUploadSource = async ({ type, file }) => {
  const target = selectedItems.value[0]
  if (!target || (!file && type !== 'qr')) return
  try {
    if (type === 'qr') {
      const newQrPath = await autoUplinkQR(target.id)
      if (newQrPath) target.qrcode_path = newQrPath
    } else {
      const res = await inventoryApi.uploadSource(target.id, file, type)
      if (res?.url) {
        if (type === 'image') target.img_path = res.url
        if (type === 'doc') target.doc_path = res.url
      }
    }
    uiStore.addNotice({ title: 'SYNCED', message: 'Physical resources synchronized.', type: 'success' })
    // fetchAll 作为后端最终落盘确认
    await fetchAll()
  } finally {}
}

const handleOutbound = () => uiStore.addNotice({ title: 'OUTBOUND', message: 'Ready.', type: 'info' })

const handleEdit = (item) => createHub.open('manual', item)

const handleGlobalEsc = (e) => {
  if (e.key === 'Escape') {
    if (createHub.state.show) createHub.close()
    else if (selectedItems.value.length > 0) selectedItems.value = []
  }
}

watch(() => [selectedItems.value.length, createHub.state.show], ([count, hubShow]) => {
  if (count > 0 || hubShow) window.addEventListener('keydown', handleGlobalEsc)
  else window.removeEventListener('keydown', handleGlobalEsc)
})

onUnmounted(() => window.removeEventListener('keydown', handleGlobalEsc))
onMounted(fetchAll)
</script>

<template>
  <div class="h-full flex flex-col bg-[#fafafa]" translate="no">
    <div class="flex-1 overflow-hidden p-6">
      <div class="max-w-[1600px] mx-auto h-full flex flex-col bg-white border border-zinc-100 shadow-sm overflow-hidden">
        
        <InventoryToolbar 
          v-model:search-query="searchQuery"
          v-model:show-advanced-search="showAdvancedSearch"
          :advanced-filters="advancedFilters"
          :is-syncing="isSyncing"
          :selected-count="selectedItems.length"
          @add="createHub.open('manual')"
          @outbound="handleOutbound"
          @batch-delete="handleDelete"
        />

        <InventoryTable 
          :columns="columns"
          :items="filteredComponents"
          :selected-items="selectedItems"
          :all-selected="allSelected"
          :sort-key="sortState.key"
          :sort-order="sortState.order"
          @toggle-all="toggleAll"
          @toggle-select="toggleSelect"
          @edit="handleEdit"
          @adjust-stock="handleAdjustStock"
          @sort="handleSort"
        />

        <InventoryDetailPanel 
          :selected-items="selectedItems"
          @adjust-stock="handleAdjustStock"
          @sync="fetchAll"
          @edit="handleEdit"
          @delete="handleDelete"
          @upload-source="handleUploadSource"
          @delete-source="handleDeleteSource"
        />

        <InventoryCreateHub 
          :show="createHub.state.show"
          :state="createHub.state"
          @close="createHub.close"
          @submit-manual="handleSubmitManual"
          @execute-bulk="handleExecuteBulk"
        />
      </div>
    </div>
  </div>
</template>
