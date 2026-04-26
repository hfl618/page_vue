# 2604260000-Archive-FullProjectRefactorHistory (项目架构重构历史汇总)

> 本文档汇总了 2026年4月26日 进行的全站架构深度重构记录。包含从初始化到各业务模块解耦的全过程。

---

## 1. 项目初始化与架构规范 (2604261000)
确立了项目的核心开发范式，旨在实现单人高效维护。
- **接口层**: 统一在 `src/api/` 管理，严禁组件内直接写 axios。
- **组件层**: 划分为原子组件(Base)、业务组件(Business)、布局组件(Layout)。
- **逻辑层**: 引入 `hooks/` 体系，实现逻辑与视图的绝对分离。
- **规范**: 强制 JSDoc 注释，路径别名优化（@api, @comp, @store 等）。

## 2. 逻辑解耦与自动化集成 (2604261020)
引入 `unplugin-auto-import` 和 `unplugin-vue-components`。
- **0 Import**: 全站 Vue 核心 API、路由、状态管理及自定义 Hooks 均实现自动按需导入。
- **组件零手动引入**: `src/components` 下的组件可直接在模板中使用。

## 3. 原子组件标准化 (2604261025)
建立了 `BaseInput`, `BaseButton`, `BaseTextarea`, `BaseFileUpload` 等原子组件库。
- **高度自定义**: 支持透传 Tailwind 类名（如 `<BaseInput class="w-64" />`）。
- **风格一致性**: 统一了阴影、边框、Loading 状态等工业风视觉语言。

## 4. 知识库模块重构 (2604261850 - 2604261905)
- **Editor**: 封装 `VditorEditor.vue` 受控组件，提取 `useKnowledgeEditor` Hook。
- **Reader**: 提取 `useKnowledgeReader`，实现大纲自动生成与平滑滚动导航。
- **List**: 提取 `useKnowledgeList`，处理复杂的分类筛选与分页逻辑。

## 5. 用户中心与设置重构 (2604261920 - 2604261935)
- **Settings**: 封装头像上传逻辑，采用响应式表单副本防止 Store 实时污染。
- **Profile**: 实现了全异步数据获取与 Store 状态的降级同步。

## 6. 发现页与搜索逻辑 (2604261945)
- **Discover**: 抽离 `useDiscover` Hook，集成了基于 `computed` 的高效工具筛选算法与 `localStorage` 导航偏好持久化。

## 7. 导航与布局自动化 (2604261955 - 2604262015)
- **Router Meta**: 顶栏标题与层级关系完全由路由元数据驱动。
- **GlobalHeader**: 实现了“自动驾驶”模式，自动识别返回路径与面包屑标题。

## 8. 入口与 Store 加固 (2604262045)
- **App.vue**: 实现最终极简，仅保留布局分发逻辑。
- **Setup Store**: 全量升级 Pinia 为 Setup 语法，提升逻辑复用性。

## 9. 全局 UI 标准化 (2604262100)
- **Loading & Notice**: 优化了物理模拟进度条算法，增强了 8s 强制保底机制。
- **动画提取**: 规范化工业风公共动画类（`.animate-square-morph`）。

## 10. 资产发布与反馈模块 (2604262145 - 2604262200)
- **Publish**: 实现了 Slug 自动生成正则过滤与本地 HTML 实时预览预览。
- **Feedback**: 提取了 `IndustrialIndicator` 通用状态组件。

---
*文档由 Gemini CLI 自动生成并归档。*
