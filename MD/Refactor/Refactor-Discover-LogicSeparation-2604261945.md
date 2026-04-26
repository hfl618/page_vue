# Refactor-Discover-LogicSeparation-2604261945

## 1. 概括说明
完成了发现页（Discover/Utility Archive）的重构。将工具筛选、分类持久化以及数据加载逻辑抽离至 Hook，使页面保持纯粹的渲染职能。

## 2. 变更详情
- **逻辑抽离**: 创建 `hooks/useDiscover.js`。
  - 负责工具列表的模拟数据加载（预留 API 接口）。
  - 负责分类导航的 `localStorage` 持久化逻辑。
  - 负责基于 `computed` 的高效工具筛选算法。
- **自动导入应用**: 利用 `ToolCard` 自动导入，移除了所有脚本内的手动引用。
- **动画保持**: 保留并优化了 `transition-group` 列表重排动画，通过 CSS 变量适配解耦后的网格布局。

## 3. 下一步计划
- 重构全局导航组件（Header/Sidebar）。
- 完善 API 模块的异常处理机制。
