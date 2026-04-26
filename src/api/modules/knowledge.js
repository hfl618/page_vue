import request from '../request'

/**
 * 知识库模块 API
 */

// 获取当前用户的个人文章列表 (用于 Profile 页)
export const fetchUserArticles = () => request.get('/v1/user/articles')

// 获取公共探索列表 (用于 Knowledge 主页)
export const fetchPublicArticles = () => request.get('/v1/knowledge/list')

// 获取单篇文章详情
export const fetchArticleDetail = (id) => request.get(`/v1/knowledge/read/${id}`)
