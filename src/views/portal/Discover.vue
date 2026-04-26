<script setup>
/**
 * @description 发现页（工具/发现中心）
 * 逻辑解耦版：业务逻辑见 hooks/useDiscover.js
 */
const { 
  activeCategory, navCategories, showConfigModal, allPool, tempNav,
  filteredTools, init, setCategory, toggleTempNav, applyNav
} = useDiscover()

onMounted(() => init())
</script>

<template>
  <div class="h-full flex flex-col relative bg-[#fafafa]" translate="no">
    <!-- 主滚动容器 -->
    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div class="max-w-[1600px] mx-auto">
        
        <!-- 头部：Utility Archive 标题区 -->
        <div class="flex items-end justify-between mb-10 flex-wrap gap-10">
          <div class="max-w-xl text-left">
            <h1 class="text-[28px] font-bold text-zinc-900 tracking-tight uppercase leading-none">Utility Archive</h1>
            <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-3 italic">System Core & Community Deployments</p>
          </div>

          <!-- 分类筛选区 -->
          <div class="flex items-center gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <button 
                v-for="cat in navCategories" 
                :key="cat"
                @click="setCategory(cat)"
                class="px-3 py-1.5 border-2 text-[11px] font-black uppercase transition-all duration-200 whitespace-nowrap outline-none rounded-0"
                :class="activeCategory === cat ? 'bg-white border-zinc-900 text-zinc-900 shadow-[2px_2px_0px_#f4f4f5] -translate-y-0.5' : 'border-transparent text-zinc-400 hover:text-zinc-900'"
              >
                {{ cat }}
              </button>
            </div>
            
            <div class="h-6 w-px bg-zinc-200 mx-0.5"></div>
            
            <!-- 配置按钮 -->
            <button @click="showConfigModal = true" class="w-8 h-8 flex items-center justify-center border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 transition-all rounded-0" title="Registry Config">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.756 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.756 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.756 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.756 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.756 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.756 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.756 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>

            <div class="h-6 w-px bg-zinc-200 mx-0.5"></div>

            <router-link to="/tools/publish" class="text-[11px] font-black text-zinc-900 border-b-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all px-2 py-0.5 tracking-widest uppercase">
              + DEPLOY_ASSET
            </router-link>
          </div>
        </div>

        <!-- 工具网格 -->
        <transition-group 
          tag="div" 
          name="list"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          <ToolCard 
            v-for="tool in filteredTools" 
            :key="tool.name"
            v-bind="tool"
          />
        </transition-group>

        <!-- 空状态提示 -->
        <div v-if="filteredTools.length === 0" class="py-20 text-center">
          <p class="text-zinc-400 text-[11px] font-black uppercase tracking-widest italic">No matching protocols found in archive.</p>
        </div>

      </div>
    </div>

    <!-- Registry Config 弹窗 -->
    <Transition name="fade">
      <div v-if="showConfigModal" class="fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-6" @click="showConfigModal = false">
        <div class="relative w-full max-w-xl bg-white border border-zinc-900 shadow-[8px_8px_0px_#f4f4f5] p-10 animate-in zoom-in-95" @click.stop>
            <div class="flex items-center justify-between mb-10 text-left">
                <h3 class="text-xl font-black text-zinc-900 uppercase tracking-widest">Registry Config</h3>
                <button @click="showConfigModal = false" class="text-zinc-400 hover:text-zinc-900 transition-colors">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            
            <div class="flex flex-wrap gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-4 pt-4">
                <div class="px-4 py-2 border-2 border-zinc-900 bg-zinc-50 text-zinc-900 text-[10px] font-black uppercase opacity-50 cursor-not-allowed">All (Default)</div>
                <button 
                  v-for="item in allPool" 
                  :key="item.id"
                  @click="toggleTempNav(item.name)"
                  class="px-4 py-2 border-2 text-[10px] font-black uppercase transition-all flex items-center gap-2"
                  :class="tempNav.includes(item.name) ? 'border-zinc-900 text-zinc-900 bg-white shadow-[2px_2px_0px_#f4f4f5] -translate-y-0.5' : 'border-zinc-100 text-zinc-400 bg-white'"
                >
                  {{ item.name }}
                </button>
            </div>

            <div class="mt-12 flex justify-center">
                <button @click="applyNav" class="text-[11px] font-black text-zinc-900 border-b-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all px-6 py-1 tracking-widest uppercase">
                  Apply & Sync
                </button>
            </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

.list-leave-active {
  position: absolute;
  width: calc((100% - (4 * 1.5rem)) / 5);
}

@media (max-width: 1280px) {
  .list-leave-active { width: calc((100% - (2 * 1.5rem)) / 3); }
}
@media (max-width: 1024px) {
  .list-leave-active { width: calc((100% - (1 * 1.5rem)) / 2); }
}
@media (max-width: 640px) {
  .list-leave-active { width: 100%; }
}
</style>
