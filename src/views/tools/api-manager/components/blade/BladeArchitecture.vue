<script setup>
import BaseTag from '@/components/common/base/BaseTag.vue'
import BaseCodeBlock from '@/components/common/base/BaseCodeBlock.vue'

const props = defineProps({
  meta: Object
})
</script>

<template>
  <section class="space-y-8">
    <!-- 1. JSON 契约预览 (Markdown 风格) -->
    <div v-if="meta.body || meta.query" class="space-y-3">
       <div class="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-900 flex items-center gap-2">
         <div class="w-2 h-[1px] bg-blue-600"></div> Developer_Contract
       </div>
       <BaseCodeBlock 
         :label="meta.body ? 'Payload_Schema' : 'Query_Contract'" 
         :code="meta.body || meta.query" 
         show-copy 
       />
    </div>

    <!-- 2. 参数规格明细 -->
    <div v-if="meta.params?.length" class="space-y-3">
      <div class="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300 flex items-center gap-2">
         <div class="w-2 h-[1px] bg-zinc-200"></div> Architecture_Specs </div>
      <div class="border border-zinc-50 divide-y divide-zinc-50 rounded-sm">
         <div v-for="param in meta.params" :key="param.name" class="py-2.5 px-1 flex items-center justify-between group/row">
            <div class="flex items-center gap-3">
              <span class="text-[10px] font-black font-mono text-zinc-800 uppercase">/{{ param.name }}</span>
              <span class="text-[8px] text-zinc-300 truncate max-w-[200px]">{{ param.desc }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span v-if="param.required" class="text-[7px] font-bold text-red-400 uppercase">REQ</span>
              <span class="text-[9px] font-black text-zinc-200 font-mono">{{ String(param.type).toUpperCase() }}</span>
            </div>
         </div>
      </div>
    </div>
  </section>
</template>
