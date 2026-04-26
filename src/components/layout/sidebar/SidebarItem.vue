<script setup>
/**
 * SidebarItem 组件使用说明：
 * 该组件是侧边栏的原子导航单元，封装了样式逻辑与路由跳转。
 * 
 * @props {String} to - 路由跳转的目标路径 (如: '/discover')
 * @props {Boolean} active - 当前项是否处于激活状态 (由父组件判断传入)
 * 
 * @slot default - 用于放置 SVG 图标或其它内容
 */
defineProps({
  to: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- 使用 router-link 实现无刷新跳转，样式精准复刻 Nexus Hub 原始风格 -->
  <router-link :to="to" 
     class="w-full h-10 flex items-center justify-center transition-all relative group" 
     :class="active ? 'text-zinc-900 border-r-2 border-zinc-900 bg-zinc-100' : 'hover:text-zinc-900 text-zinc-400'">
    
    <!-- 激活状态下的背景和边框逻辑已在 :class 中内置 -->
    <slot></slot>
  </router-link>
</template>
