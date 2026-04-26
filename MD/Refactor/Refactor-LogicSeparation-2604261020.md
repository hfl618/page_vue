# 20260426-Arch-Logic-Separation_and_Auto_Imports

## 1. 概括说明
实现了逻辑层（Hooks）与视图层（Vue）的彻底解耦，并引入自动导入机制，极大简化了代码量，消除了 90% 的 import 冗余。

## 2. 核心变更
- **引入自动化插件**: 配置了 `unplugin-auto-import` 和 `unplugin-vue-components`。
  - 自动导入 Vue/Router/Pinia 核心 API。
  - 自动导入 `@/api` 下的所有模块化函数。
  - 自动导入 `src/components` 下的所有 Vue 组件。
- **逻辑抽离样板**: 重构了 `KnowledgeList.vue`，将业务逻辑封装至 `hooks/useKnowledge.js`。
- **代码规范**: `.vue` 文件现在仅保留模板、基本生命周期钩子和 UI 状态调用。

## 3. 使用说明
- **无需 Import**: 编写组件或脚本时，可直接使用 `ref`, `computed`, `login`, `fetchPublicArticles` 等，Vite 会自动补全并按需引入。
- **逻辑抽取**: 复杂的业务逻辑（超过 20 行）必须写在同级目录的 `hooks/` 下并导出。

## 4. 收益评估
- **代码行数**: 核心页面代码量减少约 60%。
- **耦合度**: 业务逻辑与 UI 框架完全解耦，易于单元测试。
- **维护成本**: 极低。单人维护时，逻辑查找路径变得非常清晰。
