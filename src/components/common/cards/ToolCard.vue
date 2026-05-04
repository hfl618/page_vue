<script setup>
import { ref } from 'vue'
/**
 * @description 工具展示卡片
 */
const props = defineProps({
  id: [String, Number],
  name: String,
  description: String,
  iconPath: String,
  iconUrl: { type: String, default: null }, // 新增图片图标支持
  tag: { type: String, default: 'UTILITY' },
  version: { type: String, default: 'V1.0.0' },
  author: { type: String, default: 'SYSTEM' },
  isCore: { type: Boolean, default: false },
  favStatus: { type: Boolean, default: false },
  url: { type: String, default: '#' }
})

const emit = defineEmits(['toggle-fav'])
</script>

<template>
  <div class="tool-paper-card p-[15px] flex flex-col justify-between group h-[160px] bg-white border border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] hover:-translate-x-1 hover:scale-[1.02] hover:shadow-[10px_8px_0px_#f4f4f5] transition-all duration-300 rounded-0 relative overflow-hidden text-left" translate="no">
    
    <!-- 右上角：统一收藏按钮 (乐观更新版) -->
    <div class="absolute top-2.5 right-2.5 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <BaseFavoriteButton type="tool" :id="props.id" :label="name" size="w-[28px] h-[28px]" />
    </div>

    <div class="flex flex-col gap-3 flex-1 min-w-0">
      <!-- 1. 顶部行 -->
      <div class="flex items-center gap-3">
        <!-- 工业级图标容器：由 BaseAvatar 驱动 -->
        <BaseAvatar 
          :src="iconUrl" 
          size="md" 
          shape="square" 
          border="thin" 
          bg-color="bg-zinc-100" 
          img-padding="p-1.5"
          :fallback-text="name?.substring(0, 4)"
          :angle="-10"
        />
        
        <div class="flex-1 min-w-0 pr-8">
          <div class="flex items-baseline gap-2 overflow-hidden">
            <BaseTitle level="h3" size="text-[13px]" class="line-clamp-2 leading-tight !font-bold">
              {{ name }}
            </BaseTitle>
          </div>
        </div>
      </div>

      <!-- 2. 标签与描述 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <BaseTag>#{{ tag }}</BaseTag>
          <BaseTag v-if="isCore" class="!bg-zinc-900 !text-white !border-zinc-900">Core</BaseTag>
        </div>
        <p class="text-[10px] text-zinc-400 font-bold leading-relaxed line-clamp-2 italic">{{ description }}</p>
      </div>
    </div>

    <!-- 3. 底部元数据 -->
    <div class="mt-auto pt-3 border-t border-zinc-50 flex items-center justify-between group-hover:opacity-0 transition-opacity duration-200">
      <span class="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">DEPLOYED BY @{{ author }}</span>
      <div class="flex items-center gap-2">
        <span class="text-[8px] font-bold font-mono text-zinc-200 uppercase tracking-tighter">{{ version }}</span>
        <svg class="w-3 h-3 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </div>
    </div>

    <!-- 4. 原子化启动按钮 -->
    <div class="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white z-20">
      <BaseButton 
        :href="url" 
        class="!rounded-none !h-7 shadow-none active:translate-x-0 active:translate-y-0"
      >
        <span class="text-[10px] font-black uppercase tracking-[0.2em]">Launch Module</span>
      </BaseButton>
    </div>
  </div>
</template>
