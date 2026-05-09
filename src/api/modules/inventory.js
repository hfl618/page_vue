import request from '@/api/request'

/**
 * @description 元器件管理 API 模块
 */
export const inventoryApi = {
  /**
   * 获取元器件列表
   * @param {Object} params { search, category, page, limit }
   */
  getComponents: (params) => request.get('/v1/inventory/components', { params }),

  /**
   * 获取所有分类
   */
  getCategories: () => request.get('/v1/inventory/categories'),

  /**
   * 添加元器件
   */
  addComponent: (data) => request.post('/v1/inventory/components', data),

  /**
   * 更新元器件信息
   */
  updateComponent: (id, data) => request.patch(`/v1/inventory/components/${id}`, data),

  /**
   * 删除元器件 (支持批量)
   * @param {Array} ids 
   */
  deleteComponents: (ids) => request.delete('/v1/inventory/delete', { data: { ids } }),

  /**
   * 调整库存
   * @param {string|number} id 
   * @param {number} delta 增量 (+1 或 -1)
   */
  adjustStock: (id, delta) => request.post(`/v1/inventory/components/${id}/stock`, { delta })
}
