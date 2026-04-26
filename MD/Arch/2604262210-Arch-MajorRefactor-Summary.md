# 2604262210-Arch-MajorRefactor-Summary (架构大重构总结)

## 1. 概括说明
本次更新完成了全站的工业化重构，核心目标是实现“单人高效维护”与“0 代码冗余”。通过逻辑抽离和自动化工具，将原本臃肿的页面精简了 60% 以上。

## 2. 核心架构变更
- **自动化集成**: 引入 `unplugin-auto-import`。
  - **Hooks 自动扫描**: 全站 `src/**/hooks` 目录下的导出函数均可直接使用，无需 Import。
  - **组件自动导入**: `src/components` 和 `src/layouts` 下的组件均可直接在模板使用。
- **逻辑视图分离**: 建立了 `hooks/` 体系。
  - 每个功能模块（Auth, Knowledge, User, Tools）均有对应的 Hook 处理数据流。
- **组件分类管理**:
  - `components/common/base/`: 原子级 UI 元素 (Input, Button, Switch)。
  - `components/common/feedback/`: 全局反馈 (Loading, Notification)。
  - `components/common/cards/`: 业务展示卡片。

## 3. 组件使用指南 (高度自定义)
所有的 `Base` 组件均支持透传 Tailwind 类名。
- **自定义宽度示例**: `<BaseInput class="w-64" />` 或 `<BaseButton class="w-auto px-12">`。
- **受控模式**: 统一使用 `v-model` 进行双向绑定。

## 4. 故障修复记录
- **修复**: 解决了 `useUserSettings` 和 `useHeader` 的 `ReferenceError`，原因是 Vite 扫描路径未包含自定义 Hooks 目录。
- **优化**: 完善了 `.gitignore` 和 MD 文档命名规范。

## 5. 后续维护
- 只有发生**重大架构变动**或**新功能模块上线**时才更新此文件夹下的 MD。
- 所有的细节变更应体现在代码注释（JSDoc）中。
