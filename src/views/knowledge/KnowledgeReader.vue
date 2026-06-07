<script setup>
import { onMounted, watch } from 'vue'
import { useKnowledgeReader } from './hooks/useKnowledgeReader'

/**
 * @description 知识库阅读器页面 (沉浸式优化版)
 */
const {
  article, isPreviewReady, showOutline, showMeta, lineSpacing,
  wordCount, outline, fetchDetail, generateOutline, scrollToHeading
} = useKnowledgeReader()

onMounted(async () => {
  await fetchDetail()
  if (article.value) {
    generateOutline(article.value.content)
    isPreviewReady.value = true
  }
})

// 监听内容变化同步大纲
watch(() => article.value?.content, (newVal) => {
  if (newVal) generateOutline(newVal)
})
</script>

<template>
  <div class="h-full flex flex-row overflow-hidden bg-[#fafafa] relative select-none" translate="no">
    
    <!-- 1. 左侧大纲栏 -->
    <aside class="w-72 shrink-0 h-full border-r border-zinc-100 bg-white hidden lg:flex flex-col p-8 transition-transform duration-500 z-40"
           :class="showOutline ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex items-center gap-2 mb-8">
        <div class="w-1 h-3 bg-zinc-900"></div>
        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Navigation TOC</span>
      </div>

      <nav class="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div 
          v-for="(item, index) in outline" 
          :key="index"
          class="group flex items-start gap-3 py-2.5 cursor-pointer transition-all hover:translate-x-1"
          :style="{ paddingLeft: (parseInt(item.level.replace('h', '')) - 1) * 12 + 'px' }"
          @click="scrollToHeading(item.text)"
        >
          <span class="text-[9px] font-mono text-zinc-300 mt-1 group-hover:text-zinc-900">0{{ index + 1 }}</span>
          <span class="text-[12px] text-zinc-500 font-medium group-hover:text-zinc-900 transition-colors truncate">
            {{ item.text }}
          </span>
        </div>
      </nav>

      <div class="mt-8 pt-8 border-t border-zinc-50 flex items-center justify-between">
        <span class="text-[8px] font-mono text-zinc-300 uppercase tracking-widest">Protocol ID: {{ article?.id }}</span>
      </div>
    </aside>

    <!-- 左浮动手柄 (Blade Handle) -->
    <button 
      @click="showOutline = !showOutline" 
      :style="{ left: showOutline ? '18rem' : '0' }"
      class="fixed-handle z-50 border-l-0 rounded-r-lg"
    >
      <svg :class="showOutline ? 'rotate-0' : 'rotate-180'" class="w-3.5 h-3.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- 2. 主内容区 -->
    <main class="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-white z-10">
        <div class="max-w-4xl mx-auto py-24 px-12 lg:px-20 transition-opacity duration-700" 
             :class="isPreviewReady ? 'opacity-100' : 'opacity-0'">
            
            <!-- 头部元数据 -->
            <header class="mb-16">
                <div class="flex items-center gap-4 mb-10">
                    <span class="px-3 py-1 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.2em]">
                        {{ article?.category_name || 'General' }}
                    </span>
                    <div class="h-px flex-1 bg-zinc-100"></div>
                    <div class="flex items-center gap-2">
                        <span class="text-[11px] font-black font-mono text-zinc-900">{{ wordCount }}</span>
                        <span class="text-[7px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Tokens</span>
                    </div>
                </div>

                <h1 class="text-5xl font-black text-zinc-900 mb-8 uppercase tracking-tighter leading-[1.1] text-left break-words">
                  {{ article?.title }}
                </h1>
                
                <div class="flex flex-wrap items-center gap-y-4 gap-x-10 pt-8 border-t border-zinc-900">
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Authenticated Node</span>
                        <span class="text-[11px] font-bold text-zinc-900 uppercase">@{{ article?.author || 'ANON' }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Archive Timestamp</span>
                        <span class="text-[11px] font-bold text-zinc-900 font-mono">{{ article?.created_at }}</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Access Protocol</span>
                        <span class="text-[11px] font-bold" :class="article?.visibility === 'public' ? 'text-emerald-600' : 'text-zinc-400'">
                          {{ article?.visibility?.toUpperCase() || 'PRIVATE' }}
                        </span>
                    </div>
                </div>
            </header>

            <!-- 核心渲染区 -->
            <article class="article-content text-left select-text" :style="{'--line-height': lineSpacing}">
              <div v-html="article?.content" class="tiptap-renderer"></div>
            </article>

            <!-- 底部装饰 -->
            <footer class="mt-32 pt-16 border-t border-zinc-100 flex flex-col items-center">
              <div class="w-12 h-1 border-b-4 border-zinc-100 mb-8"></div>
              <p class="text-[9px] font-black text-zinc-300 uppercase tracking-[0.5em]">End of Transmission</p>
            </footer>
        </div>
    </main>

    <!-- 右浮动手柄 (Blade Handle) -->
    <button 
      @click="showMeta = !showMeta" 
      :style="{ right: showMeta ? '22rem' : '0' }"
      class="fixed-handle z-50 border-r-0 rounded-l-lg"
    >
      <svg :class="showMeta ? 'rotate-180' : 'rotate-0'" class="w-3.5 h-3.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- 3. 右侧信息面板 -->
    <Transition name="slide-right">
      <KnowledgeMetaCard v-if="showMeta" :article="article || {}" class="z-40 border-l border-zinc-900 shadow-[-20px_0_60px_rgba(0,0,0,0.05)]" />
    </Transition>
  </div>
</template>

<style scoped>
.fixed-handle { 
  position: absolute; 
  top: 50%; 
  transform: translateY(-50%); 
  width: 20px; 
  height: 64px; 
  background: white; 
  border: 1px solid #e4e4e7; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}
.fixed-handle:hover { background: #18181b; color: white; border-color: #18181b; }

.tiptap-renderer :deep(h1) { font-size: 32px; font-weight: 900; margin-top: 3rem; margin-bottom: 1.5rem; letter-spacing: -0.02em; border-bottom: 2px solid #18181b; padding-bottom: 0.5rem; text-transform: uppercase; }
.tiptap-renderer :deep(h2) { font-size: 22px; font-weight: 800; margin-top: 2.5rem; margin-bottom: 1.2rem; border-left: 5px solid #18181b; padding-left: 1.2rem; }
.tiptap-renderer :deep(h3) { font-size: 18px; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
.tiptap-renderer :deep(p) { font-size: 16px; line-height: var(--line-height, 1.8); margin-bottom: 1.5rem; color: #3f3f46; }

.tiptap-renderer :deep(img) {
  max-width: 100%;
  border: 1px solid #18181b;
  box-shadow: 6px 6px 0px #f4f4f5;
  margin: 3rem 0;
}

.tiptap-renderer :deep(a) {
  color: #18181b;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; }
</style>
