# 20260426-Arch-Atomic-Component_Standardization

## 1. 概括说明
建立了基础原子组件库（Base Components），通过统一封装 UI 元素（Input, Button 等），消除了页面间大量的 CSS 样式冗余，实现了 UI 风格的一致性控制。

## 2. 核心变更
- **创建原子组件**:
  - `BaseInput.vue`: 支持 V-Model, 错误提示, 成功状态及插槽扩展。
  - `BaseButton.vue`: 支持 Loading 状态、多种变体（Variant）及影子效果。
- **页面重构**:
  - `LoginView.vue` 和 `SignupView.vue` 已全量使用原子组件。
  - 移除了页面内冗长的 Tailwind 类，HTML 结构简化约 40%。
- **自动导入**: 所有的 `BaseXXX` 组件均已加入自动导入列表，无需手动 Import。

## 3. 使用规范
- **原则**: 凡是超过两个页面使用的基础元素，必须提取为 `Base` 组件。
- **扩展**: 通过 `slot` 和 `props` 处理差异化需求，禁止在页面内直接修改原子组件的全局样式。

## 4. 收益评估
- **一致性**: 以后修改全站按钮圆角或输入框背景，只需修改一个文件。
- **可读性**: 模板代码更具语义化（如 `<BaseButton>` 优于复杂的 `<button class="...">`）。
