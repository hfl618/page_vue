<script setup>
/**
 * DiscussionItem 原子组件说明：
 * 1. 精准复刻 templates/components/article/post_item.html。
 * 2. 包含左侧投票逻辑预览、顶部蓝色作者标签、下方统计数据。
 * 3. 样式风格：纯净流式布局，适合社区讨论流。
 */
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex items-start gap-5 p-6 bg-white border-b border-zinc-50 hover:bg-zinc-50/50 transition-all group text-left">
    <!-- 投票展示 (还原 w-8 h-8 灰色方块) -->
    <div class="flex flex-col items-center gap-1 shrink-0 pt-1">
      <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-50 text-zinc-400 hover:text-zinc-900 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M5 15l7-7 7 7"/>
        </svg>
      </button>
      <span class="text-xs font-mono font-bold text-zinc-900">{{ item.votes }}</span>
    </div>

    <!-- 内容区 (还原 10px 蓝色作者与宽字符间距) -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1.5">
        <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{{ item.time }}</span>
        <div class="w-1 h-1 rounded-full bg-zinc-200"></div>
        <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">by @{{ item.author }}</span>
      </div>
      
      <h3 class="text-[16px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors mb-1.5">
        {{ item.title }}
      </h3>
      
      <p class="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed mb-3 font-medium">
        {{ item.excerpt }}
      </p>

      <!-- 标签与统计 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span v-for="tag in item.tags" :key="tag" class="px-2 py-0.5 bg-zinc-50 text-zinc-400 border border-zinc-100 rounded text-[9px] font-bold uppercase">
            {{ tag }}
          </span>
        </div>
        
        <div class="flex items-center gap-4 text-zinc-300 text-[11px] font-bold">
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            {{ item.replies }}
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c3.478 0 6.522 1.756 8.542 4.542a2 2 0 010 2.916C18.522 17.244 15.478 19 12 19c-4.477 0-8.268-2.943-9.542-7z"/></svg>
            {{ item.views }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
