<script setup>
import { getAssetUrl } from '@/utils/format'

/**
 * @description 详情面板固定头部 (Raw Schema 对齐版)
 */
defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['adjust-stock', 'edit', 'delete'])
</script>

<template>
  <div class="px-6 py-2 border-b border-zinc-50 bg-white shrink-0 flex justify-between items-center z-10">
    <!-- 左侧：身份标识与动态图标组 -->
    <div class="min-w-0 flex flex-col">
      <div class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5 leading-none">
        [NODE_ID: #{{ item.id }}]
      </div>
      
      <div class="flex items-center gap-3">
        <!-- 元器件名称 -->
        <div class="text-[17px] font-black tracking-tight uppercase truncate text-zinc-900 leading-none">
          {{ item.name }}
        </div>

        <!-- 动态图标组 (对齐物理字段) -->
        <div class="flex items-center gap-1">
          <BaseImagePreview v-if="item.img_path" :src="getAssetUrl(item.img_path)" :alt="item.name" mode="modal">
            <template #trigger>
              <div class="w-6 h-6 rounded-md flex items-center justify-center text-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer" title="Preview Image">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </template>
          </BaseImagePreview>

          <a v-if="item.hasFile || item.doc_path" :href="getAssetUrl(item.doc_path)" target="_blank" class="w-6 h-6 rounded-md flex items-center justify-center text-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 transition-all cursor-pointer" title="Open Document">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </a>
        </div>
      </div>
    </div>
    
    <!-- 右侧：核心控制组 (对齐物理字段 quantity) -->
    <div class="flex items-center gap-5">
      <BaseStepInput 
        :model-value="item.quantity"
        label="Stock"
        size="sm"
        @change="(val, delta) => emit('adjust-stock', item.id, delta)"
      />
      <div class="h-3 w-px bg-zinc-200"></div>
      <div class="flex items-center gap-3">
         <BaseActionLink @click="emit('edit', item)" color-class="text-zinc-400 hover:text-zinc-900" class="text-[10px]" bold>Edit Profile</BaseActionLink>
         <BaseActionLink @click="emit('delete')" color-class="text-red-400 hover:text-red-500" class="text-[10px]" bold>Delete Unit</BaseActionLink>
      </div>
    </div>
  </div>
</template>
