<script setup>
/**
 * @description 详情面板参数矩阵 (高密度显示)
 */
defineProps({
  item: { type: Object, required: true },
  specs: { type: Array, required: true }
})
</script>

<template>
  <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-y-1 gap-x-4 py-2 border-y border-zinc-50 border-dashed">
    <!-- 动态基础属性 -->
    <div v-for="spec in specs" :key="spec.label" class="flex flex-col">
      <span class="text-[8px] font-black text-zinc-300 uppercase tracking-tighter">{{ spec.label }}</span>
      <span class="text-[11px] font-bold text-zinc-700 uppercase font-mono leading-none truncate">{{ spec.value }}</span>
    </div>
    
    <!-- 厂商属性 -->
    <div class="flex flex-col">
      <span class="text-[8px] font-black text-zinc-300 uppercase tracking-tighter">Manufacturer</span>
      <span class="text-[10px] font-black text-zinc-900 uppercase leading-none">{{ item.mfr }}</span>
    </div>

    <!-- 渠道属性 -->
    <div class="flex flex-col">
      <span class="text-[8px] font-black text-zinc-300 uppercase tracking-tighter">Channel</span>
      <span class="text-[11px] font-bold text-zinc-700 uppercase font-mono leading-none">{{ item.channel || 'DIRECT' }}</span>
    </div>

    <!-- 登记日期 -->
    <div class="flex flex-col">
      <span class="text-[8px] font-black text-zinc-300 uppercase tracking-tighter">Date</span>
      <span class="text-[11px] font-bold text-zinc-700 uppercase font-mono leading-none">{{ item.date || '--' }}</span>
    </div>
  </div>
</template>
