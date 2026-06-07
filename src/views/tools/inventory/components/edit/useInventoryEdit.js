import { reactive } from 'vue'

export function useInventoryEdit() {
  const state = reactive({
    show: false,
    mode: 'add', // 'add' | 'edit'
    form: {
      name: '',
      category: '',
      model: '',
      package: '',
      quantity: 0,
      price: 0,
      supplier: '',
      channel: '',
      location: '',
      unit: 'pcs',
      buy_time: '',
      remark: ''
    }
  })

  const open = (mode = 'add', initialData = null) => {
    state.mode = mode
    state.show = true
    if (initialData) {
      Object.assign(state.form, initialData)
    } else {
      // 重置表单
      Object.keys(state.form).forEach(key => {
        state.form[key] = key === 'quantity' || key === 'price' ? 0 : (key === 'unit' ? 'pcs' : '')
      })
    }
  }

  const close = () => {
    state.show = false
  }

  return { state, open, close }
}
