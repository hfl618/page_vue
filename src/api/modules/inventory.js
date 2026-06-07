import request from '@/api/request'

/**
 * @description 元器件管理 API 模块 (对齐 Backend V1 文档)
 */
export const inventoryApi = {
  /**
   * 获取元器件列表
   * @param {Object} params { search, category, location, model }
   */
  getComponents: (params) => request.get('/v1/inventory/components', { params }),

  /**
   * 获取所有分类
   */
  getCategories: () => request.get('/v1/inventory/categories'),

  /**
   * 单项入库 (注册新元器件)
   */
  addComponent: (data) => request.post('/v1/inventory/components', data),

  /**
   * 更新元器件信息 (非库存属性)
   */
  updateComponent: (id, data) => request.put(`/v1/inventory/components/${id}`, data),

  /**
   * 批量删除
   * @param {Array} ids 
   */
  deleteComponents: (ids) => request.delete('/v1/inventory/components', { data: { ids } }),

  /**
   * 库存微调 (高频接口)
   * @param {string|number} id 
   * @param {number} delta 增量 (+1 或 -1)
   */
  adjustStock: (id, delta) => request.post(`/v1/inventory/components/${id}/stock`, { delta }, { hideLoading: true }),

  /**
   * 附件上传 (R2 云存储)
   * @param {string|number} id 
   * @param {File} file 
   * @param {string} type 'image' | 'doc' | 'qr'
   */
  uploadSource: (id, file, type) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return request.post(`/v1/inventory/components/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      hideLoading: true
    })
  },

  /**
   * 高可用 QR 上传 (服务端轮询)
   * @param {string|number} id
   */
  uplinkQr: (id) => request.post(`/v1/inventory/components/${id}/uplink-qr`, {}, { hideLoading: true }),

  /**
   * 彻底删除附件资源 (物理清理 R2)
   * @param {string|number} id 
   * @param {string} type 'image' | 'doc' | 'qr'
   */
  deleteSource: (id, type) => request.delete(`/v1/inventory/components/${id}/source`, { 
    data: { type },
    hideLoading: true 
  }),

  // --- 批量导入三段式协议 ---

  /**
   * 第一阶段：数据解析 (Parse)
   * @param {Object} data { file, text, firstRowIsHeader }
   */
  importParse: (data) => request.post('/v1/inventory/import/parse', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  /**
   * 第二阶段：冲突预检 (Verify)
   * @param {Object} data { rows, mapping }
   */
  importVerify: (data) => request.post('/v1/inventory/import/verify', data),

  /**
   * 第三阶段：正式执行 (Execute)
   * @param {Object} data { strategies, uniques }
   */
  importExecute: (data) => request.post('/v1/inventory/import/execute', data)
}
