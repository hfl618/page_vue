<script setup>
import { getAssetUrl } from '@/utils/format'

/**
 * @description 工业风资源管理原子组件 (BaseSourceManager)
 * 职责：封装单个资源的状态判断、局部加载、样式表现与交互分发
 */
const props = defineProps({
  // 资源路径 (用于判定是否存在及跳转预览)
  path: { type: String, default: '' },
  // 资源类型标识
  type: { type: String, required: true },
  // 外部传入的显式标签
  label: { type: String, required: true },
  // 是否正在上行中
  loading: { type: Boolean, default: false },
  // 是否存在附件 (逻辑判定，用于文档等特殊场景)
  exists: { type: Boolean, default: false }
})

const emit = defineEmits(['upload', 'wipe', 'redo'])

/**
 * 核心点击：有资源则预览，无资源则触发上传
 */
const handleMainAction = () => {
  if (props.loading) return
  
  const currentPath = String(props.path || '').trim()
  
  if (currentPath || props.exists) {
    if (currentPath) {
      window.open(getAssetUrl(currentPath), '_blank')
    } else {
      // 提示：路径同步中
      alert('RESOURCE_SYNCING: The cloud path is being updated. Please wait a moment.')
    }
  } else {
    emit('upload')
  }
}

// 样式颜色映射
const typeStyles = {
  image: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
  doc: 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100',
  qr: 'bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100'
}

const active = props.path || props.exists
</script>

<template>
  <div class="flex items-center gap-1.5 min-w-0">
    <!-- 主操作按钮 -->
    <button 
      @click="handleMainAction"
      :disabled="loading"
      class="text-[8px] font-black px-1.5 py-0.5 transition-all uppercase flex items-center gap-1 relative overflow-hidden h-5 min-w-[50px] justify-center"
      :class="[
        loading ? 'opacity-70 cursor-wait' : '',
        active ? typeStyles[type] : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-300'
      ]"
      :title="active ? `View ${label}` : `Upload ${label}`"
    >
      <!-- 局部加载图标 -->
      <div v-if="loading" class="w-2 h-2 border-[1.5px] border-zinc-300 border-t-zinc-600 animate-spin rounded-full shrink-0"></div>
      
      <!-- 状态图标 -->
      <template v-else>
        <svg v-if="active" class="w-2 h-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
          <path d="M5 13l4 4L19 7"/>
        </svg>
        <svg v-else class="w-2 h-2 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </template>

      <span>{{ label }}</span>
    </button>

    <!-- 附属操作组 (仅在激活且未加载时显示) -->
    <div v-if="active && !loading" class="flex items-center gap-1.5 animate-in fade-in duration-300">
      <span 
        @click="emit('redo')" 
        class="text-[7px] text-zinc-300 font-bold uppercase cursor-pointer hover:text-zinc-900 underline underline-offset-2"
      >
        {{ type === 'qr' ? 'Regen' : 'Redo' }}
      </span>
      <span 
        @click="emit('wipe')" 
        class="text-[7px] text-red-300 font-bold uppercase cursor-pointer hover:text-red-600 transition-colors"
      >
        Wipe
      </span>
    </div>
  </div>
</template>
