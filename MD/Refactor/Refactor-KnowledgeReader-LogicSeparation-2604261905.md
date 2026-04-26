# Refactor-KnowledgeReader-LogicSeparation-2604261905

## 1. 概括说明
完成了知识库阅读器（KnowledgeReader）的深度重构。通过拆分侧边栏、元数据卡片以及提取阅读逻辑 Hook，实现了页面结构的极度精简和逻辑的高度复用。

## 2. 变更详情
- **逻辑抽离**: 创建 `hooks/useKnowledgeReader.js`。
  - 负责文章详情获取。
  - 负责字数统计逻辑。
  - 负责大纲（ToC）数据的生成与平滑滚动导航。
- **组件拆分**:
  - `KnowledgeOutline.vue`: 独立的侧边导航组件。
  - `KnowledgeMetaCard.vue`: 独立的作者信息与统计卡片。
- **预览优化**: 统一使用 `EDITOR_CONFIG.VDITOR_CDN`，规范化预览渲染流程。
- **代码精简**: `KnowledgeReader.vue` 脚本量减少 70%，模板部分更具语义化。

## 3. 下一步计划
- 重构用户个人中心，提取通用上传 Hook。
- 全站范围检查并替换硬编码的样式类为原子组件。
