<script setup>
/**
 * @description 手动录入协议表单 (修复对齐与状态版)
 */
defineProps({
  form: Object
})
const emit = defineEmits(['submit', 'cancel'])

const SYSTEM_FIELDS = [
  { key: 'category', label: 'Registry Node', placeholder: 'e.g. MCU, IC...', required: true },
  { key: 'model', label: 'MPN_Model', placeholder: 'Manufacturer Part Number', required: true },
  { key: 'package', label: 'Footprint', placeholder: 'e.g. 0805, QFN-32', required: true },
  { key: 'quantity', label: 'Stock_QTY', type: 'number' },
  { key: 'price', label: 'Unit_Cost', placeholder: '0.00' },
  { key: 'supplier', label: 'Manufacturer', placeholder: 'Mfr Name' },
  { key: 'channel', label: 'Supply_Channel', placeholder: 'LCSC, DigiKey...' },
  { key: 'location', label: 'Bin_Loc', placeholder: 'e.g. BOX-A-01' },
  { key: 'unit', label: 'Measurement', placeholder: 'pcs, reel, m...' },
  { key: 'buy_time', label: 'Logged_Timestamp', type: 'datetime-local' }
]
</script>

<template>
  <div class="flex flex-col gap-8 max-w-[800px] mx-auto animate-in fade-in duration-300">
    <div class="grid grid-cols-2 gap-x-8 gap-y-5">
      <!-- 品名 (左对齐) -->
      <div class="col-span-2 flex flex-col gap-1.5">
        <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">
          Full Nomenclature <span class="text-red-500">*</span>
        </label>
        <BaseInput 
          v-model="form.name" 
          placeholder="Registry Entity Name..." 
          required 
          radius="rounded-lg"
          input-class="!bg-zinc-50/50 !border-zinc-100 !text-left !text-[13px] focus:!bg-white focus:!border-zinc-500" 
        />
      </div>

      <!-- 动态字段 (左对齐) -->
      <div v-for="f in SYSTEM_FIELDS" :key="f.key" class="flex flex-col gap-1.5">
        <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">
          {{ f.label }} <span v-if="f.required" class="text-red-500">*</span>
        </label>
        <BaseInput 
          v-model="form[f.key]" 
          :type="f.type || 'text'" 
          :placeholder="f.placeholder"
          :required="f.required"
          radius="rounded-lg"
          input-class="!bg-zinc-50/50 !border-zinc-100 !text-left focus:!bg-white focus:!border-zinc-500" 
        />
      </div>

      <!-- 备注 (左对齐) -->
      <div class="col-span-2 flex flex-col gap-1.5 mt-2">
        <label class="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left ml-1">Technical Remarks</label>
        <textarea 
          v-model="form.remark"
          rows="3" 
          placeholder="Enter technical details, deployment constraints or specialized metadata..."
          class="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-100 rounded-lg text-[12px] text-left outline-none focus:bg-white focus:border-zinc-500 transition-all resize-none font-bold placeholder:text-zinc-200 placeholder:font-normal"
        ></textarea>
      </div>
    </div>

    <!-- 动作栏 (已调用 BaseButton) -->
    <div class="flex justify-center pt-4">
      <BaseButton 
        @click="emit('submit')"
        class="!w-[320px] !py-4"
        shadow="shadow-[6px_6px_0px_#dbeafe]"
      >
        Commit_Single_Node
      </BaseButton>
    </div>
  </div>
</template>
