<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

const article = ref(null)
const isPreviewReady = ref(false)
const showOutline = ref(true)
const showMeta = ref(true)
const lineSpacing = ref(1.8)
const wordCount = ref(0)

const calculateWords = (text) => {
    if (!text) return 0
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9']+/g) || []
    return chineseChars.length + englishWords.length
}

const fetchDetail = async () => {
    try {
        const data = await request.get(`/v1/knowledge/read/${route.params.id}`)
        article.value = data
        wordCount.value = calculateWords(data.content)
        setTimeout(() => initVditorPreview(), 150)
    } catch (e) {
        uiStore.hideLoading()
    }
}

const initVditorPreview = () => {
    const mountPoint = document.getElementById('preview-mount')
    if (!mountPoint) return
    window.Vditor.preview(mountPoint, article.value.content, {
        mode: 'light', anchor: 1, cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.9.6',
        hljs: { style: 'github' },
        after: () => { isPreviewReady.value = true; renderOutline(); uiStore.hideLoading(); }
    })
}

const renderOutline = () => {
    const container = document.getElementById('reader-outline-container')
    const vd = document.getElementById('preview-mount')
    if (!container || !vd) return
    container.innerHTML = ''
    vd.querySelectorAll('h1, h2, h3').forEach(h => {
        const level = h.tagName.toLowerCase()
        const link = document.createElement('a')
        link.className = `block text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-all py-1.5 border-l-2 border-transparent hover:border-zinc-900 pl-3 uppercase tracking-tighter truncate cursor-pointer ${level === 'h2' ? 'ml-3' : level === 'h3' ? 'ml-6' : ''}`
        link.innerText = h.innerText.replace(/^#+\s/, '')
        link.onclick = () => h.scrollIntoView({ behavior: 'smooth' })
        container.appendChild(link)
    })
}

onMounted(() => {
    uiStore.showLoading('SYNCHRONIZING', 'Accessing Registry...')
    fetchDetail()
})
</script>

<template>
  <div class="h-full flex flex-row overflow-hidden bg-white relative" translate="no">
    
    <!-- 左手柄 -->
    <button @click="showOutline = !showOutline" :style="showOutline ? 'left: 16rem' : 'left: 0'" class="fixed-control-sharp z-50">
        <svg :class="showOutline ? '' : 'rotate-180'" class="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 19l-7-7 7-7"/></svg>
    </button>

    <aside v-if="showOutline" class="w-64 border-r border-zinc-100 p-8 h-full overflow-y-auto shrink-0 bg-white">
        <div class="mb-10 flex items-center gap-2"><div class="w-1 h-4 bg-zinc-900"></div><span class="text-[11px] font-black text-zinc-900 uppercase tracking-widest">Protocol Index</span></div>
        <div id="reader-outline-container" class="space-y-1"></div>
    </aside>

    <div class="flex-1 h-full overflow-y-auto custom-scrollbar relative bg-white">
        <div class="max-w-4xl mx-auto py-20 px-10 transition-opacity duration-500" :style="article ? 'opacity: 1' : 'opacity: 0'">
            
            <!-- 状态条 -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
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

            <div id="preview-mount" class="vditor-reset mb-20 text-left" :style="{'--article-line-spacing': lineSpacing}"></div>
        </div>
    </div>

    <!-- 右手柄 -->
    <button @click="showMeta = !showMeta" :style="showMeta ? 'right: 22rem' : 'right: 0'" class="fixed-control-sharp z-50 border-r-0">
        <svg :class="showMeta ? 'rotate-180' : ''" class="w-3.5 h-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 19l-7-7 7-7"/></svg>
    </button>

    <aside v-if="showMeta" class="w-[22rem] border-l border-zinc-100 flex flex-col h-full bg-white shrink-0 shadow-[-5px_0px_30px_rgba(0,0,0,0.02)]">
        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
            <div class="border border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_#e4e4e7] relative group/card">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 border border-zinc-900 overflow-hidden bg-zinc-50"><img :src="`https://api.dicebear.com/7.x/identicon/svg?seed=${article?.author}`" class="w-full h-full grayscale"></div>
                    <div class="flex flex-col text-left">
                        <span class="text-sm font-black text-zinc-900 uppercase tracking-tight">@{{ article?.author }}</span>
                        <span class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Registry Contributor</span>
                    </div>
                </div>
                <div class="grid grid-cols-4 border-y border-zinc-100 py-4 items-center text-center">
                    <div class="border-r border-zinc-100"><span class="block text-[13px] font-black font-mono">{{ article?.views || 0 }}</span><span class="text-[7px] text-zinc-300 font-bold uppercase">Views</span></div>
                    <div class="border-r border-zinc-100"><span class="block text-[13px] font-black font-mono">0</span><span class="text-[7px] text-zinc-300 font-bold uppercase">Votes</span></div>
                    <div class="border-r border-zinc-100"><span class="block text-[13px] font-black font-mono">0</span><span class="text-[7px] text-zinc-300 font-bold uppercase">Replies</span></div>
                    <div><span class="block text-[13px] font-black font-mono text-amber-500">{{ article?.stars || 0 }}</span><span class="text-[7px] text-amber-400 font-bold uppercase">Stars</span></div>
                </div>
                <div class="mt-4"><router-link v-if="article" :to="`/knowledge/editor/${article.id}`" class="block w-full text-center font-black text-zinc-900 border-b-2 border-zinc-100 hover:border-zinc-900 transition-all uppercase px-0.5 pb-0.5 text-[10px]">Edit Module</router-link></div>
            </div>
        </div>
    </aside>
  </div>
</template>

<style>
.fixed-control-sharp { position: absolute; top: 50%; transform: translateY(-50%); width: 24px; height: 64px; background: white; border: 1px solid #e4e4e7; display: grid; place-items: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fixed-control-sharp:hover { background: #18181b; color: white; }
.vditor-reset { font-size: 16px !important; line-height: 1.8 !important; }
</style>
