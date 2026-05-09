<script setup>
/**
 * @description 库存管理高级筛选面板 (极致紧凑版)
 */
defineProps({
  show: Boolean,
  filters: Object
})
</script>

<template>
  <Transition
    @enter="(el) => el.style.height = el.scrollHeight + 'px'"
    @before-leave="(el) => el.style.height = el.scrollHeight + 'px'"
    @leave="(el) => el.style.height = '0'"
  >
    <div v-show="show" class="overflow-hidden transition-all duration-300 ease-in-out">
      <div class="bg-zinc-50 border border-zinc-100 p-3 rounded-0 shadow-inner">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <!-- 矩阵输入框组 (减小尺寸与间距) -->
          <div v-for="(val, key) in {
            nomenclature: 'Nomenclature',
            category: 'Registry',
            mpn: 'MPN Code',
            package: 'Footprint',
            bin: 'Bin Loc',
            mfr: 'Mfr Vendor'
          }" :key="key" class="flex flex-col gap-0.5">
            <label class="text-[7px] font-black text-zinc-400 uppercase tracking-tighter">{{ val }}</label>
            <input 
              v-model="filters[key]" 
              type="text" 
              class="w-full bg-white border border-zinc-200 px-2 py-1 text-[10px] font-bold text-zinc-900 focus:border-zinc-900 outline-none uppercase shadow-sm transition-colors"
            >
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
