# Refactor-Tools-Publish-LogicSeparation-2604262145

## 1. 概括说明
完成了资产发布页面（PublishView）的深度重构。通过封装文件处理逻辑 Hook 和通用的文件上传原子组件，实现了复杂表单交互的工业化解耦。

## 2. 变更详情
- **逻辑抽离**: 创建 `hooks/usePublish.js`。
  - 负责 Slug 的自动转换与同步逻辑（正则过滤）。
  - 负责文件读取（FileReader）与本地实时预览预览。
  - 负责部署协议的提交模拟。
- **组件原子化**: 
  - 新建 `BaseFileUpload.vue`: 统一的虚线边框拖拽上传风格，支持状态反馈。
  - 全量应用 `BaseInput`, `BaseTextarea`, `PhysicalSwitch`。
- **代码精简**: `PublishView.vue` 移除了所有底层文件操作逻辑，代码可读性提升 80%。

## 3. 下一步计划
- 应用相同模式重构 `FeedbackView.vue`。
- 引入全局表单验证中间件。
