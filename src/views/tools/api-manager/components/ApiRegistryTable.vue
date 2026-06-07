<script setup>
import BaseTable from '@/components/common/base/BaseTable.vue'
import BaseTag from '@/components/common/base/BaseTag.vue'
import BaseSelect from '@/components/common/base/BaseSelect.vue'

/**
 * @description API 注册中心表格组件 (物理加固防御版)
 * 解决了 item 为空导致的运行时错误，并优化了路径高亮显示
 */
defineProps({
  columns: Array,
  items: Array,
  filters: Object,
  options: Object
})

const emit = defineEmits(['row-click', 'filter-change'])

const getMethodConfig = (method) => {
  if (!method) return { bg: 'bg-zinc-100', color: 'text-zinc-400' }
  const m = String(method).toUpperCase()
  if (m === 'GET') return { bg: 'bg-emerald-600', color: 'text-white' }
  if (m === 'POST') return { bg: 'bg-blue-600', color: 'text-white' }
  if (m === 'PUT') return { bg: 'bg-orange-500', color: 'text-white' }
  if (m === 'DELETE') return { bg: 'bg-red-600', color: 'text-white' }
  return { bg: 'bg-zinc-500', color: 'text-white' }
}

const formatPath = (path) => {
  if (!path) return ''
  // 物理转义并高亮
  return String(path)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;([^&]+)&gt;/g, '&lt;<span class="text-orange-500 font-bold">$1</span>&gt;')
}
</script>

<template>
  <div class="h-full border-t border-zinc-50 bg-white flex flex-col overflow-hidden">
    <BaseTable 
      :columns="columns" 
      :items="items" 
      :show-checkbox="false" 
      @row-click="emit('row-click', $event)"
      class="h-full"
    >
      <!-- Protocol 筛选 -->
      <template #filter-method>
        <BaseSelect 
          :model-value="filters.method"
          variant="ghost"
          size="xs"
          @update:model-value="emit('filter-change', { key: 'method', value: $event })"
        >
          <option value="">ALL_METHODS</option>
          <option v-for="opt in options.methods" :key="opt" :value="opt">{{ opt }}</option>
        </BaseSelect>
      </template>

      <!-- Security 筛选 -->
      <template #filter-security>
        <BaseSelect 
          :model-value="filters.security"
          variant="ghost"
          size="xs"
          @update:model-value="emit('filter-change', { key: 'security', value: $event })"
        >
          <option value="">ALL_ACCESS</option>
          <option value="public">PUBLIC</option>
          <option value="user">USER_AUTH</option>
          <option value="admin">ADMIN_ONLY</option>
        </BaseSelect>
      </template>

      <!-- 列渲染 (增加防御性检查) -->
      <template #col-method="{ item }">
        <div v-if="item" class="flex gap-1 justify-center">
          <BaseTag 
            v-for="m in (Array.isArray(item.methods) ? item.methods : (item.method ? [item.method] : []))" 
            :key="m" 
            :bg-class="getMethodConfig(m).bg"
            :color-class="getMethodConfig(m).color"
            border-color-class="border-transparent"
            bold
          >
            {{ m }}
          </BaseTag>
        </div>
      </template>

      <template #col-security="{ item }">
        <div v-if="item" class="flex justify-center">
          <span v-if="item.security === 'public'" class="text-[7px] font-black text-emerald-500 border border-emerald-100 bg-emerald-50/50 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">🌐 Public</span>
          <span v-else-if="item.security === 'admin'" class="text-[7px] font-black text-red-500 border border-red-100 bg-red-50/50 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">🚩 Admin</span>
          <span v-else class="text-[7px] font-black text-blue-500 border border-blue-100 bg-blue-50/50 px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">🔐 Auth</span>
        </div>
      </template>

      <template #col-path="{ item }">
        <code v-if="item" class="text-[11px] font-mono font-bold transition-all" 
              :class="item.isActive ? 'text-zinc-400 group-hover:text-zinc-900' : 'text-zinc-200 line-through opacity-50'" 
              v-html="formatPath(item.path)"></code>
      </template>

      <template #col-title="{ item }">
        <span v-if="item" class="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-600 uppercase tracking-tight transition-colors">
          {{ item.title }}
        </span>
      </template>

      <template #col-isActive="{ item }">
        <div v-if="item" class="flex items-center justify-end gap-3 px-4">
           <span class="text-[8px] font-black uppercase tracking-tighter" :class="item.isActive ? 'text-emerald-500' : 'text-red-400'">
             {{ item.isActive ? 'Operational' : 'Locked' }}
           </span>
           <div class="w-1.5 h-1.5 rounded-full" :class="item.isActive ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-red-400'"></div>
        </div>
      </template>
    </BaseTable>
  </div>
</template>
