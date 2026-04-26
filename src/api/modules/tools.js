import request from '../request'

/**
 * @description 获取云端工具列表
 * @param {Object} config Axios 配置 (包含 params, timeout 等)
 */
export const fetchCloudTools = (config = {}) => {
  return request.get('/v1/tools/list', config)
}

/**
 * @description 切换工具收藏状态
 */
export const toggleToolFavorite = (toolId) => {
  return request.post('/v1/tools/favorite', { id: toolId })
}
