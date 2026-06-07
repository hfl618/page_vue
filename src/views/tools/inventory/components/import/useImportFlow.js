import { ref, reactive, computed } from 'vue'

export function useImportFlow() {
  const state = reactive({
    show: false,
    step: 1,
    totalRows: 0,
    columns: ['MPN', 'Name', 'Category', 'Stock', 'Price', 'Bin'], // 模拟解析出的列
    mapping: {},
    raw_data: [],
    conflicts: [
      { 
        id: 1, 
        new: { name: 'ESP32-S3', model: 'WROOM-1', package: 'SMD', quantity: 50, price: '15.0', location: 'BOX-1', remark: 'Batch A' },
        old: { name: 'ESP32-S3', model: 'WROOM-1', package: 'SMD', quantity: 20, price: '14.5', location: 'SHELF-2', remark: 'Old stock' },
        diff: { quantity: true, price: true, location: true }
      }
    ],
    uniques: new Array(12).fill({}), // 模拟新数据
    strategies: ['add'] // 冲突解决策略
  })

  const open = () => {
    state.show = true
    state.step = 1
  }

  const close = () => {
    state.show = false
  }

  const next = () => { if (state.step < 3) state.step++ }
  const back = () => { if (state.step > 1) state.step-- }

  return { state, open, close, next, back }
}
