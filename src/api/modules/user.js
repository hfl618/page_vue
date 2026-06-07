/**
 * @module User
 * @description 用户信息与个人设置模块
 */

import request from '@/api/request'

/**
 * @description 获取当前登录用户的详细个人档案
 * @param {Object} [config] axios 配置
 * @returns {Promise<Object>} 用户资料对象
 */
export const fetchMe = (config = {}) => request.get('/v1/user/me', config)

/**
 * @description 获取当前用户的全量收藏 ID 列表
 * @returns {Promise<Object>} 包含文章和工具收藏 ID 的对象
 */
export const fetchUserFavorites = () => request.get('/v1/user/favorites', { hideLoading: true })

/**
 * @description 更新用户个人资料
 * @param {Object} data 待更新的用户字段
 * @param {Object} [config] axios 配置
 * @returns {Promise}
 */
export const updateProfile = (data, config = {}) => request.post('/v1/user/update', data, config)
