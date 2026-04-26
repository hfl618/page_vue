<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()

// --- 核心协议状态 ---
const vditor = ref(null)
const articleId = ref(route.params.id || null)
const categories = ref([])
const parents = ref([])
const wordCount = ref(0)
const showDesigner = ref(false)

const article = ref({
  title: '', content: '', excerpt: '', tags: '', category_id: 1, visibility: 'private',
  is_collection: 0, parent_id: null, collection_title: '', collection_desc: '',
  collection_icon: 'box', collection_color: 'zinc', collection_image: '', use_custom_image: 0
})

// --- 算法：中=1, 英=1 ---
const calculateWords = (text) => {
    if (!text) return 0
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9']+/g) || []
    return chineseChars.length + englishWords.length
}

const initVditor = (content) => {
  if (!window.Vditor) return
  vditor.value = new window.Vditor('vditor-mount', {
    height: '100%', mode: 'ir', value: content || '', theme: 'classic',
    cdn: 'https://cdn.jsdelivr.net/npm/vditor@3.9.6', cache: { enable: false },
    counter: { enable: true },
    after: () => {
        wordCount.value = calculateWords(vditor.value.getValue())
        uiStore.hideLoading()
    }
  })
}

onMounted(async () => {
  try {
    const [catRes, parentRes, detail] = await Promise.all([
        request.get('/v1/knowledge/categories'),
        request.get('/v1/knowledge/potential-parents'),
        articleId.value ? request.get(`/v1/knowledge/read/${articleId.value}`) : Promise.resolve(null)
    ])
    categories.value = catRes || []
    parents.value = parentRes || []
    if (detail) article.value = { ...article.value, ...detail }
    
    await nextTick()
    setTimeout(() => initVditor(article.value.content), 500)
  } catch (e) {
    uiStore.hideLoading()
  }
})

const handleSave = async () => {
    uiStore.showLoading('SYNCING', 'Verifying Registry Protocol...')
    try {
        const payload = { ...article.value, content: vditor.value.getValue() }
        const res = await request.post('/v1/knowledge/save', payload)
        uiStore.addNotice({ title: 'SUCCESS', message: 'Registry integrity verified.', type: 'success' })
        if (!articleId.value) router.push(`/knowledge/editor/${res.id}`)
    } finally { uiStore.hideLoading() }
}
</script>

