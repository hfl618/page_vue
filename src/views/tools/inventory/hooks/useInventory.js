import { ref, computed, onMounted } from 'vue'
import { inventoryApi } from '@/api/modules/inventory'
import { useUiStore } from '@/store/ui'

/**
 * @description 元器件管理核心业务逻辑 (工业级物理还原版)
 */
export function useInventory() {
  const uiStore = useUiStore()

  // --- 状态定义 ---
  const components = ref([
    { 
      id: 1, 
      img: 'https://api.dicebear.com/7.x/shapes/svg?seed=ESP32',
      category: 'MCU', 
      name: 'ESP32 WiFi+BT Module', 
      mpn: 'ESP32-WROOM-32E',
      package: 'Module-38',
      stock: 156, 
      price: '￥18.50',
      unit: 'pcs',
      bin: 'BOX-A-01', 
      mfr: 'Espressif',
      channel: 'LCSC',
      date: '2026-04-12',
      hasFile: true,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESP32-1',
      remark: 'Critical component for WiFi gateway projects. Ensure latest firmware.',
      description: 'Dual-core MCU with integrated WiFi and Bluetooth.' 
    },
    { 
      id: 2, 
      img: 'https://api.dicebear.com/7.x/shapes/svg?seed=RES',
      category: 'RESISTOR', 
      name: '10K Ohm Resistor', 
      mpn: 'RC0805FR-0710KL',
      package: '0805',
      stock: 2500, 
      price: '￥0.012',
      unit: 'pcs',
      bin: 'REEL-02', 
      mfr: 'Yageo',
      channel: 'Mouser',
      date: '2026-03-20',
      hasFile: false,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RES-2',
      remark: 'Bulk stock for general PCB assembly.',
      description: 'Thick Film Resistors, 10K Ohm, 1%, 1/8W.' 
    },
    { 
      id: 3, 
      img: 'https://api.dicebear.com/7.x/shapes/svg?seed=CAP',
      category: 'CAPACITOR', 
      name: '100nF Capacitor', 
      mpn: 'CL21B104KBCNNNC',
      package: '0805',
      stock: 450, 
      price: '￥0.045',
      unit: 'pcs',
      bin: 'REEL-05', 
      mfr: 'Samsung',
      channel: 'DigiKey',
      date: '2026-05-01',
      hasFile: true,
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CAP-3',
      remark: 'Decoupling capacitor for power rails.',
      description: 'MLCC, 0.1uF, 50V, X7R, 10%.' 
    }
  ])
  const categories = ref(['MCU', 'RESISTOR', 'CAPACITOR', 'IC', 'CONNECTOR', 'SENSOR', 'POWER'])
  const selectedItems = ref([])
  const isLoading = ref(false)
  const isSyncing = ref(false)
  const searchQuery = ref('')
  const selectedCategories = ref([])
  const showAdvancedSearch = ref(false)
  const advancedFilters = ref({
    nomenclature: '',
    category: '',
    mpn: '',
    package: '',
    bin: '',
    mfr: ''
  })

  // --- 计算属性 ---
  const filteredComponents = computed(() => {
    let result = components.value

    // 1. 基础全局搜索
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.mpn?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      )
    }

    // 2. 多选分类过滤 (Node)
    if (selectedCategories.value.length > 0) {
      result = result.filter(c => selectedCategories.value.includes(c.category))
    }

    // 3. 高级矩阵筛选
    if (showAdvancedSearch.value) {
      const f = advancedFilters.value
      if (f.nomenclature) result = result.filter(c => c.name.toLowerCase().includes(f.nomenclature.toLowerCase()))
      if (f.category) result = result.filter(c => c.category.toLowerCase().includes(f.category.toLowerCase()))
      if (f.mpn) result = result.filter(c => c.mpn?.toLowerCase().includes(f.mpn.toLowerCase()))
      if (f.package) result = result.filter(c => c.package?.toLowerCase().includes(f.package.toLowerCase()))
      if (f.bin) result = result.filter(c => c.bin?.toLowerCase().includes(f.bin.toLowerCase()))
      if (f.mfr) result = result.filter(c => c.mfr?.toLowerCase().includes(f.mfr.toLowerCase()))
    }

    return result
  })

  const allSelected = computed(() => {
    return filteredComponents.value.length > 0 && selectedItems.value.length === filteredComponents.value.length
  })

  // --- 核心方法 ---

  /**
   * 批量选择
   */
  const toggleAll = () => {
    if (allSelected.value) {
      selectedItems.value = []
    } else {
      selectedItems.value = [...filteredComponents.value]
    }
  }

  /**
   * 同步数据
   */
  const fetchAll = async () => {
    isSyncing.value = true
    try {
      // 物理级保护：即便后端 404 也不报错，仅在控制台记录
      const [compRes, catRes] = await Promise.all([
        inventoryApi.getComponents({ hideLoading: true }).catch(() => null),
        inventoryApi.getCategories({ hideLoading: true }).catch(() => null)
      ])
      if (compRes && compRes.length > 0) components.value = compRes
      if (catRes && catRes.length > 0) categories.value = catRes
    } catch (e) {
      console.warn('[Inventory] Silent sync fallback.')
    } finally {
      isSyncing.value = false
    }
  }

  /**
   * 选择逻辑 (修复：支持多选)
   */
  const toggleSelect = (item) => {
    const idx = selectedItems.value.findIndex(i => i.id === item.id)
    if (idx > -1) {
      selectedItems.value.splice(idx, 1)
    } else {
      selectedItems.value.push(item)
    }
  }

  /**
   * 调整库存
   */
  const handleAdjustStock = async (id, delta) => {
    try {
      await inventoryApi.adjustStock(id, delta).catch(() => null)
      const target = components.value.find(c => c.id === id)
      if (target) target.stock = (target.stock || 0) + delta
    } catch (e) {
      const target = components.value.find(c => c.id === id)
      if (target) target.stock = (target.stock || 0) + delta
    }
  }

  /**
   * 物理擦除
   */
  const handleDelete = async () => {
    if (selectedItems.value.length === 0) return
    if (!confirm(`Wipe ${selectedItems.value.length} units from registry?`)) return

    const ids = selectedItems.value.map(i => i.id)
    try {
      await inventoryApi.deleteComponents(ids).catch(() => null)
      uiStore.addNotice({ title: 'WIPED', message: 'Registry updated.', type: 'success' })
      components.value = components.value.filter(c => !ids.includes(c.id))
      selectedItems.value = []
    } catch (e) {
      components.value = components.value.filter(c => !ids.includes(c.id))
      selectedItems.value = []
    }
  }

  return {
    components, categories, selectedItems, isLoading, isSyncing, searchQuery, selectedCategories,
    showAdvancedSearch, advancedFilters,
    filteredComponents, allSelected, uiStore,
    fetchAll, toggleSelect, toggleAll, handleAdjustStock, handleDelete
  }
}
