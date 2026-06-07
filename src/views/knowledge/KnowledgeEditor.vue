<script setup>
import { onMounted, ref } from 'vue'
import { useKnowledgeEditor } from './hooks/useKnowledgeEditor'
import { useEditorStore } from '@/store/editor'
import EditorOutline from './components/EditorOutline.vue'
import TiptapEditor from './components/TiptapEditor.vue'
import MediaManager from './components/MediaManager.vue'

/**
 * @description 知识库沉浸式编辑器 (三层架构版)
 */
const {
  article, articleId, categories, parents, wordCount,
  showDesigner, init, handleSave
} = useKnowledgeEditor()

const editorStore = useEditorStore()
const editorRef = ref(null)

// 处理媒体插入指令
const handleInsertMedia = (media) => {
  if (editorRef.value) {
    editorRef.value.insertMedia(media)
  }
}

// 拦截粘贴的文件并加入素材库
const handleFileInjected = (file) => {
  const url = URL.createObjectURL(file)
  const isImage = file.type.startsWith('image/')
  const mediaObj = {
    id: Date.now() + Math.random(),
    name: file.name || 'Pasted_Image.png',
    type: isImage ? 'image' : 'file',
    url: url,
    size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
  }
  editorStore.addMedia(mediaObj)
  handleInsertMedia(mediaObj)
}

onMounted(() => {
  init()
  // 默认开启大纲和素材库
  editorStore.setDockActive(true)
})
</script>

<template>
  <div class="h-full flex flex-row bg-[#fafafa] overflow-hidden select-none" translate="no">
    
    <!-- 1. 左侧大纲栏 -->
    <div class="w-72 shrink-0 h-full border-r border-zinc-100 hidden lg:block">
      <EditorOutline />
    </div>

    <!-- 2. 中间核心编辑区 -->
    <div class="flex-1 flex flex-col min-w-0 bg-white shadow-[0_0_40px_rgba(0,0,0,0.02)] z-10">
        <!-- 紧凑型页眉 -->
        <header class="h-16 border-b border-zinc-50 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md">
            <div class="flex items-center gap-6 flex-1">
                <div class="w-1.5 h-1.5 bg-zinc-900 animate-pulse"></div>
                <input type="text" v-model="article.title" placeholder="PROTOCOL_NOMENCLATURE..." 
                       class="text-[16px] font-black uppercase tracking-tight outline-none w-full max-w-2xl bg-transparent placeholder:text-zinc-100">
            </div>
            
            <div class="flex items-center gap-8">
                <div class="flex flex-col items-end">
                    <span class="text-[12px] font-black font-mono text-zinc-900 leading-none">{{ wordCount }}</span>
                    <span class="text-[7px] font-bold text-zinc-300 uppercase tracking-widest mt-1">Metrics</span>
                </div>
                <div class="h-8 w-px bg-zinc-100"></div>
                
                <div class="flex gap-2">
                  <BaseIconButton @click="showDesigner = !showDesigner" :active="showDesigner" title="Module Designer">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                  </BaseIconButton>
                  <BaseButton @click="handleSave" class="!py-2 !px-8 !w-auto">Sync Push</BaseButton>
                </div>
            </div>
        </header>

        <main class="flex-1 relative overflow-hidden">
            <TiptapEditor 
              ref="editorRef"
              v-model="article.content" 
              @file-injected="handleFileInjected"
            />

            <!-- 浮动设计抽屉 (覆盖在编辑器右侧) -->
            <Transition name="slide-right">
                <div v-if="showDesigner" class="absolute inset-y-0 right-0 w-[400px] bg-white border-l border-zinc-900 shadow-[-20px_0px_60px_rgba(0,0,0,0.1)] z-30 flex flex-col">
                    <div class="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                        <div>
                          <h4 class="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-900">Module Designer</h4>
                          <p class="text-[8px] text-zinc-400 font-bold uppercase mt-1">Configuring registry node metadata</p>
                        </div>
                        <BaseIconButton @click="showDesigner = false">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </BaseIconButton>
                    </div>
                    
                    <div class="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar text-left bg-white">
                        <section class="space-y-8">
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
                            <div class="DesignerField">
                                <label>Visibility Protocol</label>
                                <BaseSegmented 
                                  v-model="article.visibility" 
                                  :options="[
                                    { label: 'PUBLIC', value: 'public' },
                                    { label: 'PRIVATE', value: 'private' }
                                  ]" 
                                />
                            </div>
                        </section>

                        <section class="pt-10 border-t border-zinc-100 space-y-8">
                            <div class="flex items-center justify-between">
                                <div>
                                  <span class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Bundle Definition</span>
                                  <p class="text-[8px] text-zinc-400 font-bold uppercase mt-0.5">Initialize as container node</p>
                                </div>
                                <PhysicalSwitch v-model="article.is_collection" />
                            </div>
                            
                            <template v-if="article.is_collection">
                                <div class="DesignerField">
                                    <label>Bundle Nomenclature</label>
                                    <input type="text" v-model="article.collection_title" class="DesignerInput" placeholder="SYSTEM ARCHIVE NAME">
                                </div>
                                <div class="DesignerField">
                                    <label>Visual Protocol (Icon)</label>
                                    <div class="grid grid-cols-5 gap-2">
                                        <button v-for="icon in ['box','code','database','cpu','cloud']" 
                                                :key="icon" 
                                                @click="article.collection_icon = icon" 
                                                class="w-full aspect-square border flex items-center justify-center transition-all group" 
                                                :class="article.collection_icon === icon ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-100 text-zinc-300 hover:border-zinc-400 hover:text-zinc-900'">
                                            <span class="text-[8px] font-black uppercase tracking-tighter">{{ icon }}</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </section>
                    </div>

                    <footer class="p-8 border-t border-zinc-100 bg-zinc-50 flex justify-end">
                      <BaseButton @click="showDesigner = false" variant="primary" class="!w-full">Confirm Config</BaseButton>
                    </footer>
                </div>
            </Transition>
        </main>
    </div>

    <!-- 3. 右侧素材管理栏 -->
    <MediaManager @insert-media="handleInsertMedia" />

  </div>
</template>

<style scoped>
.DesignerField label { display: block; font-size: 9px; font-weight: 900; text-transform: uppercase; color: #a1a1aa; letter-spacing: 0.15em; margin-bottom: 12px; }
.DesignerInput { width: 100%; background-color: #fafafa; border: 1px solid #f4f4f5; padding: 14px; font-size: 11px; font-weight: 900; text-transform: uppercase; outline: none; transition: all 0.2s; }
.DesignerInput:focus { border-color: #18181b; background-color: #fff; box-shadow: 4px 4px 0px #f4f4f5; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; }
</style>
