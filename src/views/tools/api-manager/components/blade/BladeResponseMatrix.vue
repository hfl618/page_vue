<script setup>
import BaseTag from '@/components/common/base/BaseTag.vue'
import BaseJsonTree from '@/components/common/base/BaseJsonTree.vue'

const props = defineProps({
  meta: Object
})
</script>

<template>
  <section v-if="meta.responses">
     <div class="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4 flex items-center gap-2">
       <div class="w-2 h-[1px] bg-zinc-200"></div> Feedback_Matrix </div>
     <div class="space-y-6">
       <div v-for="(example, code) in meta.responses" :key="code" class="space-y-2">
         <span class="text-[7px] font-black px-1.5 py-0.5 bg-zinc-50 text-zinc-400 rounded-sm border border-zinc-100">STATUS_{{ code }}</span>
         <div class="bg-zinc-50/30 border border-zinc-50 p-4 rounded-sm">
            <BaseJsonTree :data="example" />
         </div>
       </div>
     </div>
  </section>
</template>
