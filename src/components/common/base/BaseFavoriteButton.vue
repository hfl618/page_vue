<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/user'

/**
 * @description 统一收藏按钮 - 乐观更新 & 工业级物理反馈
 * @param {string} type 'article' | 'tool'
 * @param {string|number} id 唯一标识
 */
const props = defineProps({
  type: { type: String, required: true },
  id: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  size: { type: String, default: 'w-[30px] h-[30px]' }
})

const userStore = useUserStore()
const loading = ref(false)

// 绑定全局 Store 状态，实现跨页面瞬间同步
const active = computed(() => userStore.isFavorited(props.type, props.id))

const handleToggle = async () => {
  if (loading.value) return
  loading.value = true
  try {
    await userStore.toggleFavorite(props.type, props.id, props.label)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    @click.stop="handleToggle"
    class="favorite-btn-industrial flex items-center justify-center transition-all duration-300"
    :class="[
      size,
      active ? 'active-state text-amber-500 border-amber-200 bg-amber-50/30' : 'idle-state text-zinc-300 border-zinc-100 bg-white'
    ]"
    :disabled="loading"
    title="Toggle Star Protocol"
  >
    <!-- 物理加载中 -->
    <div v-if="loading" class="w-3.5 h-3.5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
    
    <!-- 工业级星标图标 -->
    <svg v-else :class="{ 'fill-current': active, 'scale-110': active }" class="w-4 h-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
    </svg>

    <!-- 激活瞬间的脉冲扩散 (CSS 只需几行) -->
    <div v-if="active" class="absolute inset-0 bg-amber-400/20 animate-ping rounded-0 pointer-events-none"></div>
  </button>
</template>

<style scoped>
.favorite-btn-industrial {
  border: 1px solid;
  outline: none;
  position: relative;
  overflow: hidden;
  box-shadow: 2px 2px 0px #f4f4f5;
}

.favorite-btn-industrial:hover:not(:disabled) {
  border-color: #18181b;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px #e4e4e7;
}

.favorite-btn-industrial:active:not(:disabled) {
  transform: translate(0.5px, 0.5px);
  box-shadow: none;
}

.active-state {
  box-shadow: 2px 2px 0px #fef3c7;
}

/* 脉冲动画 */
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 0.6s cubic-bezier(0, 0, 0.2, 1) forwards;
}
</style>
