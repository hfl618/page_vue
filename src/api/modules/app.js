import request from '../request'

/**
 * @description 获取应用初始化全量数据 (聚合接口)
 */
export const fetchAppInitData = () => {
  return request.get('/v1/app/init')
}
