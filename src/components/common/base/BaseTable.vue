<script setup>
/**
 * @description 通用工业级数据表格组件 (支持全屏拉伸版)
 * 采用无状态设计，仅负责展示和基础事件分发。
 */
const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  selectedItems: {
    type: Array,
    default: () => []
  },
  allSelected: {
    type: Boolean,
    default: false
  },
  showCheckbox: {
    type: Boolean,
    default: true
  },
  radius: {
    type: String,
    default: 'rounded-none'
  }
})

const emit = defineEmits(['toggle-all', 'toggle-select', 'row-click'])

const isSelected = (item) => {
  return props.selectedItems.some(i => i.id === item.id)
}
</script>

<template>
  <!-- 优化：增加 flex-1 和 flex flex-col，确保能够占满父容器高度 -->
  <div :class="['bg-white overflow-hidden flex-1 flex flex-col', radius]">
    <div class="flex-1 overflow-auto custom-scrollbar">
      <table class="w-full text-left border-collapse table-fixed">
        <thead>
          <tr class="border-b border-zinc-50 font-black text-[9px] text-zinc-400 uppercase tracking-widest sticky top-0 bg-white z-10">
            <!-- 复选框列 -->
            <th v-if="showCheckbox" class="py-2 w-[40px] text-center">
              <div class="flex justify-center">
                <BaseCheckbox 
                  :model-value="allSelected" 
                  @change="emit('toggle-all')"
                  size="sm"
                  radius="rounded-sm"
                />
              </div>
            </th>
            
            <!-- 动态列表头 -->
            <th 
              v-for="col in columns" 
              :key="col.key" 
              :class="[
                'py-2 px-4',
                col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left')
              ]"
              :style="{ width: col.width }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        
        <tbody class="text-[11px] font-bold text-zinc-600">
          <slot name="body">
            <tr 
              v-for="item in items" 
              :key="item.id"
              @click="emit('row-click', item, $event)"
              :class="[isSelected(item) ? 'bg-zinc-50' : 'hover:bg-zinc-50/50']"
              class="border-b border-zinc-50 transition-all cursor-pointer group"
            >
              <td v-if="showCheckbox" class="py-1.5 text-center" @click.stop>
                <div class="flex justify-center">
                  <BaseCheckbox 
                    :model-value="isSelected(item)" 
                    @change="emit('toggle-select', item)"
                    size="sm"
                    radius="rounded-sm"
                  />
                </div>
              </td>
              
              <td 
                v-for="col in columns" 
                :key="col.key"
                :class="[
                  'py-1.5 px-4',
                  col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left')
                ]"
              >
                <slot :name="`col-${col.key}`" :item="item">
                  {{ item[col.key] }}
                </slot>
              </td>
            </tr>
          </slot>
          
          <!-- 空状态 -->
          <tr v-if="items.length === 0">
            <td :colspan="columns.length + (showCheckbox ? 1 : 0)" class="py-20 text-center">
              <slot name="empty">
                <div class="flex flex-col items-center justify-center opacity-20">
                   <svg class="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>
                   <p class="text-[10px] font-black uppercase tracking-[0.5em] italic">Zero Nodes Detected</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
