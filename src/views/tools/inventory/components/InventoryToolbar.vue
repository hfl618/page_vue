<script setup>
import InventoryAdvancedFilter from './InventoryAdvancedFilter.vue'
import { useUiStore } from '@/store/ui'

/**
 * @description 库存管理工具栏 (回归极简版)
 */
const props = defineProps({
  searchQuery: String,
  isSyncing: Boolean,
  showAdvancedSearch: Boolean,
  advancedFilters: Object
})

const emit = defineEmits([
  'update:searchQuery', 
  'update:showAdvancedSearch',
  'add',
  'outbound'
])

const uiStore = useUiStore()

const toggleCurrency = () => {
  const next = uiStore.settings.currencySymbol === '￥' ? '$' : '￥'
  uiStore.setCurrencySymbol(next)
}
</script>

<template>
  <div class="px-6 py-3 flex flex-col bg-white relative z-30 border-b border-zinc-100" translate="no">
    <div class="flex flex-row items-center justify-between">
      
      <div class="flex items-center gap-3">
        <!-- 搜索 -->
        <div class="w-80">
          <BaseInput 
            :model-value="searchQuery"
            @update:model-value="emit('update:searchQuery', $event)"
            placeholder="Search items or scan QR..."
            input-class="!py-1.5 !px-10 !border-zinc-200 !bg-zinc-50/50 focus:!bg-white !rounded-lg"
          >
            <template #suffix>
              <svg class="w-4 h-4 text-zinc-400 absolute left-3.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </template>
          </BaseInput>
        </div>
        
        <!-- 二维码 -->
        <BaseIconButton @click="emit('add')" size="w-7 h-7" border-style="dashed" title="Scan QR">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /></svg>
        </BaseIconButton>

        <!-- 筛选 -->
        <BaseIconButton @click="emit('update:showAdvancedSearch', !showAdvancedSearch)" :active="showAdvancedSearch" size="w-7 h-7" border-style="dashed">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap='round' stroke-linejoin='round' d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H7.5"/></svg>
        </BaseIconButton>

        <!-- 货币 -->
        <BaseIconButton @click="toggleCurrency" size="w-7 h-7" border-style="dashed">
          <span class="text-[11px] font-black">{{ uiStore.settings.currencySymbol }}</span>
        </BaseIconButton>

        <!-- 同步中 -->
        <div v-if="isSyncing" class="ml-2 flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
        </div>
      </div>

      <!-- 右侧核心动作 -->
      <div class="flex items-center gap-6">
        <BaseActionLink @click="emit('add')" color-class="text-emerald-600" bold>+ New Unit</BaseActionLink>
        <BaseActionLink @click="emit('outbound')" color-class="text-orange-600" bold>Outbound</BaseActionLink>
      </div>
    </div>

    <InventoryAdvancedFilter :show="showAdvancedSearch" :filters="advancedFilters" />
  </div>
</template>
