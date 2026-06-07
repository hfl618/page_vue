<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseInput from '@/components/common/base/BaseInput.vue'
import BaseCodeBlock from '@/components/common/base/BaseCodeBlock.vue'
import BaseJsonTree from '@/components/common/base/BaseJsonTree.vue'

/**
 * @description 模块化调试终端 - 物理加固版
 * 修复了 api 属性缺失导致的渲染崩溃问题
 */
const props = defineProps({
  api: {
    type: Object,
    default: () => ({ security: 'user' })
  },
  meta: Object,
  testInputs: Object,
  resolvedPath: String,
  testResult: Object,
  isTesting: Boolean
})

const emit = defineEmits(['test', 'copy'])

const formatJson = (val) => {
  if (!val) return ''
  return typeof val === 'string' ? val : JSON.stringify(val, null, 2)
}

const isAdminField = (key) => {
  const k = String(key).toLowerCase()
  return k.includes('user_id') || k.includes('target') || k.includes('uid')
}
</script>

<template>
  <section class="pt-8 border-t border-zinc-50 pb-8">
     <!-- 头部控制栏 -->
     <div class="flex items-center justify-between mb-8 bg-zinc-50/30 p-2 border border-zinc-200 rounded-sm">
       <div class="flex items-center gap-4 pl-2">
         <div class="flex flex-col">
           <span class="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em]">Simulation_Terminal</span>
           <div class="flex items-center gap-1.5 mt-0.5">
              <div class="w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
              <span class="text-[7px] font-mono text-zinc-400 uppercase tracking-widest font-black">I/O_Link_Active</span>
           </div>
         </div>
       </div>
       
       <BaseButton 
         variant="custom"
         color-class="bg-amber-400 text-zinc-900 border border-amber-500"
         hover-class="hover:bg-amber-300"
         @click="emit('test')" 
         :loading="isTesting" 
         class="!py-1.5 !px-5 !text-[9px] !w-auto shadow-sm"
       >
         EXECUTE_STIMULUS
       </BaseButton>
     </div>

     <!-- 交互输入矩阵 -->
     <div class="space-y-8 mb-10">
        
        <!-- 管理员上帝视角高亮 (物理加固：增加 props.api 检查) -->
        <div v-if="api && api.security === 'admin'" class="bg-red-50 border border-red-100 p-3 flex items-center justify-between rounded-sm">
           <div class="flex items-center gap-3">
              <span class="text-[10px] text-red-500">🚩</span>
              <span class="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">Admin_Elevated_Context</span>
           </div>
           <span class="text-[7px] font-bold text-red-300 uppercase italic tracking-tighter">Identity Delegation Active</span>
        </div>

        <!-- A. URL Parameters Override -->
        <div v-if="Object.keys(testInputs.params).length > 0" class="space-y-4">
           <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <div class="w-1 h-1 bg-orange-500 rounded-full"></div> URL_Variable_Inject
           </div>
           <div class="grid grid-cols-2 gap-4 bg-white p-4 border border-zinc-100 rounded-sm">
              <div v-for="(val, key) in testInputs.params" :key="key" class="space-y-2">
                 <div class="flex items-center justify-between">
                    <label class="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{{ key }}</label>
                    <span v-if="isAdminField(key)" class="text-[7px] font-black text-orange-500 uppercase tracking-widest">[Target_ID]</span>
                 </div>
                 <BaseInput v-model="testInputs.params[key]" placeholder="VAL..." size="sm" :class="[isAdminField(key) ? '!border-orange-200 !bg-orange-50/10' : '']" class="font-mono" />
              </div>
           </div>
           <BaseCodeBlock label="Resolved_URI_Preview" :code="resolvedPath" active />
        </div>

        <!-- C. Payload Variable Map -->
        <div v-if="Object.keys(testInputs.payload).length > 0" class="space-y-4">
           <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <div class="w-1 h-1 bg-blue-500 rounded-full"></div> Payload_Variable_Map
           </div>
           <div class="grid grid-cols-1 gap-4 bg-zinc-50/30 p-5 border border-zinc-100 rounded-sm">
              <div v-for="(val, key) in testInputs.payload" :key="key" class="flex items-center gap-6 group">
                 <div class="w-36 flex flex-col">
                    <span class="text-[11px] font-black text-zinc-800 font-mono truncate uppercase tracking-tighter">{{ key }}</span>
                    <span v-if="isAdminField(key)" class="text-[7px] font-black text-red-500 uppercase mt-0.5 tracking-widest">Target_Identity</span>
                 </div>
                 <BaseInput v-model="testInputs.payload[key]" placeholder="INJECT_VAL..." size="sm" :class="[isAdminField(key) ? '!border-red-200 !bg-red-50/10' : '']" class="flex-1 !bg-white font-mono" />
              </div>
           </div>
           <!-- Buffer Preview -->
           <div class="space-y-2">
              <span class="text-[8px] font-black text-zinc-300 uppercase tracking-widest ml-1">Live_JSON_Buffer</span>
              <BaseCodeBlock :code="testInputs.body" :show-copy="true" />
           </div>
        </div>
     </div>

     <!-- Simulation Trace Result -->
     <div v-if="testResult" class="mt-12 animate-in slide-in-from-bottom-2 duration-500">
        <div class="bg-zinc-50 px-4 py-2 border border-zinc-100 flex justify-between items-center rounded-t-sm border-b-0">
           <div class="flex items-center gap-4">
             <span :class="testResult.status === 200 || testResult.code === 0 ? 'text-emerald-600' : 'text-red-500'" class="text-[12px] font-black font-mono tracking-tighter italic uppercase">PROTOCOL_STATUS_{{ testResult.status || testResult.code }}</span>
             <div class="h-3 w-px bg-zinc-200"></div>
             <span class="text-[7px] font-mono text-zinc-300 uppercase tracking-widest">Trace_Captured</span>
           </div>
           <button @click="() => emit('copy', formatJson(testResult.data || testResult))" class="text-[7px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase">[ Copy_Result ]</button>
        </div>
        <div class="bg-white border border-zinc-100 p-8 rounded-b-sm shadow-sm">
            <BaseJsonTree :data="testResult.data || testResult" />
        </div>
     </div>
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; }
</style>
