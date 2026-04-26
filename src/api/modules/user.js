/**
 * @module User
 * @description 用户信息与个人设置模块
 */

import request from '@/api/request'

/**
 * @description 获取当前登录用户的详细个人档案
 * @returns {Promise<Object>} 用户资料对象
 */
export const fetchMe = () => request.get('/v1/user/me')

/**
 * @description 更新用户个人资料
 * @param {Object} data 待更新的用户字段
 * @param {Object} [config] axios 配置
 * @returns {Promise}
 */
export const updateProfile = (data, config = {}) => request.post('/v1/user/update', data, config)
