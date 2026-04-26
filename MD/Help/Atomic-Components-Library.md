# Atomic Components Library | 原子组件库完整手册

本文档详细记录了 **Heflos Industrial UI** 所有的原子组件及其用法。这些组件遵循统一的物理主义设计语言，旨在通过硬边框、强阴影和高对比度建立工业级的数字美学。

---

## 1. 核心按钮与动作 (Buttons & Actions)

### [BaseButton] - 基础物理按钮
这是系统中最常用的操作单元，模拟机械按键的触感。
- **Props:**
  - `variant`: `primary` (默认), `secondary` (描边白底), `custom`
  - `loading`: `Boolean`, 激活后按钮变为不可点击并显示 loading 动画。
  - `to` / `href`: 传入后会自动渲染为 `router-link` 或 `a` 标签。
  - `disabled`: `Boolean`, 禁用状态。
- **用法:**
```vue
<BaseButton variant="primary" :loading="isSaving" @click="save">
  Save Protocol
</BaseButton>

<BaseButton variant="secondary" to="/settings">
  Settings
</BaseButton>
```

### [BaseIconButton] - 极简图标按钮
用于紧凑空间的单一功能触发，通常不带文字。
- **Props:**
  - `active`: `Boolean`, 切换激活态（边框变黑/图标填充）。
  - `loading`: `Boolean`, 在按钮中心显示 loading。
- **用法:**
```vue
<BaseIconButton :active="isStarred" @click="star">
  <svg>...</svg>
</BaseIconButton>
```

### [BaseActionLink] - 工业风动作链接
具有悬浮激活下划线效果的轻量链接。
- **用法:**
```vue
<BaseActionLink to="/archive" color-class="text-blue-500">
  View Archive
</BaseActionLink>
```

---

## 2. 表单与输入 (Form Elements)

### [BaseInput] - 规范化输入框
带有错误处理和成功状态验证的输入组件。
- **Props:**
  - `modelValue`: 绑定值。
  - `placeholder`: 占位文本。
  - `error`: 字符串，存在时输入框变红并显示错误提示。
  - `success`: `Boolean`, 激活后边框变绿。
- **用法:**
```vue
<BaseInput 
  v-model="username" 
  placeholder="Enter Identity..." 
  :error="errorMsg"
/>
```

### [PhysicalSwitch] - 物理拨码开关
100% 还原物理开关的滑动感，无圆角直角设计。
- **用法:**
```vue
<PhysicalSwitch v-model="settings.enabled" active-color="bg-emerald-500" />
```

### [BaseTextarea] - 工业长文本域
支持自动调整高度或固定高度的文本容器。
- **用法:**
```vue
<BaseTextarea v-model="content" placeholder="Writing logs..." />
```

---

## 3. 视觉展示 (Display)

### [BaseTitle] - 工业排版标题
统一管理全站的标题字体大小、粗细与字母间距。
- **Props:**
  - `level`: `h1` | `h2` | `h3` | `h4` | `h5`
  - `size`: 自定义大小类名 (如 `text-[24px]`)
- **用法:**
```vue
<BaseTitle level="h1" size="text-xl">System Overview</BaseTitle>
```

### [BaseTag] - 扁平标签
用于分类标记或元数据展示。
- **用法:**
```vue
<BaseTag>#Core</BaseTag>
<BaseTag color-class="text-white" bg-class="bg-zinc-900">STACK</BaseTag>
```

---

## 4. 反馈与交互 (Feedback)

### [IndustrialIndicator] - 工业状态指示器
常用于加载、同步或离线状态的矩形脉冲动画。
- **用法:**
```vue
<IndustrialIndicator :animate="isProcessing" />
```

### [LoadingOverlay] - 全局同步层
带模糊效果和百分比进度条的覆盖层。
- **用法:**
通过 `useUiStore` 中的 `loading` 对象自动触发，无需手动在组件中引用。

---

## 5. 通用 CSS 规范 (Utility Standards)

在使用原子组件时，若需自定义，请务必遵守以下样式规范：

- **阴影 (Shadows):**
  - 轻量: `shadow-[2px_2px_0px_#f4f4f5]`
  - 标准: `shadow-[4px_4px_0px_#f4f4f5]`
  - 高亮 (Hover): `shadow-[8px_8px_0px_#18181b]`
- **字体样式 (Typography):**
  - 大写: `uppercase`
  - 特粗: `font-black`
  - 宽间距: `tracking-widest`
  - 宽行高: `leading-relaxed`
- **交互动作 (Action):**
  - 所有按钮点击位移: `active:translate-x-0.5 active:translate-y-0.5 active:shadow-none`
