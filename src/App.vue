<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'

/**
 * App.vue 核心框架入口
 * 1. 物理挂载全局 UI 组件 (Loading, Notification)。
 * 2. 根据路由 meta.layout 自动分发布局。
 */

const route = useRoute()
const isMainLayout = computed(() => route.meta.layout === 'main')
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <!-- 1. 业务布局：带侧边栏与顶栏 -->
    <MainLayout v-if="isMainLayout">
      <!-- 内容由 MainLayout 内部的 router-view 渲染 -->
    </MainLayout>

    <!-- 2. 独立布局：登录、注册、全屏工具 -->
    <div v-else class="h-full w-full relative">
      <router-view v-slot="{ Component }">
        <transition name="fade-quick" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 3. 全局唯一挂载点：物理级全站覆盖 -->
    <LoadingOverlay />
    <NotificationContainer />
  </div>
</template>

<style>
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.2s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
