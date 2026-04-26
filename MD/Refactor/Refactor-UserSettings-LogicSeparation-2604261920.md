# Refactor-UserSettings-LogicSeparation-2604261920

## 1. 概括说明
完成了用户设置页面（SettingsView）的重构。通过引入 `useUserSettings` Hook 和全新的原子组件，实现了逻辑解耦与 UI 标准化。

## 2. 变更详情
- **逻辑抽离**: 创建 `hooks/useUserSettings.js`。
  - 采用响应式 `form` 副本，防止表单修改实时污染全局 Store。
  - 封装头像上传逻辑，包含文件校验、FormData 构建及上传后 Store 同步。
  - 封装 `handleSave` 统一处理个人资料更新协议。
- **原子组件应用**:
  - 新建 `BaseTextarea.vue` 统一多行文本输入风格。
  - 全量替换原生 `input`, `button`, `switch` 为 `BaseInput`, `BaseButton`, `PhysicalSwitch`。
- **代码规范**: 设置页不再直接操作 `localStorage` 或 `axios`，全部通过 Hook 和 API 模块进行。

## 3. 下一步计划
- 应用相同模式重构 `UserProfile.vue`。
- 提取通用的文件上传组件。
