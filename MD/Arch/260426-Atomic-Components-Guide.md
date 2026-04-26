# Atomic Components Guide | 原子组件开发与使用指南

## 1. 设计哲学 (Design Philosophy)
本项目采用 **Industrial Physicalism (工业物理主义)** 设计风格，核心特征包括：
- **硬阴影 (Hard Shadows):** 弃用柔和投影，使用固定偏移的实心色块投影。
- **高对比度 (High Contrast):** 严格使用 `Zinc-900` 与 `White` 的对比。
- **排版优先 (Typography First):** 大量使用 `Uppercase`、`Monospace` 和宽字间距 (`Tracking-widest`)。
- **触感反馈 (Tactile Feedback):** 按钮按下时产生物理位移（`active:translate`），模拟机械开关感。

---

## 2. 基础原子组件 (Base Components)

### BaseButton
最核心的物理按钮。
- **位置:** `@/components/common/base/BaseButton.vue`
- **主要参数:**
  - `variant`: `primary` (黑底白字), `secondary` (白底黑边), `custom` (自定义)
  - `loading`: 布尔值，显示工业风加载动画。
- **用法:**
  ```vue
  <BaseButton @click="handleAction" :loading="isSyncing">
    Deploy Module
  </BaseButton>
  ```

### BaseIconButton
极简的方块图标按钮。
- **参数:** `active` (激活态显示边框/颜色)
- **用法:**
  ```vue
  <BaseIconButton :active="isStarred" @click="toggle">
    <svg>...</svg>
  </BaseIconButton>
  ```

### BaseTitle
标准化的标题组件，内置了字间距和粗细规范。
- **参数:** `level` (h1-h6), `size` (Tailwind class)
- **用法:**
  ```vue
  <BaseTitle level="h3" size="text-[14px]">Registry Entry</BaseTitle>
  ```

### BaseTag
用于展示元数据标签。
- **用法:**
  ```vue
  <BaseTag>#Archive</BaseTag>
  <BaseTag color-class="text-white" bg-class="bg-zinc-900">Core</BaseTag>
  ```

### PhysicalSwitch
还原物理拨码开关。
- **用法:**
  ```vue
  <PhysicalSwitch v-model="settings.enabled" label="System Power" />
  ```

---

## 3. 反馈组件 (Feedback Components)

### LoadingOverlay
全局/局部同步覆盖层。
- **特性:** 1:1 还原工业显示器模糊效果，带进度条。
- **控制方式:** 通过 `uiStore.showLoading(title, subtitle)` 触发。

### NotificationContainer
非侵入式消息通知。
- **特性:** 侧边色块指示器（Success: Emerald, Error: Red, Info: Zinc）。

---

## 4. 开发规范 (Implementation Standards)

1. **阴影规范:**
   - 小元素: `shadow-[2px_2px_0px_#f4f4f5]`
   - 中元素/卡片: `shadow-[4px_4px_0px_#f4f4f5]`
   - 悬浮/激活态: `shadow-[8px_8px_0px_#18181b]`
2. **交互动作:**
   - 点击位移必须包含 `active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`。
3. **圆角控制:**
   - 默认使用 `rounded-0` 或 `rounded-lg` (视具体物理模型而定)。新版启动按钮统一使用 `!rounded-none`。
