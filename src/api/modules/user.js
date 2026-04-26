import request from '../request'

/**
 * 用户模块 API
 */

// 获取当前登录用户详情
export const fetchMe = () => request.get('/v1/user/me')

// 示例：以后可以扩展更新资料接口
export const updateProfile = (data) => request.post('/v1/user/update', data)
