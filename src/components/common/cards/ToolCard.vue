<script setup>
/**
 * ToolCard 工业级还原版：
 * 1. 结构完全对齐 tool_card.html。
 * 2. 包含右上角交互组、Icon 容器、标题/版本号、描述以及弹出式启动按钮。
 * 3. 悬停动效：-translate-x-1, scale-[1.02], 阴影加深至 [10px_8px_0px_#f4f4f5]。
 */
defineProps({
  name: String,
  description: String,
  iconPath: String,
  tag: { type: String, default: 'UTILITY' },
  version: { type: String, default: 'V1.0.0' },
  author: { type: String, default: 'SYSTEM' },
  isCore: { type: Boolean, default: false },
  favStatus: { type: Boolean, default: false },
  url: { type: String, default: '#' }
})
</script>

<template>
  <div class="tool-paper-card p-4 flex flex-col justify-between group h-[175px] bg-white border border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] hover:-translate-x-1 hover:scale-[1.02] hover:shadow-[10px_8px_0px_#f4f4f5] transition-all duration-300 rounded-0 relative overflow-hidden text-left" translate="no">
    
    <!-- 右上角：交互控制组 -->
    <div class="absolute top-3 right-3 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button class="w-7 h-7 flex items-center justify-center border border-zinc-100 bg-white/80 backdrop-blur-sm text-zinc-300 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-[2px_2px_0px_#fbfbfb] hover:shadow-none active:translate-x-0.5 active:translate-y-0.5">
        <svg class="w-3.5 h-3.5" :class="favStatus ? 'fill-current text-zinc-900' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    </div>

    <div class="flex flex-col gap-3 flex-1 min-w-0">
      <!-- 1. 顶部行：图标与标题 -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 border border-zinc-900 flex items-center justify-center bg-zinc-100 shrink-0 overflow-hidden relative group/icon p-1.5">
          <svg class="w-5 h-5 text-zinc-900 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
          </svg>
        </div>
        <div class="flex-1 min-w-0 pr-10">
          <h3 class="text-[13px] font-black text-zinc-900 uppercase tracking-tight leading-tight line-clamp-1">{{ name }}</h3>
          <span class="text-[8px] font-bold font-mono text-zinc-400 mt-1 inline-block opacity-60">{{ version }}</span>
        </div>
      </div>

      <!-- 2. 标签与描述 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <span class="text-[8px] font-black text-zinc-400 uppercase">#{{ tag }}</span>
          <span v-if="isCore" class="px-1.5 py-0.5 bg-zinc-900 text-white text-[7px] font-black uppercase tracking-widest">Core</span>
        </div>
        <p class="text-[10px] text-zinc-400 font-bold leading-relaxed line-clamp-2 italic">{{ description }}</p>
      </div>
    </div>

    <!-- 3. 底部元数据 -->
    <div class="mt-auto pt-3 border-t border-zinc-50 flex items-center justify-between group-hover:opacity-0 transition-opacity duration-200">
      <span class="text-[8px] font-black text-zinc-300 uppercase tracking-widest">DEPLOYED BY @{{ author }}</span>
      <svg class="w-3 h-3 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
    </div>

    <!-- 4. 弹出式启动按钮 -->
    <div class="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white z-20">
      <a :href="url" class="w-full flex items-center justify-center py-3 bg-zinc-900 text-white shadow-[4px_4px_0px_#f4f4f5] hover:bg-black transition-all active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
        <span class="text-[10px] font-black uppercase tracking-[0.3em]">Launch Module</span>
      </a>
    </div>
  </div>
</template>
