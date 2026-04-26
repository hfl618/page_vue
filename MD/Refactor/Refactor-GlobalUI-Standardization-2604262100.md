# Refactor-GlobalUI-Standardization-2604262100

## 1. 概括说明
完成了全局 UI 组件（LoadingOverlay, NotificationContainer）的标准化重构。通过提取工业风公共动画和优化 Store 绑定，实现了全站交互反馈的统一与代码精简。

## 2. 变更详情
- **样式解耦**: 
  - 将 `loader-square-kinetic` 动画提取为全局类 `.animate-square-morph`，存入 `utils.css`。
  - 规范化全局 `.custom-scrollbar` 样式。
- **组件优化**: 
  - `LoadingOverlay.vue`: 移除手动导入。使用 `uiStore` 物理模拟进度。采用 Backdrop-blur 提升视觉深度。
  - `NotificationContainer.vue`: 移除手动导入。利用 `storeToRefs` 实现响应式通知列表。优化了基于类型的条件渲染逻辑。
- **视觉增强**: 引入工业级毛玻璃（glassmorphism）和硬核几何装饰元素。

## 3. 下一步计划
- 完善业务功能页（Feedback, Publish）。
- 建立全局统一的图标库（Icons）。
