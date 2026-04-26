/**
 * @description 系统级常量定义
 */

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'heflos_token',
  USER_INFO: 'heflos_user_info',
  THEME: 'heflos_theme_mode'
}

// 响应码配置
export const RESPONSE_CODES = {
  SUCCESS: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

// UI 提示类型
export const NOTICE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 编辑器配置
export const EDITOR_CONFIG = {
  VDITOR_CDN: 'https://cdn.jsdelivr.net/npm/vditor@3.9.6',
  DEFAULT_THEME: 'classic',
  UPLOAD_URL: '/api/upload'
}
