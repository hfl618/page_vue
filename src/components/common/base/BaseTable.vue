<script setup>
/**
 * @description 通用工业级数据表格组件 (支持三态排序与全屏拉伸版)
 * 采用无状态设计，仅负责展示和基础事件分发。
 */
const props = defineProps({
  columns: {
    type: Array,
    required: true
    // 格式: { key: string, label: string, width?: string, align?: 'left'|'center'|'right', sortable?: boolean }
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
  },
  // 当前排序字段
  sortKey: { type: String, default: '' },
  // 当前排序方向: 'asc' | 'desc' | ''
  sortOrder: { type: String, default: '' }
})

const emit = defineEmits(['toggle-all', 'toggle-select', 'row-click', 'sort'])

const isSelected = (item) => {
  return props.selectedItems.some(i => i.id === item.id)
}

/**
 * 处理表头点击排序 (实现：取消 -> 升序 -> 降序 -> 取消)
 */
const handleSort = (col) => {
  if (!col.sortable) return
  
  let newKey = col.key
  let newOrder = 'asc'
  
  if (props.sortKey === col.key) {
    if (props.sortOrder === 'asc') {
      newOrder = 'desc'
    } else if (props.sortOrder === 'desc') {
      newKey = ''
      newOrder = ''
    } else {
      newOrder = 'asc'
    }
  }
  
  emit('sort', { key: newKey, order: newOrder })
}
</script>

<template>
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
                'py-2 px-4 select-none group/th relative',
                col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left'),
                col.sortable ? 'cursor-pointer hover:bg-zinc-50 transition-colors' : ''
              ]"
              :style="{ width: col.width }"
              @click="handleSort(col)"
            >
              <div :class="['flex items-center gap-1.5', col.align === 'center' ? 'justify-center' : (col.align === 'right' ? 'justify-end' : '')]">
                <span>{{ col.label }}</span>
                
                <!-- 排序图标 -->
                <div v-if="col.sortable" class="flex flex-col items-center ml-1">
                  <svg 
                    class="w-2.5 h-2.5 transition-colors translate-y-[1px]" 
                    :class="[sortKey === col.key && sortOrder === 'asc' ? 'text-zinc-900' : 'text-zinc-200 group-hover/th:text-zinc-300']"
                    fill="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M12 4l-8 8h16z" />
                  </svg>
                  <svg 
                    class="w-2.5 h-2.5 transition-colors -translate-y-[1px]" 
                    :class="[sortKey === col.key && sortOrder === 'desc' ? 'text-zinc-900' : 'text-zinc-200 group-hover/th:text-zinc-300']"
                    fill="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M12 20l8-8H4z" />
                  </svg>
                </div>

                <!-- 筛选插槽 (新增) -->
                <div @click.stop class="flex items-center ml-auto">
                  <slot :name="`filter-${col.key}`" :column="col"></slot>
                </div>
              </div>
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
