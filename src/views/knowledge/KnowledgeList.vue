<script setup>
/**
 * @description 知识库主列表页面
 * 采用逻辑解耦模式，所有业务逻辑见 hooks/useKnowledge.js
 */
const {
  viewMode, currentStack, showDirectory, dirSearch, currentPage,
  isStackOwner, filteredArticles, paginatedItems, totalPages, visiblePages,
  init, goToPage, openStack, userStore, router
} = useKnowledgeList()

// 生命周期初始化
onMounted(() => init())
</script>

<template>
  <div class="h-full flex flex-col relative bg-[#fafafa]" translate="no">
    <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">
      <div class="max-w-[1600px] mx-auto">
        <!-- 头部区域 -->
        <div class="flex items-end justify-between mb-12 flex-wrap gap-10 text-left">
          <div class="max-w-xl">
            <div class="flex items-center gap-4 mb-2">
              <h1 class="text-[28px] font-bold text-zinc-900 tracking-tight uppercase leading-none">
                {{ currentStack ? (currentStack.collection_title || currentStack.title) : (viewMode === 'personal' ? 'My Registry' : 'Discovery') }}
              </h1>
              <button v-if="currentStack" @click="currentStack = null" class="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black uppercase shadow-[4px_4px_0px_#f4f4f5]">BACK TO REGISTRY</button>
            </div>
            <p class="text-[11px] font-bold text-zinc-400 uppercase tracking-widest italic">Registry Protocol Active. Found: {{ filteredArticles.length }}</p>
          </div>

          <!-- 导航切换 -->
          <div class="flex items-center gap-6 border-b border-zinc-200 pb-2">
            <template v-if="!currentStack">
              <button @click="viewMode = 'community'" :class="viewMode === 'community' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent'" class="text-[11px] font-black border-b-2 py-1 transition-all uppercase tracking-widest outline-none">Explore</button>
              <button @click="viewMode = 'personal'" :class="viewMode === 'personal' ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent'" class="text-[11px] font-black border-b-2 py-1 transition-all uppercase tracking-widest outline-none">My Notes</button>
            </template>
            <button @click="showDirectory = true" :class="showDirectory ? 'text-zinc-900 border-zinc-900' : 'text-zinc-400 border-transparent'" class="text-[11px] font-black border-b-2 py-1 transition-all uppercase tracking-widest outline-none flex items-center gap-2">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                <span>Index</span>
            </button>
          </div>
        </div>

        <!-- 列表网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
          <ArticleCard 
            v-for="article in filteredArticles" 
            :key="article.id" 
            :article="{...article, is_owner: userStore.currentUser?.id && String(article.user_id) === String(userStore.currentUser.id)}"
            :view-mode="viewMode" :current-stack="currentStack"
            @open-stack="openStack"
          />
        </div>
      </div>
    </div>

    <!-- 索引列表弹窗 -->
    <div v-if="showDirectory" class="fixed inset-0 z-[1000] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-6">
        <div @click.stop class="w-full max-w-5xl bg-white border border-zinc-900 shadow-[8px_8px_0px_#18181b] flex flex-col max-h-[85vh]">
            <div class="p-8 border-b border-zinc-100 flex items-center justify-between gap-10">
                <div class="flex-1 relative text-left">
                    <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none"><svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                    <input type="text" v-model="dirSearch" placeholder="SEARCH IN STACK..." class="w-full bg-zinc-50 border border-zinc-100 pl-12 pr-4 py-3 text-[11px] font-black uppercase outline-none focus:border-zinc-900 transition-all">
                </div>
                <button @click="showDirectory = false" class="text-[10px] font-black uppercase tracking-widest border-b-2 border-zinc-900 pb-0.5 hover:text-zinc-500 transition-all">CLOSE INDEX</button>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-50 border-b border-zinc-100">
                            <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase w-16">No.</th>
                            <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase w-1/4">Nomenclature</th>
                            <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase w-1/3">Specifications</th>
                            <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase">Registry Tags</th>
                            <th class="py-4 px-8 text-[9px] font-black text-zinc-400 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-50">
                        <tr v-for="(item, index) in paginatedItems" :key="item.id" class="group transition-all cursor-pointer hover:bg-zinc-50/50" @click="showDirectory = false; router.push('/knowledge/read/' + item.id)">
                            <td class="py-4 px-8 text-[10px] font-mono font-bold text-zinc-300">{{ String((currentPage - 1) * 10 + index + 1).padStart(3, '0') }}</td>
                            <td class="py-4 px-8">
                                <div class="flex items-center gap-2">
                                    <span v-if="currentStack && item.id === currentStack.id" class="bg-zinc-900 text-white text-[7px] px-1 font-black shrink-0">CORE</span>
                                    <div class="text-[11px] font-black text-zinc-900 uppercase group-hover:translate-x-1 transition-transform truncate">{{ item.collection_title || item.title }}</div>
                                </div>
                            </td>
                            <td class="py-4 px-8"><div class="text-[9px] text-zinc-400 font-bold italic line-clamp-2 leading-relaxed">{{ item.excerpt || 'No summary.' }}</div></td>
                            <td class="py-4 px-8">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="tag in (item.tags ? String(item.tags).split(',') : [])" :key="tag" class="text-[8px] font-black px-1.5 py-0.5 border border-zinc-100 text-zinc-400 uppercase">{{ tag.trim() }}</span>
                                </div>
                            </td>
                            <td class="py-4 px-8 text-right"><router-link :to="'/knowledge/read/' + item.id" class="text-[9px] font-black text-zinc-900 border-b border-zinc-900 uppercase hover:text-zinc-500 transition-all">Open</router-link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 分页 -->
            <div class="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between px-8">
                <div class="flex items-center gap-6"><span class="text-[8px] font-black text-zinc-400 uppercase">Total Count: {{ paginatedItems.length }}</span></div>
                <div class="flex items-center gap-2">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-2 py-1 border border-zinc-200 text-[9px] font-black uppercase disabled:opacity-30 hover:bg-zinc-900 hover:text-white transition-all">Prev</button>
                    <div class="flex items-center gap-1">
                        <button v-for="p in visiblePages" :key="p" @click="goToPage(p)" class="w-6 h-6 flex items-center justify-center text-[9px] font-mono font-bold border" :class="p === currentPage ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-100'">{{ p }}</button>
                    </div>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-2 py-1 border border-zinc-200 text-[9px] font-black uppercase disabled:opacity-30 hover:bg-zinc-900 hover:text-white transition-all">Next</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; }
</style>
