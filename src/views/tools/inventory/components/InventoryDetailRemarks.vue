<script setup>
/**
 * @description 详情面板技术备注区
 */
defineProps({
  remark: String
})
</script>

<template>
  <div v-if="remark" class="mt-0 pt-2 flex gap-3 items-start">
    <span class="shrink-0 text-[8px] font-black text-zinc-300 uppercase tracking-widest mt-1">Remark:</span>
    <p class="text-[11px] text-zinc-500 font-bold leading-tight italic pr-10">{{ remark }}</p>
  </div>
</template>
