<script setup>
/**
 * @description 库存管理数据表格封装 (全复用原子组件版)
 */
defineProps({
  columns: Array,
  items: Array,
  selectedItems: Array,
  allSelected: Boolean
})

const emit = defineEmits(['toggle-all', 'toggle-select', 'edit', 'adjust-stock'])
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 border-t border-zinc-100">
    <BaseTable 
      :columns="columns" 
      :items="items"
      :selected-items="selectedItems"
      :all-selected="allSelected"
      radius="rounded-none"
      @toggle-all="emit('toggle-all')"
      @toggle-select="(item) => emit('toggle-select', item)"
      @row-click="(item) => emit('toggle-select', item)"
    >
      <!-- 1. 图片列 -->
      <template #col-img="{ item }">
        <div class="flex justify-center">
          <BaseImagePreview :src="item.img" mode="modal" size="w-8 h-8" radius="rounded-md" />
        </div>
      </template>

      <!-- 2. 分类列 -->
      <template #col-category="{ item }">
        <span class="px-2 py-0.5 bg-zinc-50 text-zinc-500 text-[9px] uppercase tracking-tighter rounded-sm border border-zinc-100">{{ item.category }}</span>
      </template>

      <!-- 3. 品名列 -->
      <template #col-name="{ item }">
        <div class="flex items-center gap-1.5 group/name">
          <div class="truncate text-zinc-900 font-black uppercase text-[12px]">{{ item.name }}</div>
          <svg v-if="item.hasFile" class="w-3.5 h-3.5 text-zinc-300 transition-all cursor-help hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </template>

      <template #col-mpn="{ item }">
        <div class="flex flex-col gap-0.5">
          <span class="text-zinc-500 font-mono text-[10px]">{{ item.mpn || '--' }}</span>
          <span class="text-zinc-300 text-[8px] uppercase tracking-widest">{{ item.package || '--' }}</span>
        </div>
      </template>

      <!-- 5. 库存列 -->
      <template #col-stock="{ item }">
        <span 
          :class="[
            'font-mono px-1.5 py-0.5 rounded transition-colors',
            item.stock < 10 
              ? 'text-red-600 bg-red-50 font-black' 
              : (item.stock < 50 ? 'text-amber-600 bg-amber-50 font-bold' : 'text-zinc-600')
          ]"
        >
          {{ item.stock }}
        </span>
      </template>

      <template #col-price="{ item }">
        <div class="flex flex-col">
          <span class="text-zinc-900">{{ item.price }}</span>
          <span class="text-[8px] text-zinc-300 uppercase">Per {{ item.unit }}</span>
        </div>
      </template>

      <template #col-bin="{ item }">
        <span class="text-zinc-400 font-mono text-[10px] italic">{{ item.bin || '--' }}</span>
      </template>

      <template #col-mfr="{ item }">
        <div class="flex flex-col">
          <span class="text-zinc-600 uppercase text-[9px] tracking-tight">{{ item.mfr }}</span>
          <span class="text-zinc-300 text-[8px] italic">Via {{ item.channel }}</span>
        </div>
      </template>

      <!-- 4. 操作列 (全面复用 BaseIconButton) -->
      <template #col-actions="{ item }">
        <div class="flex items-center justify-center gap-1" @click.stop>
          <!-- 二维码 -->
          <BaseImagePreview 
            v-if="item.qrCode"
            :src="item.qrCode" 
            mode="popup" 
            lens-position="left" 
          >
            <template #trigger>
              <BaseIconButton variant="ghost" size="w-7 h-7" radius="rounded-md" title="Preview QR">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-3m6 0h3m-3 6h3m-9 8h.01M3 16h3m10-13h3m-13 13h3m-3-9h3m13 0h3" stroke-linecap="round"/>
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="15" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="15" width="6" height="6" rx="1" />
                </svg>
              </BaseIconButton>
            </template>
          </BaseImagePreview>

          <!-- 编辑 -->
          <BaseIconButton 
            variant="ghost" 
            size="w-7 h-7" 
            radius="rounded-md" 
            title="Edit Item"
            @click="emit('edit', item)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </BaseIconButton>

          <!-- 快速加库 -->
          <BaseIconButton 
            variant="ghost" 
            size="w-7 h-7" 
            radius="rounded-md" 
            title="Add Stock"
            @click="emit('adjust-stock', item.id, 1)"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 4v16m8-8H4"/></svg>
          </BaseIconButton>
        </div>
      </template>

      <template #empty>
        <div class="py-24 flex flex-col items-center justify-center opacity-40">
          <svg class="w-10 h-10 mb-4 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>
          <p class="font-black text-[10px] tracking-[0.5em] uppercase text-zinc-400">Registry Is Empty</p>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
