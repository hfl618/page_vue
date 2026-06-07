import { reactive } from 'vue'

export function useCreateHub() {
  const getNow = () => {
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000
    return new Date(now - offset).toISOString().slice(0, 16)
  }

  const state = reactive({
    show: false,
    mode: 'manual',
    bulkStep: 1,
    editingId: null, // 追踪是否处于编辑模式
    form: {
      category: '',
      name: '',
      model: '',
      package: '',
      quantity: 0,
      unit: 'pcs',
      price: 0,
      supplier: '',
      channel: '',
      location: '',
      buy_time: getNow(),
      remark: ''
    }
  })

  /**
   * 打开中心
   * @param {string} mode 模式
   * @param {Object} item 可选：回填的数据项
   */
  const open = (mode = 'manual', item = null) => {
    state.mode = mode
    state.show = true
    
    if (item) {
      state.editingId = item.id
      // 深度回填：确保所有字段对齐后端原生命名
      Object.keys(state.form).forEach(key => {
        state.form[key] = item[key] !== undefined ? item[key] : state.form[key]
      })
    } else {
      state.editingId = null
      resetForm()
    }
  }

  const close = () => {
    state.show = false
  }

  const resetForm = () => {
    state.form.category = ''
    state.form.name = ''
    state.form.model = ''
    state.form.package = ''
    state.form.quantity = 0
    state.form.unit = 'pcs'
    state.form.price = 0
    state.form.supplier = ''
    state.form.channel = ''
    state.form.location = ''
    state.form.buy_time = getNow()
    state.form.remark = ''
  }

  return { state, open, close, resetForm }
}
