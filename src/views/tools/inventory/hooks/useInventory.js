import { ref, computed, onMounted, reactive } from 'vue'
import { inventoryApi } from '@/api/modules/inventory'
import { useUiStore } from '@/store/ui'

/**
 * @description 元器件管理核心业务逻辑 (1:1 绝对对齐版)
 * 职责：严格消费原始字段 (quantity, model, location, supplier, buy_time, img_path, qrcode_path)
 * 彻底废除语义化别名 (stock, mpn, bin, mfr, date)
 */
export function useInventory() {
  const uiStore = useUiStore()

  // --- 1. 基础状态 ---
  const components = ref([])
  const categories = ref(['MCU', 'RESISTOR', 'CAPACITOR', 'IC', 'CONNECTOR'])
  const selectedItems = ref([])
  const isSyncing = ref(false)
  const searchQuery = ref('')
  const selectedCategories = ref([])
  const showAdvancedSearch = ref(false)
  
  const sortState = reactive({
    key: 'name',
    order: 'asc'
  })

  // 6维筛选矩阵 (严格对齐物理字段)
  const advancedFilters = ref({
    name: '',
    category: '',
    model: '', // 改回 model
    package: '',
    location: '', // 改回 location
    supplier: ''  // 改回 supplier
  })

  // --- 2. 计算属性 (渲染逻辑) ---

  const filteredComponents = computed(() => {
    let result = [...components.value]

    // A. 基础模糊搜索 (对齐 model)
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c => 
        (c.name || '').toLowerCase().includes(q) || 
        (c.model || '').toLowerCase().includes(q) ||
        (c.remark || '').toLowerCase().includes(q)
      )
    }

    // B. 多选分类过滤
    if (selectedCategories.value.length > 0) {
      result = result.filter(c => selectedCategories.value.includes(c.category))
    }

    // C. 高级矩阵筛选 (严格对齐原始字段)
    if (showAdvancedSearch.value) {
      const f = advancedFilters.value
      if (f.name) result = result.filter(c => (c.name || '').toLowerCase().includes(f.name.toLowerCase()))
      if (f.category) result = result.filter(c => (c.category || '').toLowerCase().includes(f.category.toLowerCase()))
      if (f.model) result = result.filter(c => (c.model || '').toLowerCase().includes(f.model.toLowerCase()))
      if (f.package) result = result.filter(c => (c.package || '').toLowerCase().includes(f.package.toLowerCase()))
      if (f.location) result = result.filter(c => (c.location || '').toLowerCase().includes(f.location.toLowerCase()))
      if (f.supplier) result = result.filter(c => (c.supplier || '').toLowerCase().includes(f.supplier.toLowerCase()))
    }

    // D. 排序引擎 (三态逻辑)
    if (sortState.key && sortState.order) {
      result.sort((a, b) => {
        const valA = a[sortState.key] ?? ''
        const valB = b[sortState.key] ?? ''
        
        let comp = 0
        if (typeof valA === 'number' && typeof valB === 'number') {
          comp = valA - valB
        } else {
          comp = String(valA).localeCompare(String(valB))
        }
        
        return sortState.order === 'asc' ? comp : -comp
      })
    }

    return result
  })

  const allSelected = computed(() => {
    return filteredComponents.value.length > 0 && selectedItems.value.length === filteredComponents.value.length
  })

  // --- 3. 核心方法 (动作逻辑) ---

  const fetchAll = async () => {
    isSyncing.value = true
    try {
      const compRes = await inventoryApi.getComponents({ hideLoading: true })
      const catRes = await inventoryApi.getCategories({ hideLoading: true })
      
      // 直接使用 res.data (拦截器处理后的数组)
      if (Array.isArray(compRes)) {
        components.value = compRes
        // 自动重连引用，确保详情页同步
        if (selectedItems.value.length > 0) {
          selectedItems.value = selectedItems.value.map(oldItem => 
            components.value.find(newItem => newItem.id === oldItem.id) || oldItem
          )
        }
      }
      if (Array.isArray(catRes)) {
        categories.value = catRes
      }
    } catch (e) {
      console.warn('[Registry Sync] Uplink Connection Standby.')
    } finally {
      isSyncing.value = false
    }
  }

  const handleSort = ({ key, order }) => {
    sortState.key = key
    sortState.order = order
  }

  const toggleAll = () => {
    selectedItems.value = allSelected.value ? [] : [...filteredComponents.value]
  }

  const toggleSelect = (item) => {
    const idx = selectedItems.value.findIndex(i => i.id === item.id)
    if (idx > -1) {
      selectedItems.value.splice(idx, 1)
    } else {
      selectedItems.value.push(item)
    }
  }

  /**
   * 库存微调 (严格对齐 quantity)
   */
  const handleAdjustStock = async (id, delta) => {
    const target = components.value.find(c => c.id === id)
    if (!target) return

    const previousQuantity = target.quantity
    target.quantity = (parseInt(target.quantity) || 0) + delta

    try {
      const res = await inventoryApi.adjustStock(id, delta)
      if (res && res.new_quantity !== undefined) {
        target.quantity = res.new_quantity
      }
    } catch (e) {
      target.quantity = previousQuantity
    }
  }

  const handleDelete = async () => {
    if (selectedItems.value.length === 0) return
    if (!confirm(`Wipe ${selectedItems.value.length} physical units from registry?`)) return

    const ids = selectedItems.value.map(i => i.id)
    try {
      await inventoryApi.deleteComponents(ids)
      components.value = components.value.filter(c => !ids.includes(c.id))
      selectedItems.value = []
      uiStore.addNotice({ title: 'PURGED', message: 'Registry updated.', type: 'success' })
    } catch (e) {}
  }

  return {
    components, categories, selectedItems, isSyncing, searchQuery, selectedCategories,
    showAdvancedSearch, advancedFilters, sortState,
    filteredComponents, allSelected, uiStore,
    fetchAll, toggleSelect, toggleAll, handleAdjustStock, handleDelete, handleSort
  }
}
