<script setup>
/**
 * @description 库存管理批量操作工具栏
 */
defineProps({
  selectedCount: Number
})

const emit = defineEmits(['sync', 'export', 'delete'])
</script>

<template>
  <Transition 
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-x-4 opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-4 opacity-0"
  >
    <div v-if="selectedCount > 0" class="flex items-center gap-3 pr-4 border-r border-zinc-100 mr-2">
      <!-- 计数器 -->
      <span class="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-0 border border-blue-100 uppercase tracking-tighter">
        {{ selectedCount }} Selected
      </span>
      
      <BaseActionLink 
        @click="emit('sync')" 
        color-class="text-blue-600" 
        active-border-class="hover:border-blue-600"
        bold
      >
        Bulk Sync
      </BaseActionLink>
      
      <BaseActionLink 
        @click="emit('export')" 
        color-class="text-zinc-500" 
        active-border-class="hover:border-zinc-900"
        bold
      >
        Export
      </BaseActionLink>
      
      <BaseActionLink 
        @click="emit('delete')" 
        color-class="text-red-500" 
        active-border-class="hover:border-red-500"
        bold
      >
        Delete
      </BaseActionLink>
    </div>
  </Transition>
</template>
