# 20260426-Arch-Refactor-Constants_and_Utils_Setup

## 1. 概括说明
通过建立常量层（Constants）和工具层（Utils），消除了代码中的硬编码，增强了系统的可维护性和健壮性。

## 2. 变更详情
- **API 模块优化**: 全量重构了 `knowledge.js` 和 `user.js`，增加了 JSDoc 注释。
- **引入常量管理**: 创建 `src/constants/index.js`，统一管理存储键名和响应状态码。
- **封装存储工具**: 创建 `src/utils/storage.js`，提供类型安全的本地存储操作。
- **请求拦截重构**: `request.js` 现在使用统一的常量和存储工具。

## 3. 使用方法说明
- **获取 Token**: 推荐使用 `storage.getToken()`。
- **判断请求成功**: 使用 `res.code === RESPONSE_CODES.SUCCESS`。

## 4. 下一步计划
- 梳理并重构通用 UI 组件。
- 提取常用的 Composable 逻辑（如分页、表单校验）。
