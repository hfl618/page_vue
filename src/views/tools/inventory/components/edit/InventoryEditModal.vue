<script setup>
import { onUnmounted, watch } from 'vue'

/**
 * @description 元器件新增/编辑弹窗 (工业级规格还原版)
 */
const props = defineProps({
  show: Boolean,
  mode: String, // 'add' | 'edit'
  form: Object
})

const emit = defineEmits(['close', 'submit'])

// 全局 Esc 支持
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) emit('close')
}

watch(() => props.show, (val) => {
  if (val) window.addEventListener('keydown', handleEsc)
  else window.removeEventListener('keydown', handleEsc)
})

onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-slide">
      <div v-if="show" class="fixed inset-0 z-[100000] flex items-center justify-center p-6 translate-no">
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" @click="emit('close')"></div>
        
        <!-- 主容器 (还原规格：rounded-none 或大圆角取决于风格，此处采用平衡版) -->
        <div class="bg-white w-full max-w-[900px] rounded-none shadow-2xl relative z-10 overflow-hidden border border-zinc-900 flex flex-col max-h-[95vh]">
          
          <!-- 1. 头部 -->
          <div class="px-10 py-6 border-b border-zinc-900 flex items-center justify-between bg-white">
            <div class="flex flex-col">
               <div class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">Registry Protocol</div>
               <div class="text-[20px] font-black tracking-tighter uppercase text-zinc-900 leading-none">
                 {{ mode === 'add' ? 'Add New Physical Unit' : 'Edit Technical Profile' }}
               </div>
            </div>
            <BaseIconButton variant="ghost" size="w-8 h-8" @click="emit('close')">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </BaseIconButton>
          </div>

          <!-- 2. 表单区 (还原规格：px-10 py-6 grid grid-cols-2) -->
          <div class="flex-1 overflow-y-auto custom-scrollbar px-10 py-8 bg-white">
            <div class="grid grid-cols-2 gap-x-8 gap-y-5 text-center">
              
              <!-- 全宽字段：品名 -->
              <div class="col-span-2 flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Full Nomenclature *</label>
                <BaseInput v-model="form.name" placeholder="e.g. ESP32 WiFi Module" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center !text-[13px] focus:!bg-white" />
              </div>

              <!-- 双列字段组 -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Registry Category</label>
                <BaseInput v-model="form.category" placeholder="MCU, IC, RES..." input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Model / MPN</label>
                <BaseInput v-model="form.model" placeholder="Manufacturer Part Number" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Physical Package</label>
                <BaseInput v-model="form.package" placeholder="e.g. 0805, QFN-32" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Current Stock</label>
                <BaseInput v-model.number="form.quantity" type="number" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Unit Price</label>
                <BaseInput v-model="form.price" placeholder="0.00" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Vendor / Mfr</label>
                <BaseInput v-model="form.supplier" placeholder="Manufacturer Name" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Supply Channel</label>
                <BaseInput v-model="form.channel" placeholder="e.g. LCSC, DigiKey" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Bin Location</label>
                <BaseInput v-model="form.location" placeholder="e.g. BOX-A-01" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Unit Label</label>
                <BaseInput v-model="form.unit" placeholder="pcs, reel, m..." input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Logged Date</label>
                <BaseInput v-model="form.buy_time" type="date" input-class="!bg-zinc-50/50 !border-zinc-100 !text-center focus:!bg-white" />
              </div>

              <!-- 全宽字段：备注 -->
              <div class="col-span-2 flex flex-col gap-1.5 mt-2">
                <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Technical Remarks</label>
                <textarea 
                  v-model="form.remark"
                  rows="3" 
                  placeholder="Enter specialized metadata or deployment notes..."
                  class="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-100 rounded-none text-[12px] text-center outline-none focus:bg-white focus:border-zinc-900 transition-all resize-none font-bold"
                ></textarea>
              </div>

              <!-- 底部附件上传 (样式占位) -->
              <div class="col-span-2 grid grid-cols-2 gap-6 pt-6 border-t border-zinc-50 mt-2">
                <div class="flex flex-col gap-1">
                  <label class="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Image Manifest</label>
                  <input type="file" class="text-[10px] text-zinc-400 file:bg-zinc-900 file:text-white file:border-none file:px-3 file:py-1 file:text-[9px] file:font-black file:uppercase cursor-pointer">
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[8px] font-black text-zinc-300 uppercase tracking-widest">PDF Datasheet</label>
                  <input type="file" class="text-[10px] text-zinc-400 file:bg-zinc-900 file:text-white file:border-none file:px-3 file:py-1 file:text-[9px] file:font-black file:uppercase cursor-pointer">
                </div>
              </div>
            </div>
          </div>

          <!-- 3. 底部操作栏 -->
          <div class="px-10 py-5 bg-zinc-50 border-t border-zinc-900 flex justify-center gap-6">
            <BaseActionLink @click="emit('close')" class="text-[12px]">Cancel_Request</BaseActionLink>
            <button 
              @click="emit('submit')"
              class="bg-zinc-900 text-white px-20 py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-[6px_6px_0px_#dbeafe] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              Commit To Cloud Registry
            </button>
          </div>
          
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(30px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(30px); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }
</style>
