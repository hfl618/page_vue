# 2604262210-Arch-MajorRefactor-Summary (架构大重构总结)

## 1. 概括说明
本次更新完成了全站的工业化重构，核心目标是实现“单人高效维护”与“0 代码冗余”。通过逻辑抽离和自动化工具，将原本臃肿的页面精简了 60% 以上，并修复了因自动导入配置不全导致的运行时错误。

## 2. 核心架构变更
- **自动化集成 (unplugin-auto-import)**:
  - **Hooks & Stores 自动扫描**: 全站 `src/**/hooks` 和 `src/store/**` 目录下的导出函数均可直接使用，无需 Import。
  - **组件自动导入**: `src/components` 和 `src/layouts` 下的组件均可直接在模板使用（支持深层扫描）。
- **逻辑视图分离**: 建立了完整的 `hooks/` 体系。
  - 每个功能模块（Auth, Knowledge, User, Tools）均有对应的 Hook 处理数据流。
- **组件分类管理**:
  - `src/components/common/base/`: 原子级 UI 元素 (Input, Button, Switch, FileUpload)。
  - `src/components/common/feedback/`: 全局反馈 (Loading, Notification, IndustrialIndicator)。
  - `src/components/common/cards/`: 业务展示卡片 (ArticleCard, ToolCard)。
- **状态管理升级**:
  - 全量升级 Pinia 为 **Setup Store** 风格，提升逻辑复用性与可读性。

## 3. 组件使用指南 (高度自定义)
所有的 `Base` 组件均支持透传 Tailwind 类名。
- **自定义宽度示例**: `<BaseInput class="w-64" />` 或 `<BaseButton class="w-auto px-12">`。
- **受控模式**: 统一使用 `v-model` 进行双向绑定。

## 4. 故障修复记录
- **修复**: 解决了 `useUserSettings`, `useHeader`, `useUiStore` 等的 `ReferenceError`。
- **原因**: Vite 自动导入扫描路径未包含自定义 Hooks 和 Stores 目录。
- **对策**: 补全了 `vite.config.js` 中的 `dirs` 配置，涵盖了所有逻辑存放路径。

## 5. 后续维护
- 只有发生**重大架构变动**或**新功能模块上线**时才更新此文件夹下的 MD。
- 所有的细节变更应体现在代码注释（JSDoc）中。
