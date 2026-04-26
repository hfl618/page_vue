<script setup>
/**
 * @description 知识库列表头部控制区
 */
defineProps({
  viewMode: String,
  currentStack: Object,
  count: Number
})
defineEmits(['update:viewMode', 'update:currentStack', 'open-index'])
</script>

<template>
  <div class="flex items-end justify-between mb-12 flex-wrap gap-10 text-left">
    <div class="max-w-xl">
      <div class="flex items-center gap-4 mb-2">
        <h1 class="text-[28px] font-bold text-zinc-900 tracking-tight uppercase leading-none">
          {{ currentStack ? (currentStack.collection_title || currentStack.title) : (viewMode === 'personal' ? 'My Registry' : 'Discovery') }}
        </h1>
        <button v-if="currentStack" @click="$emit('update:currentStack', null)" class="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase shadow-[4px_4px_0px_#f4f4f5]">BACK TO REGISTRY</button>
      </div>
      <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">Registry Protocol Active. Found: {{ count }}</p>
    </div>

    <!-- 导航切换 -->
    <div class="flex items-center gap-6 border-b border-zinc-200 pb-2">
      <template v-if="!currentStack">
        <button @click="$emit('update:viewMode', 'community')" :class="viewMode === 'community' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent'" class="text-[11px] font-black border-b-2 py-1 transition-all uppercase tracking-widest outline-none">Explore</button>
        <button @click="$emit('update:viewMode', 'personal')" :class="viewMode === 'personal' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent'" class="text-[11px] font-black border-b-2 py-1 transition-all uppercase tracking-widest outline-none">My Notes</button>
      </template>
      <button @click="$emit('open-index')" class="text-[11px] font-black border-b-2 border-transparent py-1 transition-all uppercase tracking-widest outline-none flex items-center gap-2 hover:text-zinc-900">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
          <span>Index</span>
      </button>
    </div>
  </div>
</template>
