# Refactor-Router-Header-Automation-2604262015

## 1. 概括说明
实现了全局顶栏（GlobalHeader）的“自动驾驶”模式。通过将页面标题与层级关系下沉至路由元数据（Router Meta），消除了在 Layout 和 View 层手动传递 UI 状态的冗余。

## 2. 变更详情
- **路由增强**: 
  - 在 `src/router/index.js` 中为所有路由配置了 `meta.title`。
  - 为二级路由配置了 `meta.parent`（如编辑器页指向注册页）。
- **逻辑自动化**: 
  - 重构 `useHeader.js`，通过 `useRoute()` 实时计算 `parentLabel` 和 `currentLabel`。
  - 路由守卫自动根据元数据展示 Loading 状态。
- **Props 消除**: 
  - `GlobalHeader.vue` 移除所有标题相关的 Props，完全由逻辑 Hook 驱动。
  - `MainLayout.vue` 删除了复杂的路由监听与状态协调代码。

## 3. 维护规范
- **新增页面**: 只需在 `router/index.js` 中定义 `title` (必填) 和 `parent` (可选)，顶栏将自动同步。

## 4. 下一步计划
- 完善全局状态持久化机制。
- 引入原子样式扫描工具。
