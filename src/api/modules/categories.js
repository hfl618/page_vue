import request from '../request'

/**
 * @description 获取全部分类池
 */
export const fetchCategories = () => {
  return request.get('/v1/categories/list', { hideLoading: true })
}
