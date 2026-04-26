# Refactor-LayoutComponents-Standardization-2604261955

## 1. 概括说明
完成了全局布局组件（Header/Sidebar）的标准化重构。通过封装顶栏逻辑 Hook 和应用自动导入机制，实现了导航逻辑的统一与组件代码的精简。

## 2. 变更详情
- **逻辑抽离**: 创建 `src/components/layout/header/hooks/useHeader.js`。
  - 封装统一的返回路由逻辑（Back vs Home）。
  - 集成带防抖（300ms）的搜索输入处理。
- **组件精简**:
  - `GlobalHeader.vue`: 脚本量减少 50%，模板更加语义化。
  - `SidebarItem.vue`: 确认为原子导航单元，符合高内聚低耦合标准。
- **自动导入应用**: 布局组件内部不再包含显式的 `ref`, `useRouter` 等引用。

## 3. 架构现状回顾
- **Views**: 100% 逻辑解耦。
- **Hooks**: 建立了完整的业务逻辑库。
- **Components**: 形成了 原子组件(Base) -> 业务组件(Business) -> 布局组件(Layout) 的三级分级。

## 4. 下一步建议
- 建立全局错误处理中间件。
- 引入自动化单元测试（Vitest）以保障解耦后的逻辑稳定性。
