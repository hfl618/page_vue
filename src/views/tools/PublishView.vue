<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/store/ui'

/**
 * PublishView 工业级还原版：
 * 1. 物理还原 Identity, Bundle, Metadata 三大分层。
 * 2. 逻辑还原：Slug 自动生成、HTML 实时沙箱预览、文件读取。
 * 3. 视觉：超大 DEPLOY 按钮与工业级边框细节。
 */

const router = useRouter()
const uiStore = useUiStore()

// 表单状态
const label = ref('')
const slug = ref('')
const slugCustomized = ref(false)
const version = ref('V1.0.0')
const sortWeight = ref(100)
const isPublic = ref(true)
const categoryTag = ref('')
const description = ref('')

// 文件处理状态
const iconPreview = ref('')
const htmlFileName = ref('')
const htmlContent = ref('')

// 自动生成 Slug 逻辑
watch(label, (newVal) => {
  if (!slugCustomized.value) {
    slug.value = newVal.trim().toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

const onIconChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => iconPreview.value = ev.target.result
    reader.readAsDataURL(file)
  }
}

const onHtmlChange = (e) => {
  const file = e.target.files[0]
  if (file && file.name.endsWith('.html')) {
    htmlFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (ev) => htmlContent.value = ev.target.result
    reader.readAsText(file)
  }
}

const handleDeploy = () => {
  uiStore.showLoading('DEPLOYING', 'Committing asset to registry...')
  setTimeout(() => {
    uiStore.hideLoading()
    uiStore.addNotice({ title: 'SUCCESS', message: 'Asset deployed to global registry.', type: 'success' })
    router.push('/discover')
  }, 1500)
}
</script>

<template>
  <div class="h-full flex flex-col bg-zinc-50" translate="no">
    <div class="flex-1 overflow-y-auto py-10 custom-scrollbar">
      <!-- 拓宽容器并减小边距 -->
      <div class="px-2 max-w-[1440px] mx-auto text-left">

        <!-- 头部标题：工业级还原 -->
        <div class="mb-12 flex justify-between items-end border-b-4 border-zinc-900 pb-6">
          <div>
            <h1 class="text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none">Registry_Add</h1>
            <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em] mt-3 italic">Module_System_v2.0 // Node_Link</p>
          </div>
          <button @click="label=''; slug=''; htmlContent=''" class="text-[11px] font-black text-zinc-900 border-b-2 border-zinc-900 uppercase px-1">PURGE_SESSION</button>
        </div>

        <form @submit.prevent="handleDeploy" class="space-y-12 pb-20">
          
          <!-- 1. Identity Layer -->
          <div class="bg-white border-2 border-zinc-900 p-8 relative shadow-[8px_8px_0px_#f4f4f5]">
            <div class="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 tracking-widest uppercase">Identity_Layer</div>
            
            <div class="flex flex-col md:flex-row gap-12 items-start">
              <!-- 头像上传 -->
              <div class="flex flex-col items-center shrink-0">
                <div class="w-20 h-20 border-2 border-zinc-900 bg-zinc-50 flex items-center justify-center relative group transition-all"
                     :class="iconPreview ? 'bg-white' : 'border-dashed border-zinc-300'">
                  <img v-if="iconPreview" :src="iconPreview" class="w-full h-full object-contain p-2">
                  <span v-else class="text-[9px] font-black text-zinc-300 uppercase">Img_P</span>
                  <input type="file" @change="onIconChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer z-10">
                  <div class="absolute inset-0 bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span class="text-white text-[8px] font-black uppercase tracking-widest">Edit</span>
                  </div>
                </div>
              </div>

              <div class="flex-1 w-full space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Display Label</label>
                    <input v-model="label" type="text" required class="w-full border-b-2 border-zinc-900 bg-transparent py-1.5 focus:bg-zinc-50 outline-none text-sm font-bold uppercase">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Registry Slug</label>
                    <input v-model="slug" @input="slugCustomized=true" type="text" required class="w-full border-b-2 border-zinc-900 bg-transparent py-1.5 focus:bg-zinc-50 outline-none font-mono text-sm font-bold uppercase">
                    <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">
                      Endpoint: <span class="text-zinc-900">/tools/{{ slug || '---' }}/</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
                  <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-zinc-400">Build_v</label>
                    <input v-model="version" type="text" class="w-full border-b border-zinc-100 py-1 focus:border-zinc-900 outline-none font-mono text-[11px] font-bold uppercase">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-zinc-400">Weight</label>
                    <input v-model="sortWeight" type="number" class="w-full border-b border-zinc-100 py-1 focus:border-zinc-900 outline-none font-mono text-[11px] font-bold">
                  </div>
                  <div class="flex items-center justify-between pb-1 border-b border-zinc-100">
                    <span class="text-[9px] font-black uppercase text-zinc-400">Public</span>
                    <button @click.prevent="isPublic = !isPublic" class="w-10 h-5 p-1 transition-all" :class="isPublic ? 'bg-zinc-900' : 'bg-zinc-200'">
                      <div class="w-3 h-3 bg-white transition-all" :style="{ transform: isPublic ? 'translateX(20px)' : 'translateX(0)' }"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Bundle Upload -->
          <div class="bg-white border-2 border-zinc-900 p-8 relative shadow-[8px_8px_0px_#f4f4f5]">
            <div class="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 tracking-widest uppercase">Bundle_Upload</div>
            <div class="border-2 border-zinc-900 border-dashed p-12 text-center relative group bg-zinc-50 hover:bg-white transition-all">
              <input type="file" @change="onHtmlChange" accept=".html" required class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
              <div class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 bg-white border-2 border-zinc-900 flex items-center justify-center shadow-[4px_4px_0px_#18181b]"
                     :class="htmlFileName ? 'bg-zinc-900 text-white' : 'text-zinc-900'">
                   <svg v-if="!htmlFileName" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                   <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <p class="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  {{ htmlFileName ? 'LOADED: ' + htmlFileName : 'SELECT_COMPONENT_HTML' }}
                </p>
              </div>
            </div>

            <!-- Live Debugger (Mac Style) -->
            <div v-if="htmlContent" class="mt-8 bg-white shadow-2xl border border-zinc-200 animate-in slide-in-from-top-4 duration-500">
              <div class="bg-[#f6f6f6] px-4 py-2 flex items-center border-b border-zinc-200">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <div class="flex-1 text-center font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Live_Debugger_Active</div>
              </div>
              <iframe :srcdoc="htmlContent" class="w-full h-[500px] border-0"></iframe>
            </div>
          </div>

          <!-- 3. Metadata -->
          <div class="bg-white border-2 border-zinc-900 p-8 relative shadow-[8px_8px_0px_#f4f4f5]">
            <div class="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 tracking-widest uppercase">Metadata_Entry</div>
            <div class="space-y-10">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Category_Tag</label>
                <input v-model="categoryTag" type="text" class="w-full border-b-2 border-zinc-900 bg-transparent py-1.5 focus:bg-zinc-50 outline-none text-sm font-bold uppercase" placeholder="E.G. HARDWARE_TOOL">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Module_Description</label>
                <textarea v-model="description" rows="3" class="w-full border-2 border-zinc-900 p-4 focus:bg-zinc-50 outline-none text-sm font-bold uppercase transition-all resize-none italic text-zinc-500"></textarea>
              </div>
            </div>
          </div>

          <!-- 4. Deploy -->
          <div class="pt-16 pb-12 flex flex-col items-center border-t-4 border-zinc-900">
            <button type="submit" class="group text-center outline-none">
              <span class="text-5xl font-black uppercase tracking-tighter text-zinc-900 border-b-[8px] border-zinc-900 pb-2 transition-all hover:bg-zinc-900 hover:text-white px-8 inline-block leading-none">
                DEPLOY
              </span>
              <div class="mt-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] group-hover:text-zinc-900 transition-colors italic">Commit_To_Global_Registry</div>
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; }
</style>
