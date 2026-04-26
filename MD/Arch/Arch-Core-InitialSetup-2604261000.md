# 20260426-Arch-Core-项目初始化与架构规范

## 1. 概括说明
本文档确立了前端项目的核心架构规范，旨在通过高度组件化和逻辑解耦，实现单人高效维护。

## 2. 目录结构规范
- `src/api/`：统一接口层。严禁在组件内直接写 axios。
- `src/components/common/`：原子组件。必须纯粹，不依赖 Pinia，通过 Props 通信。
- `src/components/business/`：业务组件。可包含特定业务逻辑，可访问 Store。
- `src/composables/`：逻辑抽离。复杂的 `setup` 逻辑必须抽离为 `useXXX` 函数。
- `src/constants/`：静态枚举。杜绝代码中出现硬编码字符串或数字。

## 3. 代码注释规范 (JSDoc)
所有核心函数必须包含以下注释结构：
```javascript
/**
 * @description 函数功能描述
 * @param {Type} name 参数说明
 * @returns {Type} 返回值说明
 * @example 使用示例
 */
```

## 4. 路径别名说明
- `@` -> `src`
- `@api` -> `src/api`
- `@comp` -> `src/components`
- `@store` -> `src/store`
- `@utils` -> `src/utils`

## 5. 当前环境记录
- **Vue**: 3.5.33
- **Vite**: 8.0.10
- **Tailwind**: 4.2.4
- **State**: Pinia 3.0.4
