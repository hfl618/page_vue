<template>
  <div class="min-h-screen w-screen flex items-center justify-center bg-zinc-50 relative overflow-hidden" translate="no">
    <!-- 物理纹理背景：还原 bg-pattern -->
    <div class="absolute inset-0 opacity-[0.4] pointer-events-none auth-pattern"></div>
    
    <!-- 认证卡片容器 -->
    <div class="w-full max-w-[420px] px-6 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.auth-pattern {
  background-image: radial-gradient(#d4d4d8 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
