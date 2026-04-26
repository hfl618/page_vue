<script setup>
/**
 * @description 知识库阅读器页面
 * 逻辑见 hooks/useKnowledgeReader.js, 组件见 components/
 */
const {
  article, isPreviewReady, showOutline, showMeta, lineSpacing,
  wordCount, outline, fetchDetail, generateOutline, scrollToHeading
} = useKnowledgeReader()

const initVditorPreview = () => {
  const mountPoint = document.getElementById('preview-mount')
  if (!mountPoint || !article.value) return
  
  window.Vditor.preview(mountPoint, article.value.content, {
    mode: 'light', 
    anchor: 1, 
    cdn: EDITOR_CONFIG.VDITOR_CDN,
    hljs: { style: 'github' },
    after: () => { 
      isPreviewReady.value = true
      generateOutline(mountPoint)
    }
  })
}

onMounted(async () => {
  await fetchDetail()
  if (article.value) {
    setTimeout(initVditorPreview, 150)
  }
})
</script>

<template>
  <div class="h-full flex flex-row overflow-hidden bg-white relative" translate="no">
    
    <!-- 左手柄 -->
    <button @click="showOutline = !showOutline" :style="showOutline ? 'left: 16rem' : 'left: 0'" class="fixed-control-sharp z-50">
        <svg :class="showOutline ? '' : 'rotate-180'" class="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 19l-7-7 7-7"/></svg>
    </button>

    <!-- 侧边大纲 (自动导入组件) -->
    <KnowledgeOutline v-if="showOutline" :outline="outline" @navigate="scrollToHeading" />

    <div class="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-white">
        <div class="max-w-4xl mx-auto py-20 px-10 transition-opacity duration-500" :style="article ? 'opacity: 1' : 'opacity: 0'">
            
            <!-- 状态条 -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4 text-left">
                    <span class="px-2 py-0.5 border border-zinc-900 text-zinc-900 text-[9px] font-black uppercase tracking-tighter bg-white shadow-[2px_2px_0px_#f4f4f5]">
                        {{ article?.category_name || 'General' }}
                    </span>
                    <div class="h-px w-8 bg-zinc-100"></div>
                    <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] italic">Archive Established</span>
                </div>
                <div class="flex items-center gap-2 bg-zinc-50 px-3 py-1 border border-zinc-100">
                    <span class="text-[11px] font-black font-mono text-zinc-900">{{ wordCount }}</span>
                    <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Words</span>
                </div>
            </div>

            <h1 class="text-5xl font-black text-zinc-900 mb-6 uppercase tracking-tighter leading-tight text-left">{{ article?.title }}</h1>
            
            <!-- 信息条 -->
            <div class="flex items-center gap-6 mb-4 pb-4 border-b border-zinc-50">
                <div class="flex items-center gap-2 text-left">
                    <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">AuthNode</span>
                    <span class="text-[10px] font-bold text-zinc-900">@{{ article?.author }}</span>
                </div>
                <div class="flex items-center gap-2 text-left">
                    <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Timestamp</span>
                    <span class="text-[10px] font-bold text-zinc-900 font-mono">{{ article?.created_at }}</span>
                </div>
            </div>

            <!-- 内容挂载点 -->
            <div id="preview-mount" class="vditor-reset mb-20 text-left" :style="{'--article-line-spacing': lineSpacing}"></div>
        </div>
    </div>

    <!-- 右手柄 -->
    <button @click="showMeta = !showMeta" :style="showMeta ? 'right: 22rem' : 'right: 0'" class="fixed-control-sharp z-50 border-r-0">
        <svg :class="showMeta ? 'rotate-180' : ''" class="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 19l-7-7 7-7"/></svg>
    </button>

    <!-- 右侧信息卡片 (自动导入组件) -->
    <KnowledgeMetaCard v-if="showMeta" :article="article || {}" />
  </div>
</template>

<style>
.fixed-control-sharp { position: absolute; top: 50%; transform: translateY(-50%); width: 24px; height: 64px; background: white; border: 1px solid #e4e4e7; display: grid; place-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fixed-control-sharp:hover { background: #18181b; color: white; }
.vditor-reset { font-size: 16px !important; line-height: var(--article-line-spacing, 1.8) !important; }
</style>
