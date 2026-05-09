<script setup>
/**
 * @description 详情面板固定头部 (原子组件 - 全复用版)
 */
defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['adjust-stock', 'edit', 'delete'])
</script>

<template>
  <div class="px-6 py-2 border-b border-zinc-50 bg-white shrink-0 flex justify-between items-center z-10">
    <!-- 左侧：身份标识 -->
    <div class="min-w-0 flex flex-col">
      <div class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">
        [NODE_ID: #{{ item.id }}]
      </div>
      <div class="flex items-center gap-2">
        <div class="text-[17px] font-black tracking-tight uppercase truncate text-zinc-900 leading-none">
          {{ item.name }}
        </div>
        <!-- 快捷编辑：使用 BaseIconButton 的 ghost 变体 -->
        <BaseIconButton 
          variant="ghost"
          size="w-6 h-6"
          radius="rounded-md"
          title="Quick Edit"
          @click="emit('edit', item)"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        </BaseIconButton>
      </div>
    </div>
    
    <!-- 右侧：控制组 -->
    <div class="flex items-center gap-5">
      <BaseStepInput 
        v-model="item.stock"
        label="Stock"
        size="sm"
        @change="(val, delta) => emit('adjust-stock', item.id, delta)"
      />
      <div class="h-3 w-px bg-zinc-100"></div>
      <div class="flex items-center gap-3">
         <BaseActionLink @click="emit('edit', item)" color-class="text-zinc-400 hover:text-zinc-900" class="text-[10px]" bold>Edit Profile</BaseActionLink>
         <BaseActionLink @click="emit('delete')" color-class="text-red-400 hover:text-red-500" class="text-[10px]" bold>Delete Unit</BaseActionLink>
      </div>
    </div>
  </div>
</template>
