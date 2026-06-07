<script setup>
/**
 * @description 知识库索引全量表格弹窗
 */
defineProps({
  show: Boolean,
  dirSearch: String,
  items: Array,
  totalCount: Number,
  currentPage: Number,
  totalPages: Number,
  itemsPerPage: Number,
  visiblePages: Array,
  currentStack: Object,
  selectedIds: { type: Object, default: () => new Set() }
})

defineEmits([
  'close', 
  'update:dirSearch', 
  'update:itemsPerPage',
  'click-item', 
  'go-page',
  'toggle-selection',
  'toggle-all'
])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" @click="$emit('close')" class="fixed inset-0 z-[100000] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-6">
      <div @click.stop class="w-full max-w-5xl bg-white border border-zinc-900 shadow-[8px_8px_0px_#18181b] flex flex-col max-h-[85vh]">
          <div class="p-8 border-b border-zinc-100 flex items-center justify-between gap-10">
              <div class="flex-1 relative text-left">
                  <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none"><svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                  <input 
                    type="text" 
                    :value="dirSearch" 
                    @input="$emit('update:dirSearch', $event.target.value)"
                    placeholder="SEARCH IN STACK..." 
                    class="w-full bg-zinc-50 border border-zinc-100 pl-12 pr-4 py-3 text-[11px] font-black uppercase outline-none focus:border-zinc-900 transition-all"
                  >
              </div>
              <BaseActionLink @click="$emit('close')">
                CLOSE INDEX
              </BaseActionLink>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar">
              <table class="w-full text-left border-collapse">
                  <thead>
                      <tr class="bg-zinc-50 border-b border-zinc-100">
                          <th class="py-4 px-6 w-10 text-center">
                            <input type="checkbox" @change="$emit('toggle-all')" :checked="items.length > 0 && items.every(i => selectedIds.has(i.id))" class="accent-zinc-900">
                          </th>
                          <th class="py-4 px-4 text-[9px] font-black text-zinc-400 uppercase w-16">No.</th>
                          <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase w-1/4">Nomenclature</th>
                          <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase w-1/3">Specifications</th>
                          <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase">Registry Tags</th>
                          <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-50">
                      <tr v-for="(item, index) in items" :key="item.id" 
                          class="group transition-all cursor-pointer hover:bg-zinc-50/50"
                          :class="selectedIds.has(item.id) ? 'bg-zinc-50/80 shadow-[inset_4px_0px_0px_#18181b]' : ''"
                          @click="$emit('toggle-selection', item.id)">
                          <td class="py-4 px-6 text-center" @click.stop="$emit('toggle-selection', item.id)">
                            <input type="checkbox" :checked="selectedIds.has(item.id)" class="accent-zinc-900 cursor-pointer">
                          </td>
                          <td class="py-4 px-4 text-[10px] font-mono font-bold text-zinc-300">{{ String((currentPage - 1) * itemsPerPage + index + 1).padStart(3, '0') }}</td>
                          <td class="py-4 px-8">
                              <div class="flex items-center gap-2">
                                  <span v-if="item.is_collection" class="bg-zinc-900 text-white text-[7px] px-1 font-black shrink-0">STACK</span>
                                  <div class="text-[11px] font-black text-zinc-900 uppercase group-hover:translate-x-1 transition-transform truncate">{{ item.collection_title || item.title }}</div>
                              </div>
                          </td>
                          <td class="py-4 px-8"><div class="text-[9px] text-zinc-400 font-bold italic line-clamp-2 leading-relaxed">{{ item.excerpt || 'No summary.' }}</div></td>
                          <td class="py-4 px-8">
                              <div class="flex flex-wrap gap-1">
                                  <BaseTag v-for="tag in (item.tags ? String(item.tags).split(',') : [])" :key="tag">
                                    {{ tag.trim() }}
                                  </BaseTag>
                              </div>
                          </td>
                          <td class="py-4 px-8 text-right" @click.stop>
                            <BaseActionLink @click="$emit('click-item', item)">
                              {{ item.is_collection ? 'Open Stack' : 'Open Module' }}
                            </BaseActionLink>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>

          <!-- 分页 -->
          <div class="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between px-8">
              <!-- 左侧：总数 -->
              <div class="flex items-center gap-4">
                  <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Total Count: {{ totalCount }}</span>
              </div>
              
              <!-- 中间：翻页 -->
              <div class="flex items-center gap-2">
                  <button @click="$emit('go-page', currentPage - 1)" :disabled="currentPage === 1" class="px-2 py-1 border border-zinc-200 text-[9px] font-black uppercase disabled:opacity-30 hover:bg-zinc-900 hover:text-white transition-all">Prev</button>
                  <div class="flex items-center gap-1">
                      <button v-for="p in visiblePages" :key="p" @click="$emit('go-page', p)" class="w-6 h-6 flex items-center justify-center text-[9px] font-mono font-bold border" :class="p === currentPage ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-100'">{{ p }}</button>
                  </div>
                  <button @click="$emit('go-page', currentPage + 1)" :disabled="currentPage === totalPages" class="px-2 py-1 border border-zinc-200 text-[9px] font-black uppercase disabled:opacity-30 hover:bg-zinc-900 hover:text-white transition-all">Next</button>
              </div>

              <!-- 右侧：页面密度调节 -->
              <div class="flex items-center gap-2">
                  <span class="text-[8px] font-black text-zinc-400 uppercase">Density:</span>
                  <input 
                      type="number" 
                      :value="itemsPerPage"
                      @input="$emit('update:itemsPerPage', Number($event.target.value))"
                      class="w-10 bg-white border border-zinc-200 text-[9px] font-mono font-bold text-center py-0.5 outline-none focus:border-zinc-900 transition-all"
                      min="1"
                      max="100"
                  >
              </div>
          </div>
      </div>
    </div>
  </Teleport>
</template>
