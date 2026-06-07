<script setup>
/**
 * @description 详情面板技术备注区 (加固版：标准字体)
 */
defineProps({
  remark: String
})
</script>

<template>
  <div class="flex gap-3 items-start border-t border-zinc-50 border-dashed pt-1.5">
    <span class="shrink-0 text-[8px] font-black text-zinc-300 uppercase tracking-widest mt-1">Technical_Note:</span>
    <!-- 优化：去掉斜体，字号调整为 12px -->
    <p 
      class="text-[12px] font-bold leading-relaxed pr-10 transition-colors"
      :class="remark ? 'text-zinc-600' : 'text-zinc-200'"
    >
      {{ remark || 'No additional technical metadata registered for this unit.' }}
    </p>
  </div>
</template>
