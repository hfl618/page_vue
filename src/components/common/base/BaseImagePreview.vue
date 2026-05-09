<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

/**
 * @description 通用工业级图片预览组件 (带全局 ESC 返回支持)
 * 支持：modal (点击放大) | hover (原位缩放) | lens (透镜) | popup (浮层)
 */
const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: 'image' },
  mode: { type: String, default: 'modal' },
  size: { type: String, default: 'w-8 h-8' },
  radius: { type: String, default: 'rounded-md' },
  scale: { type: Number, default: 2 },
  lensPosition: { type: String, default: 'right' },
  modalMaxWidth: { type: String, default: 'max-w-2xl' }
})

const isModalOpen = ref(false)
const isHovering = ref(false)
const mousePos = ref({ x: 0, y: 0 })

// --- 全局键盘监听方案 (避免冗余) ---
const handleEsc = (e) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    isModalOpen.value = false
  }
}

// 仅在弹窗打开时监听键盘，关闭或组件卸载时移除
watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    window.addEventListener('keydown', handleEsc)
    // 禁止背景滚动
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

// 处理鼠标移动
const handleMouseMove = (e) => {
  if (props.mode !== 'hover' && props.mode !== 'lens') return
  const rect = e.currentTarget.getBoundingClientRect()
  mousePos.value = {
    x: ((e.clientX - rect.left) / rect.width) * 100,
    y: ((e.clientY - rect.top) / rect.height) * 100
  }
}

const zoomStyle = computed(() => {
  if (!isHovering.value) return {}
  return {
    transform: `scale(${props.scale})`,
    transformOrigin: `${mousePos.value.x}% ${mousePos.value.y}%`
  }
})

const posClasses = {
  right: 'left-full ml-4 top-0',
  left: 'right-full mr-4 top-0',
  top: 'bottom-full mb-4 left-0',
  bottom: 'top-full mt-4 left-0'
}
</script>

<template>
  <div class="inline-block relative">
    <!-- 1. 基础展示触发区 -->
    <div 
      :class="[
        'relative overflow-hidden cursor-pointer group/preview bg-zinc-50 border border-zinc-100 p-1 transition-all',
        $slots.trigger ? '' : size, 
        $slots.trigger ? '' : radius,
        mode === 'modal' ? 'hover:border-zinc-300' : '',
        $slots.trigger ? 'border-none bg-transparent p-0' : ''
      ]"
      @click="mode === 'modal' ? isModalOpen = true : null"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @mousemove="handleMouseMove"
    >
      <slot name="trigger">
        <img 
          :src="src" 
          :alt="alt" 
          class="w-full h-full object-contain transition-transform duration-300"
          :style="mode === 'hover' ? zoomStyle : {}"
        >
        <div v-if="mode === 'modal'" class="absolute inset-0 bg-black/5 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </slot>
    </div>

    <!-- 2. Lens (透镜) -->
    <div v-if="mode === 'lens' && isHovering" :class="['absolute z-[100] w-48 h-48 bg-white border border-zinc-200 shadow-2xl overflow-hidden pointer-events-none', posClasses[lensPosition] || posClasses.right]">
      <div class="w-full h-full bg-no-repeat" :style="{ backgroundImage: `url(${src})`, backgroundSize: `${scale * 100}%`, backgroundPosition: `${mousePos.x}% ${mousePos.y}%` }"></div>
    </div>

    <!-- 3. Popup (全图浮层) -->
    <div v-if="mode === 'popup' && isHovering" :class="['absolute z-[100] w-48 h-48 bg-white border border-zinc-200 shadow-2xl p-2 pointer-events-none flex items-center justify-center', posClasses[lensPosition] || posClasses.right]">
      <img :src="src" class="max-w-full max-h-full object-contain" alt="popup">
    </div>

    <!-- 4. Modal (带键盘 Esc 支持) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isModalOpen" class="fixed inset-0 z-[2000] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-10" @click="isModalOpen = false">
          <div :class="['relative bg-white p-4 shadow-2xl animate-in zoom-in-95 duration-200', modalMaxWidth]" @click.stop>
            <img :src="src" class="w-full h-auto max-h-[80vh] object-contain" alt="preview">
            <button @click="isModalOpen = false" class="absolute -top-4 -right-4 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <!-- 快捷键提示 -->
            <div class="absolute -bottom-8 left-0 right-0 text-center">
              <span class="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Press [ESC] to return</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
img { -webkit-user-drag: none; }
</style>
