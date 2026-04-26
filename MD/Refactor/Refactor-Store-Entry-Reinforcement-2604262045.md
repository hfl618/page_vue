# Refactor-Store-Entry-Reinforcement-2604262045

## 1. 概括说明
完成了全站入口文件（App.vue/main.js）与全局状态管理（Store）的加固。通过升级 Setup Store 风格和完善组件自动导入，实现了项目底座的极致精简。

## 2. 变更详情
- **入口优化**: 
  - `App.vue`: 移除所有显式导入。利用 `unplugin-vue-components` 自动管理布局与全局 UI 组件。
  - `vite.config.js`: 扩展自动导入路径，涵盖 `src/layouts`。
- **Store 升级**: 
  - `userStore`: 升级为 Setup 语法。集成 `src/utils/storage.js` 处理 Token 逻辑，消除硬编码。
  - `uiStore`: 升级为 Setup 语法。重构 Loading 模拟算法，增加 8s 物理保底机制，提升系统容错率。
- **基础设施同步**: 确保所有 Store 动作（Actions）均符合解耦规范，不再包含冗余的 UI 操作。

## 3. 维护规范
- **新状态**: 优先在现有 Store 扩展，若涉及新业务大类，在 `src/store/` 下建立新的 `.js` 文件。
- **持久化**: 统一使用 `storage` 工具，严禁在 Store 之外直接操作 `localStorage`。

## 4. 架构里程碑
全站核心链路（API -> Store -> Hook -> View -> Component）已实现 100% 工业化重构。
