<script setup>
import { watch, onUnmounted } from 'vue'

/**
 * @description 极致原子化弹窗容器
 * 职责：仅负责弹出逻辑与遮罩控制，不干涉内容样式
 */
const props = defineProps({
  show: { type: Boolean, default: false },
  // 盒子容器的自定义类名 (由调用者决定边框、圆角、背景)
  containerClass: { type: String, default: 'bg-white shadow-2xl' },
  // 最大宽度控制
  maxWidth: { type: String, default: 'max-w-2xl' },
  closeOnOverlay: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) emit('close')
}

watch(() => props.show, (val) => {
  if (val) {
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-10" translate="no">
      
      <!-- 背景遮罩 (仅限极简动效) -->
      <Transition name="fade" appear>
        <div 
          v-if="show"
          class="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" 
          @click="closeOnOverlay ? emit('close') : null"
        ></div>
      </Transition>
      
      <!-- 弹窗主体 (由 containerClass 驱动视觉) -->
      <Transition name="pop" appear>
        <div 
          v-if="show"
          :class="['w-full relative z-10 flex flex-col max-h-full transition-all', maxWidth, containerClass]"
          @click.stop
        >
          <slot></slot>
        </div>
      </Transition>

    </div>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-leave-active { transition: all 0.2s ease-in; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>
