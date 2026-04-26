# Refactor-KnowledgeEditor-LogicSeparation-2604261850

## 1. 概括说明
完成了知识库编辑器（KnowledgeEditor）的深度重构。通过封装受控编辑器组件和业务 Hook，实现了 DOM 操作与业务逻辑的彻底分离，代码可维护性显著提升。

## 2. 变更详情
- **逻辑抽离**: 创建 `hooks/useKnowledgeEditor.js`，统一管理文章获取、保存、字数统计及设计师抽屉状态。
- **组件封装**: 完善 `components/VditorEditor.vue`。
  - 实现 `v-model` 双向绑定。
  - 集成 `src/constants` 中的编辑器配置（CDN, 自动上传路径）。
  - 封装 Vditor 生命周期，防止内存泄漏。
- **UI 原子化**: 引入 `BaseButton` 和 `PhysicalSwitch` 替代原生元素。
- **代码精简**: `KnowledgeEditor.vue` 脚本量减少 60%，不再直接引入 API 和 Store。

## 3. 下一步计划
- 重构 `KnowledgeReader.vue`，实现阅读体验的组件化。
- 提取通用的图片上传 Hook (`useUpload`)。
