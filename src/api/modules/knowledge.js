/**
 * @module Knowledge
 * @description 知识库与内容管理模块
 */

import request from '@/api/request'

/**
 * @description 获取当前登录用户的个人文章列表
 * @returns {Promise<Array>} 文章对象数组
 */
export const fetchUserArticles = () => request.get('/v1/user/articles')

/**
 * @description 获取全站公共探索文章列表
 * @param {Object} [config] - axios 配置
 * @returns {Promise<Array>}
 */
export const fetchPublicArticles = (config = {}) => request.get('/v1/knowledge/list', config)

/**
 * @description 根据 ID 获取单篇文章详情
 * @param {string|number} id 文章唯一标识
 * @param {Object} [config] - axios 配置
 * @returns {Promise<Object>} 文章详情数据
 */
export const fetchArticleDetail = (id, config = {}) => request.get(`/v1/knowledge/read/${id}`, config)
