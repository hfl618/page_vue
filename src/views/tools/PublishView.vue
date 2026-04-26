<script setup>
/**
 * @description 资产发布页面 (Tools Deploy)
 * 逻辑解耦版：业务逻辑见 hooks/usePublish.js
 */
const { 
  form, slugCustomized, iconPreview, htmlFileName, htmlContent, 
  onIconChange, onHtmlChange, handleDeploy, purgeSession 
} = usePublish()
</script>

<template>
  <div class="h-full flex flex-col bg-zinc-50" translate="no">
    <div class="flex-1 overflow-y-auto py-10 custom-scrollbar text-left">
      <div class="px-6 max-w-[1440px] mx-auto">

        <!-- 头部标题 -->
        <header class="mb-12 flex justify-between items-end border-b-4 border-zinc-900 pb-6">
          <div>
            <h1 class="text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none">Registry_Add</h1>
            <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.4em] mt-3 italic">Module_System_v2.0 // Node_Link</p>
          </div>
          <BaseActionLink @click="purgeSession">PURGE_SESSION</BaseActionLink>
        </header>

        <form @submit.prevent="handleDeploy" class="space-y-12 pb-20">
          
          <!-- 1. Identity Layer -->
          <div class="bg-white border-2 border-zinc-900 p-8 relative shadow-[8px_8px_0px_#f4f4f5]">
            <div class="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 tracking-widest uppercase">Identity_Layer</div>
            
            <div class="flex flex-col md:flex-row gap-12 items-start">
              <!-- 图标预览与上传 -->
              <!-- ... (此处保持不变) ... -->
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
                    <BaseInput v-model="form.label" placeholder="MODULE NAME..." required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Registry Slug</label>
                    <BaseInput v-model="form.slug" @input="slugCustomized=true" placeholder="ENDPOINT-NAME..." required class="font-mono" />
                    <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">
                      Endpoint: <span class="text-zinc-900">/tools/{{ form.slug || '---' }}/</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end">
                  <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-zinc-400">Build_v</label>
                    <BaseInput v-model="form.version" class="text-[11px] font-mono" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[9px] font-black uppercase text-zinc-400">Weight</label>
                    <BaseInput v-model="form.sortWeight" type="number" class="text-[11px] font-mono" />
                  </div>
                  <div class="flex items-center gap-4 pb-1 border-b border-zinc-100">
                    <span class="text-[9px] font-black uppercase text-zinc-400">Public</span>
                    <PhysicalSwitch v-model="form.isPublic" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Bundle Upload -->
          <!-- ... (保持不变) ... -->
          <div class="bg-white border-2 border-zinc-900 p-8 relative shadow-[8px_8px_0px_#f4f4f5]">
            <div class="absolute -top-3 left-6 bg-zinc-900 text-white text-[8px] font-black px-2 py-0.5 tracking-widest uppercase">Bundle_Upload</div>
            
            <BaseFileUpload 
              accept=".html" 
              label="SELECT_COMPONENT_HTML" 
              :file-name="htmlFileName" 
              @change="onHtmlChange" 
            />

            <!-- Live Debugger -->
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
                <BaseInput v-model="form.categoryTag" placeholder="E.G. HARDWARE_TOOL" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Module_Description</label>
                <BaseTextarea v-model="form.description" :rows="3" class="!border-2 !border-zinc-900 !bg-white" />
              </div>
            </div>
          </div>

          <!-- 4. Deploy Action -->
          <div class="pt-16 pb-12 flex justify-center border-t-4 border-zinc-900">
            <BaseButton 
              type="submit" 
              class="w-auto px-20 py-4"
            >
              <span class="text-lg font-black uppercase tracking-[0.3em]">Deploy Module</span>
            </BaseButton>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>
