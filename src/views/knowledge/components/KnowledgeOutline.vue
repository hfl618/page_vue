<script setup>
/**
 * @description 文章阅读器侧边大纲组件
 */
defineProps({
  outline: { type: Array, default: () => [] }
})

const emit = defineEmits(['navigate'])
</script>

<template>
  <aside class="w-64 border-r border-zinc-100 p-8 h-full overflow-y-auto shrink-0 bg-white">
    <div class="mb-10 flex items-center gap-2">
      <div class="w-1 h-4 bg-zinc-900"></div>
      <span class="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Protocol Index</span>
    </div>
    
    <div class="space-y-1">
      <a 
        v-for="item in outline" 
        :key="item.text"
        @click="emit('navigate', item.el)"
        class="block text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-all py-1.5 border-l-2 border-transparent hover:border-zinc-900 pl-3 uppercase tracking-tighter truncate cursor-pointer"
        :class="[
          item.level === 'h2' ? 'ml-3' : '',
          item.level === 'h3' ? 'ml-6' : ''
        ]"
      >
        {{ item.text }}
      </a>
    </div>
  </aside>
</template>
