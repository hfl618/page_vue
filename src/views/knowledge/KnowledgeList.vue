<script setup>
import { onMounted } from 'vue'
import { useKnowledge } from './hooks/useKnowledge'

/**
 * @description 知识库主列表页面
 */
console.info('[View] KnowledgeList loading...')

const {
  viewMode, currentStack, showDirectory, dirSearch, currentPage, itemsPerPage,
  filteredArticles, paginatedItems, totalPages, visiblePages, indexItems,
  processingIds, selectedIds, 
  init, openStack, toggleSelection, toggleAll, clearSelection, 
  handleDeleteArticle, handleTogglePrivacy, userStore
} = useKnowledge()

const handleIndexItemClick = (item) => {
  if (item.is_collection) openStack(item)
  else window.location.href = `/knowledge/read/${item.id}`
}

onMounted(() => {
  console.log('[View] onMounted triggered')
  init()
})
</script>

<template>
  <div class="h-full flex flex-col relative bg-[#fafafa]" translate="no">
    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar pb-32">
      <div class="max-w-[1600px] mx-auto">
        
        <!-- 1. 头部区域 -->
        <KnowledgeHeader 
          v-model:view-mode="viewMode"
          v-model:current-stack="currentStack"
          :count="filteredArticles.length"
          @open-index="showDirectory = true"
        />

        <!-- 2. 内容网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
          <!-- 创建按钮 -->
          <router-link 
            v-if="viewMode === 'personal' && !currentStack" 
            to="/knowledge/editor/new" 
            class="tool-paper-card p-5 flex flex-col items-center justify-center text-center hover:bg-white transition-all group border-dashed border-zinc-300"
          >
            <div class="w-8 h-8 border border-zinc-200 flex items-center justify-center text-zinc-300 group-hover:text-zinc-900 group-hover:border-zinc-900 mb-2 transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M12 4.5v16m7.5-8h-16"/></svg>
            </div>
            <span class="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-900 uppercase tracking-widest transition-colors">Create Entry</span>
          </router-link>

          <ArticleCard 
            v-for="article in filteredArticles" 
            :key="article.id" 
            :article="{...article, is_owner: userStore.currentUser?.id && String(article.user_id) === String(userStore.currentUser.id)}"
            :view-mode="viewMode" :current-stack="currentStack"
            :processing-ids="processingIds"
            :selected="selectedIds.has(article.id)"
            @open-stack="openStack"
            @delete="handleDeleteArticle"
            @toggle-privacy="handleTogglePrivacy"
            @toggle-selection="toggleSelection"
          />
        </div>
      </div>
    </div>

    <!-- 3. 批量操作条 -->
    <BatchActionBar 
      :count="selectedIds.size"
      @cancel="clearSelection"
    />

    <!-- 4. 索引弹窗 -->
    <KnowledgeIndexModal 
      :show="showDirectory"
      v-model:dir-search="dirSearch"
      v-model:items-per-page="itemsPerPage"
      :items="paginatedItems"
      :total-count="indexItems.length"
      :current-page="currentPage"
      :total-pages="totalPages"
      :visible-pages="visiblePages"
      :current-stack="currentStack"
      :selected-ids="selectedIds"
      @close="showDirectory = false"
      @click-item="handleIndexItemClick"
      @go-page="(p) => currentPage = p"
      @toggle-selection="toggleSelection"
      @toggle-all="toggleAll"
    />
  </div>
</template>

<style scoped>
.tool-paper-card { background: #ffffff; border: 1px solid #e4e4e7; height: 200px; box-shadow: 2px 2px 0px #f4f4f5; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
</style>
