<script setup>
/**
 * @description 文章阅读器右侧作者信息卡片
 */
defineProps({
  article: { type: Object, required: true }
})
</script>

<template>
  <aside class="w-[22rem] border-l border-zinc-100 flex flex-col h-full bg-white shrink-0 shadow-[-5px_0px_30px_rgba(0,0,0,0.02)]">
    <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
      <div class="border border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_#e4e4e7] relative group/card">
        <div class="flex items-center gap-3 mb-6">
          <BaseAvatar 
            :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${article.author}`"
            size="40px"
            shape="square"
            border="thin"
            bg-color="bg-zinc-50"
            class="grayscale"
            :fallback-text="article.author?.substring(0, 1)"
          />
          <div class="flex flex-col text-left">
            <span class="text-sm font-black text-zinc-900 uppercase tracking-tight">@{{ article.author }}</span>
            <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Registry Contributor</span>
          </div>
        </div>
        
        <div class="grid grid-cols-4 border-y border-zinc-100 py-4 items-center text-center">
          <div class="border-r border-zinc-100">
            <span class="block text-[13px] font-black font-mono">{{ article.views || 0 }}</span>
            <span class="text-[7px] text-zinc-300 font-bold uppercase">Views</span>
          </div>
          <div class="border-r border-zinc-100">
            <span class="block text-[13px] font-black font-mono">0</span>
            <span class="text-[7px] text-zinc-300 font-bold uppercase">Votes</span>
          </div>
          <div class="border-r border-zinc-100">
            <span class="block text-[13px] font-black font-mono">0</span>
            <span class="text-[7px] text-zinc-300 font-bold uppercase">Replies</span>
          </div>
          <div>
            <span class="block text-[13px] font-black font-mono text-amber-500">{{ article.stars || 0 }}</span>
            <span class="text-[7px] text-amber-400 font-bold uppercase">Stars</span>
          </div>
        </div>
        
        <div class="mt-4">
          <BaseActionLink 
            :to="`/knowledge/editor/${article.id}`" 
            block
          >
            Edit Module
          </BaseActionLink>
        </div>
      </div>
    </div>
  </aside>
</template>
