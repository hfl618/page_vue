# 2604262210-Arch-MajorRefactor-Summary (架构大重构总结)

## 1. 概括说明
本次更新完成了全站的工业化重构，核心目标是实现“单人高效维护”与“0 代码冗余”。通过逻辑抽离和自动化工具，将原本臃肿的页面精简了 60% 以上，并修复了因自动导入配置不全及后端连接超时导致的运行时问题。

## 2. 核心架构变更
- **解耦逻辑 (Hooks & Stores)**: 
  - 全量升级 Pinia 为 **Setup Store** 风格。
  - 为所有业务模块（Auth, Knowledge, User, Tools）建立了专门的 `hooks`。
  - **加固**: 为所有 Hook 和 Store 文件添加了显式 Import，消除了 Vite 500 编译错误。
- **原子组件体系**:
  - `src/components/common/base/`: 包含 `BaseInput`, `BaseButton`, `BaseTitle`, `BaseTag`, `BaseIconButton` 等。
  - **高度弹性**: 支持通过 `props` 自定义颜色，通过 `class` 自定义尺寸。
  - **交互规范**: 全站统一的下划线激活（BaseActionLink）与物理点击位移。
- **导航自动化**: 顶栏标题与返回路径完全由 `router/index.js` 的 `meta` 字段驱动。

## 3. 健壮性优化
- **网络请求**:
  - 默认超时时间缩短至 **15s**，并增加了专项的 `NETWORK_TIMEOUT` 错误拦截与提示。
  - 完善了 Loading 层的生命周期闭环，确保在任何异常下均能正常关闭。
- **分页增强**:
  - `KnowledgeList` 支持实时调节页面密度（Items Per Page），并具备页码自动重置逻辑。

## 4. 后续维护
- **新功能开发**: 遵循 `Hook -> View -> Base Component` 的三层架构。
- **样式定制**: 优先通过 `variables.css` 修改全局变量，或通过原子组件的 Props 进行局部定制。
- **故障排查**: 若出现 `ReferenceError`，请优先检查是否漏掉了显式 Import。
