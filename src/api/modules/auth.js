/**
 * @module Auth
 * @description 身份认证与权限控制模块
 */

import request from '@/api/request'

/**
 * @description 用户登录
 * @param {string} username 用户名/邮箱
 * @param {string} password 密码
 * @returns {Promise} 返回包含 Token 和用户信息的数据对象
 */
export const login = (username, password) => {
  return request.post('/v1/auth/login', { username, password }, {
    successMsg: 'Authentication Protocol Synchronized.'
  })
}

/**
 * @description 新用户注册
 * @param {string} username 用户名
 * @param {string} password 密码
 * @param {string} [firstName=''] 名
 * @param {string} [lastName=''] 姓
 */
export const signup = (username, password, firstName = '', lastName = '') => {
  return request.post('/v1/auth/signup', { username, password, firstName, lastName })
}

/**
 * @description 实时校验用户名是否已被占用
 * @param {string} username 待检查的用户名
 * @returns {Promise<{available: boolean}>}
 */
export const checkUsername = (username) => {
  return request.post('/v1/auth/check-username', { username }, { hideLoading: true })
}

/**
 * @description 退出登录并清除会话状态
 */
export const logout = () => {
  return request.get('/logout')
}
