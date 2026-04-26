<script setup>
/**
 * @description 全局消息通知容器
 * 自动管理通知生命周期与物理视觉反馈。
 */
const uiStore = useUiStore()
const { notices } = storeToRefs(uiStore)
</script>

<template>
  <div id="heflos-notification-container" class="fixed bottom-8 right-8 z-[10000] flex flex-col gap-4 w-80 pointer-events-none">
    <TransitionGroup 
      name="notice"
      enter-active-class="transition ease-out duration-300"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-4 opacity-0"
    >
      <div v-for="n in notices" :key="n.id" v-show="n.visible"
           class="pointer-events-auto border shadow-[4px_4px_0px_#f4f4f5] p-5 flex items-start gap-4 relative overflow-hidden bg-white"
           :class="{
              'bg-emerald-50 border-emerald-500 shadow-emerald-500/10': n.type === 'success',
              'bg-red-50 border-red-500 shadow-red-500/10': n.type === 'error',
              'bg-amber-50 border-amber-500 shadow-amber-500/10': n.type === 'warning',
              'bg-white border-zinc-900 shadow-zinc-900/10': n.type === 'info'
           }">
        
        <!-- 侧边物理色块 -->
        <div class="w-1.5 absolute left-0 top-0 bottom-0"
             :class="{
                'bg-emerald-500': n.type === 'success',
                'bg-red-500': n.type === 'error',
                'bg-amber-500': n.type === 'warning',
                'bg-zinc-900': n.type === 'info'
             }"></div>

        <!-- 内容渲染 -->
        <div class="shrink-0 mt-0.5">
          <div :class="{
              'text-emerald-600': n.type === 'success',
              'text-red-600': n.type === 'error',
              'text-amber-600': n.type === 'warning',
              'text-zinc-900': n.type === 'info'
          }">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path v-if="n.type === 'success'" d="M5 13l4 4L19 7" />
              <path v-else-if="n.type === 'error'" d="M6 18L18 6M6 6l12 12" />
              <path v-else-if="n.type === 'warning'" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              <path v-else d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-1 text-left">
          <h4 class="text-[11px] font-black uppercase tracking-widest text-zinc-900">{{ n.title }}</h4>
          <p class="text-[10px] font-bold leading-relaxed uppercase tracking-tight text-zinc-400">{{ n.message }}</p>
        </div>

        <button @click="uiStore.removeNotice(n.id)" class="text-zinc-400 hover:text-zinc-900 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