<template>
  <div class="h-full flex flex-row bg-white overflow-hidden" translate="no">
    
    <!-- 左侧工业岛 (1:1 复刻) -->
    <aside class="w-[52px] border-r border-zinc-100 flex flex-col items-center py-6 shrink-0 bg-white z-20">
        <div class="flex flex-col gap-4">
            <button @click="handleSave" class="island-btn bg-zinc-900 text-white" title="Sync Push">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M5 13 l 4 4 L 19 7"/></svg>
            </button>
            <button @click="showDesigner = !showDesigner" class="island-btn" :class="showDesigner ? 'bg-zinc-100' : ''" title="Archive Designer">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M4 5 a 1 1 0 0 1 1 -1 h 14 a 1 1 0 0 1 1 1 v 2 a 1 1 0 0 1 -1 1 H 5 a 1 1 0 0 1 -1 -1 V 5 z M 4 13 a 1 1 0 0 1 1 -1 h 6 a 1 1 0 0 1 1 1 v 6 a 1 1 0 0 1 -1 1 H 5 a 1 1 0 0 1 -1 -1 v -6 z M 16 13 a 1 1 0 0 1 1 -1 h 2 a 1 1 0 0 1 1 1 v 6 a 1 1 0 0 1 -1 1 h -2 a 1 1 0 0 1 -1 -1 v -6 z"/></svg>
            </button>
            <div class="h-px w-6 bg-zinc-100 my-2"></div>
            <button class="island-btn" title="YAML Mode">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M8 9 l 3 3 -3 3 m 5 0 h 3 M 5 20 h 14 a 2 2 0 0 0 2 -2 V 6 a 2 2 0 0 0 -2 -2 H 5 a 2 2 0 0 0 -2 2 v 12 a 2 2 0 0 0 2 2 z"/></svg>
            </button>
            <button class="island-btn" @click="article.visibility = article.visibility === 'public' ? 'private' : 'public'">
                <svg class="w-4 h-4" :class="article.visibility === 'public' ? 'text-emerald-500' : 'text-zinc-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                    <path v-if="article.visibility === 'public'" d="M15 12 a 3 3 0 1 1 -6 0 a 3 3 0 0 1 6 0 z M 2.458 12 C 3.732 7.943 7.523 5 12 5 s 8.268 2.943 9.542 7"/>
                    <path v-else d="M12 15 v 2 m -6 4 h 12 a 2 2 0 0 0 2 -2 v -6 a 2 2 0 0 0 -2 -2 H 6 a 2 2 0 0 0 -2 2 v 6 a 2 2 0 0 0 2 2 z m 10 -10 V 7 a 4 4 0 0 0 -8 0 v 4 h 8 z"/>
                </svg>
            </button>
        </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
        <header class="h-14 border-b border-zinc-50 flex items-center justify-between px-10 shrink-0 bg-white">
            <div class="flex items-center gap-6 flex-1">
                <input type="text" v-model="article.title" placeholder="NOMENCLATURE..." class="text-[18px] font-black uppercase tracking-tight outline-none w-full max-w-2xl bg-transparent placeholder:text-zinc-100">
            </div>
            <div class="flex items-center gap-6">
                <div class="flex flex-col items-end shrink-0">
                    <span class="text-[11px] font-black font-mono text-zinc-900 leading-none">{{ wordCount }}</span>
                    <span class="text-[7px] font-bold text-zinc-300 uppercase tracking-widest">Words</span>
                </div>
                <div class="h-8 w-px bg-zinc-100"></div>
                <button @click="handleSave" class="px-6 py-1.5 bg-zinc-900 text-white text-[10px] font-black uppercase shadow-[4px_4px_0px_#f4f4f5] hover:bg-black transition-all">Sync Registry</button>
            </div>
        </header>

        <main class="flex-1 relative">
            <div id="vditor-mount" class="h-full"></div>

            <!-- 设计师抽屉 -->
            <Transition name="slide-right">
                <div v-if="showDesigner" class="absolute inset-y-0 right-0 w-96 bg-white border-l border-zinc-900 shadow-[-10px_0px_50px_rgba(0,0,0,0.05)] z-30 flex flex-col">
                    <div class="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <span class="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900">Module Designer</span>
                        <button @click="showDesigner = false" class="text-zinc-400 hover:text-zinc-900 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18 L 18 6 M 6 6 l 12 12"/></svg></button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar text-left bg-white">
                        <div class="space-y-8">
                            <div class="DesignerField">
                                <label>Registry Hierarchy</label>
                                <select v-model="article.parent_id" class="DesignerInput">
                                    <option :value="null">-- STANDALONE MODULE --</option>
                                    <option v-for="p in parents" :key="p.id" :value="p.id">{{ p.title }}</option>
                                </select>
                            </div>
                            <div class="DesignerField">
                                <label>Protocol Category</label>
                                <select v-model="article.category_id" class="DesignerInput">
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-8 pt-8 border-t border-zinc-100">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Bundle definition</span>
                                <div @click="article.is_collection = article.is_collection ? 0 : 1" class="w-10 h-5 border border-zinc-900 relative cursor-pointer p-0.5 transition-all" :class="article.is_collection ? 'bg-zinc-900' : 'bg-zinc-50'">
                                    <div class="w-3.5 h-3.5 transition-all" :class="article.is_collection ? 'translate-x-5 bg-white' : 'bg-zinc-900'"></div>
                                </div>
                            </div>
                            <template v-if="article.is_collection">
                                <div class="DesignerField"><label>Bundle Nomenclature</label><input type="text" v-model="article.collection_title" class="DesignerInput" placeholder="SYSTEM ARCHIVE NAME"></div>
                                <div class="DesignerField">
                                    <label>Visual Protocol (Icon)</label>
                                    <div class="grid grid-cols-5 gap-2">
                                        <button v-for="icon in ['box','code','database','cpu','cloud']" :key="icon" @click="article.collection_icon = icon" class="w-full aspect-square border flex items-center justify-center transition-all" :class="article.collection_icon === icon ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-100 text-zinc-400'">
                                            <span class="text-[9px] font-black uppercase">{{ icon.substring(0,3) }}</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </Transition>
        </main>
    </div>
  </div>
</template>

<style scoped>
.island-btn { width: 36px; height: 36px; border: 1px solid #e4e4e7; display: flex; align-items: center; justify-content: center; background: white; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); outline: none; }
.island-btn:hover { border-color: #18181b; color: #18181b; transform: translate(-2px, -2px); box-shadow: 4px 4px 0px #f4f4f5; }
.DesignerField label { display: block; font-size: 9px; font-weight: 900; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.1em; margin-bottom: 10px; }
.DesignerInput { width: 100%; background-color: #fafafa; border: 1px solid #f4f4f5; padding: 12px 14px; font-size: 11px; font-weight: 900; text-transform: uppercase; outline: none; transition: all 0.3s; }
.DesignerInput:focus { border-color: #18181b; background-color: #fff; }
.vditor { border: none !important; }
.vditor-toolbar { border-bottom: 1px solid #f4f4f5 !important; background: #fff !important; padding: 0 40px !important; }
.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
