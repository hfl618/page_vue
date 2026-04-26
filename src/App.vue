<script setup>
/**
 * @description 核心入口框架
 * 采用自动化布局切换机制，内容由 meta.layout 决定。
 */
const route = useRoute()
const isMainLayout = computed(() => route.meta.layout === 'main')
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <!-- 自动导入的布局组件 -->
    <MainLayout v-if="isMainLayout" />

    <!-- 独立布局：登录、注册等 -->
    <div v-else class="h-full w-full relative">
      <router-view v-slot="{ Component }">
        <transition name="fade-quick" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- 全局挂载组件 (自动导入) -->
    <LoadingOverlay />
    <NotificationContainer />
  </div>
</template>

<style>
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.2s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
