<script setup>
import { formatCurrency, getAssetUrl } from '@/utils/format'

/**
 * @description 库存管理数据表格封装 (物理原名版)
 * 职责：严格对齐数据库字段：quantity, model, supplier, location, img_path...
 * 废除一切别名。
 */
defineProps({
  columns: Array,
  items: Array,
  selectedItems: Array,
  allSelected: Boolean,
  sortKey: String,
  sortOrder: String
})

const emit = defineEmits(['toggle-all', 'toggle-select', 'edit', 'adjust-stock', 'sort'])
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0 border-t border-zinc-100">
    <BaseTable 
      :columns="columns" 
      :items="items"
      :selected-items="selectedItems"
      :all-selected="allSelected"
      :sort-key="sortKey"
      :sort-order="sortOrder"
      radius="rounded-none"
      @toggle-all="emit('toggle-all')"
      @toggle-select="(item) => emit('toggle-select', item)"
      @row-click="(item) => emit('toggle-select', item)"
      @sort="(val) => emit('sort', val)"
    >
      <!-- 1. 图片列 (Key: img_path) -->
      <template #col-img_path="{ item }">
        <div class="flex justify-center">
          <BaseImagePreview :src="getAssetUrl(item.img_path)" mode="modal" size="w-8 h-8" radius="rounded-md" :alt="item.name" />
        </div>
      </template>

      <!-- 2. 分类列 (Key: category) -->
      <template #col-category="{ item }">
        <span class="px-2 py-0.5 bg-zinc-50 text-zinc-500 text-[9px] font-black uppercase tracking-widest rounded-sm border border-zinc-100">{{ item.category }}</span>
      </template>

      <!-- 3. 品名列 (Key: name) -->
      <template #col-name="{ item }">
        <div class="flex items-center gap-1.5 group/name text-left">
          <div class="truncate text-zinc-900 font-black uppercase text-[12px] tracking-tight">{{ item.name }}</div>
          <!-- 图标显隐 (基于物理字段 doc_path) -->
          <svg v-if="item.hasFile || item.doc_path" class="w-3.5 h-3.5 text-zinc-300 transition-all cursor-help hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </template>

      <!-- 4. 型号列 (Key: model) -->
      <template #col-model="{ item }">
        <div class="flex flex-col gap-0.5 text-left leading-none">
          <span class="text-blue-900 font-mono font-black uppercase text-[10px]">{{ item.model || '--' }}</span>
          <span class="text-zinc-900 text-[8px] uppercase tracking-[0.2em] font-black">{{ item.package || '--' }}</span>
        </div>
      </template>

      <!-- 5. 库存列 (Key: quantity) -->
      <template #col-quantity="{ item }">
        <span 
          :class="[
            'font-mono font-black px-1.5 py-0.5 rounded transition-colors text-[11px]',
            (parseInt(item.quantity) || 0) < 10 
              ? 'text-red-600 bg-red-50' 
              : ((parseInt(item.quantity) || 0) < 50 ? 'text-amber-600 bg-amber-50' : 'text-zinc-600')
          ]"
        >
          {{ item.quantity ?? 0 }}
        </span>
      </template>

      <!-- 6. 价格列 (Key: price) -->
      <template #col-price="{ item }">
        <div class="flex flex-col leading-none">
          <span class="text-zinc-900 font-mono font-black text-[11px]">{{ formatCurrency(item.price) }}</span>
          <span class="text-[8px] text-zinc-300 font-black uppercase tracking-tighter">Per {{ item.unit }}</span>
        </div>
      </template>

      <!-- 7. 库位列 (Key: location) -->
      <template #col-location="{ item }">
        <span class="text-zinc-400 font-mono font-black text-[10px] uppercase italic text-left">{{ item.location || '--' }}</span>
      </template>

      <!-- 8. 厂商列 (Key: supplier) -->
      <template #col-supplier="{ item }">
        <div class="flex flex-col text-left leading-none">
          <span class="text-zinc-600 font-black uppercase text-[9px] tracking-tight">{{ item.supplier }}</span>
          <span class="text-zinc-300 font-bold text-[8px] italic">Via {{ item.channel }}</span>
        </div>
      </template>

      <!-- 9. 操作列 -->
      <template #col-actions="{ item }">
        <div class="flex items-center justify-center gap-1" @click.stop>
          <!-- 二维码预览：优先使用云端 qrcode_path，无则动态生成本地预览 -->
          <BaseImagePreview 
            :src="getAssetUrl(item.qrcode_path) || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NODE_ID:${item.id}|MODEL:${item.model}`" 
            mode="popup" 
            lens-position="left"
            :alt="`QR_#${item.id}`"
          >
            <template #trigger>
              <BaseIconButton 
                variant="ghost" 
                size="w-7 h-7" 
                radius="rounded-md" 
                :class="{ 'text-emerald-500 bg-emerald-50/60': item.qrcode_path }"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-3m6 0h3m-3 6h3m-9 8h.01M3 16h3m10-13h3m-13 13h3m-3-9h3m13 0h3" stroke-linecap="round"/>
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="15" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="15" width="6" height="6" rx="1" />
                </svg>
              </BaseIconButton>
            </template>
          </BaseImagePreview>

          <BaseIconButton variant="ghost" size="w-7 h-7" radius="rounded-md" @click="emit('edit', item)">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </BaseIconButton>

          <BaseIconButton variant="ghost" size="w-7 h-7" radius="rounded-md" @click="emit('adjust-stock', item.id, 1)">
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
