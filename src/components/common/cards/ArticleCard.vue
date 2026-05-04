<script setup>
import { computed } from 'vue'

/**
 * @description 知识库文章/合集展示卡片 - 视觉精准复原版
 */
const props = defineProps({
  article: { type: Object, required: true },
  viewMode: { type: String, default: 'community' },
  currentStack: { type: Object, default: null },
  processingIds: { type: Object, default: () => new Set() },
  selected: { type: Boolean, default: false }
})

const emit = defineEmits(['open-stack', 'delete', 'toggle-privacy', 'toggle-star', 'toggle-selection'])

/**
 * @description 核心判定逻辑
 * 规则：必须是顶级节点(无父级)，且标记为集合/堆栈或子项数 > 0
 */
const isBundle = computed(() => {
  const a = props.article
  const isRoot = !a.parent_id || a.parent_id === 'null' || a.parent_id === '' || a.parent_id === undefined
  // 严格数值转换匹配
  const hasBundleMarkers = Number(a.is_collection) === 1 || Number(a.is_stack) === 1 || Number(a.child_count) > 0
  return isRoot && hasBundleMarkers
})

const isOwner = computed(() => props.article.is_owner)

// 2. 样式联动
const containerClasses = computed(() => {
  const isActiveStack = props.currentStack && props.article.id === props.currentStack.id
  const showBundle = isBundle.value && !props.currentStack
  
  return {
    // 仅对顶层 Bundle 应用物理叠放效果
    'paper-stack-effect pl-12 shadow-xl': showBundle,
    'shadow-lg border-zinc-400': showBundle,
    // 基础状态与激活态
    'border-[#18181b] shadow-[4px_4px_0px_#f4f4f5] active-stack': isActiveStack,
    'ring-2 ring-zinc-900 border-zinc-900 selected-card': props.selected
  }
})

const handleCardClick = (e) => {
  const isActionElement = e.target.closest('button') || e.target.closest('a')
  if (isActionElement) return
  emit('toggle-selection', props.article.id)
}
</script>

<template>
  <div class="tool-paper-card p-5 flex flex-col rounded-0 relative overflow-hidden text-left group cursor-pointer transition-all"
       :class="containerClasses"
       @click="handleCardClick"
       translate="no">
    
    <!-- 1. 选中态指示器 -->
    <div v-if="selected" class="absolute left-1.5 top-1.5 z-40 bg-zinc-900 text-white p-0.5">
      <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
    </div>

    <!-- 2. 合集侧边黑条 (仅对顶层合集显示) -->
    <div v-if="isBundle && !currentStack" class="stack-seal">
      <span>BUNDLED ARCHIVE</span>
    </div>

    <!-- 3. 右上角：交互按钮区 -->
    <div class="absolute top-3 right-3 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] group-hover:translate-y-0">
      <template v-if="viewMode === 'personal' && isOwner">
        <div class="flex items-center gap-1.5">
          <button @click.stop="emit('toggle-privacy', article)" class="action-btn-sharp" :class="article.visibility === 'public' ? 'text-emerald-600' : ''">
             <div v-if="processingIds[article.id + '-privacy']" class="w-3.5 h-3.5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
             <svg v-else-if="article.visibility === 'public'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c3.478 0 6.522 1.756 8.542 4.542 a2 2 0 010 2.916C18.522 17.244 15.478 19 12 19c-4.477 0-8.268-2.943-9.542-7z"/>
             </svg>
             <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 00-2 2 v8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2 h -1 V 7 c 0 -2.757 -2.243 -5 -5 -5 z"/>
             </svg>
          </button>
          <button @click.stop="emit('delete', article)" class="action-btn-sharp hover:text-red-600">
             <div v-if="processingIds[article.id + '-delete']" class="w-3.5 h-3.5 border-2 border-zinc-100 border-t-red-600 rounded-full animate-spin"></div>
             <svg v-else class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862 a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
             </svg>
          </button>
        </div>
      </template>

      <!-- 统一收藏按钮 (乐观更新版) -->
      <BaseFavoriteButton type="article" :id="article.id" :label="article.collection_title || article.title" />
    </div>

    <!-- 4. 卡片元数据行 (日期 & 勋章) -->
    <div class="mb-3 flex items-center gap-3">
        <span class="text-[8px] font-bold text-zinc-300 uppercase tracking-tight">{{ article.article_date || article.created_at?.substring(0, 10) }}</span>
        <span v-if="currentStack && article.id === currentStack.id" class="bg-zinc-900 text-white text-[7px] px-1 font-black">CORE HEADER</span>
        <span v-if="isBundle && !currentStack" class="bg-zinc-900 text-white text-[8px] px-1.5 py-0.5 font-black uppercase tracking-tighter">
            {{ Number(article.child_count) || 0 }} ITEMS
        </span>
    </div>

    <!-- 5. 内容主体 -->
    <div class="flex-1 min-w-0 flex flex-col pointer-events-none">
        
        <!-- A. 合集布局 (仅在顶级且未展开时显示) -->
        <template v-if="isBundle && !currentStack">
            <div class="flex-1 flex flex-col">
                <div v-if="article.collection_image" class="w-full h-20 mb-3 border border-zinc-900 shadow-[2px_2px_0px_#f4f4f5] overflow-hidden">
                    <img :src="article.collection_image" class="w-full h-full object-cover transition-all duration-500">
                </div>
                <div class="flex items-center gap-3 mb-3">
                    <div v-if="article.collection_icon" class="w-10 h-10 flex items-center justify-center border-2 border-zinc-900 shadow-[3px_3px_0px_#f4f4f5] shrink-0" :class="`bg-${article.collection_color || 'zinc'}-500`" >
                        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path v-if="!article.collection_icon || article.collection_icon === 'box'" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7 h 10"/>
                            <path v-else-if="article.collection_icon === 'code'" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                            <path v-else-if="article.collection_icon === 'database'" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8 -4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8 -4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
                        </svg>
                    </div>
                    <BaseTitle level="h3" size="text-[16px]" class="truncate flex-1 !font-black !leading-tight !tracking-tighter">
                      {{ article.collection_title || article.title }}
                    </BaseTitle>
                </div>
                <p class="text-[10px] text-zinc-400 font-bold italic line-clamp-2 mb-2">{{ article.collection_desc || article.excerpt }}</p>
            </div>
        </template>

        <!-- B. 标准文章布局 -->
        <template v-else>
            <div class="flex-1 flex flex-col">
                <BaseTitle level="h3" size="text-[14px]" class="line-clamp-1 !font-bold !leading-tight !tracking-tight group-hover:text-black">
                  {{ article.title }}
                </BaseTitle>
                <div class="mt-0.5 flex items-center gap-3">
                    <span class="text-[9px] font-bold text-zinc-400">by @{{ article.author }}</span>
                    <div v-if="article.tags" class="flex flex-wrap gap-1">
                        <span v-for="tag in String(article.tags).split(',')" :key="tag" class="text-[8px] font-bold text-zinc-400 border border-zinc-100 px-1 uppercase">
                          {{ tag.trim() }}
                        </span>
                    </div>
                </div>
                <p class="text-[11px] text-zinc-500 mt-3 line-clamp-2 leading-relaxed font-medium italic min-w-0">{{ article.excerpt || 'Encrypted Archive Content...' }}</p>
            </div>
        </template>

        <!-- C. 分类路径 (底部) -->
        <div class="mt-auto pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 overflow-hidden">
            <div class="flex items-center gap-1 opacity-80">
                <template v-for="(cat, index) in (article.category_name ? article.category_name.split(',') : ['General'])" :key="index">
                    <div class="flex items-center gap-1">
                        <span v-if="index > 0" class="text-zinc-200 text-[10px]">/</span>
                        <span class="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{{ cat.trim() }}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <!-- 6. 底部动作条 -->
    <div class="mt-2 pt-3 border-t border-zinc-100 flex justify-between items-center" @click.stop>
      <div class="flex items-center gap-4 text-zinc-400">
        <div class="flex items-center gap-1.5" title="Views">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 12a3 3 0 11-6 0 a 3 3 0 0 1 6 0 z M 2.458 12 C 3.732 7.943 7.523 5 12 5 c 3.478 0 6.522 1.756 8.542 4.542 a 2 2 0 0 1 0 2.916 C 18.522 17.244 15.478 19 12 19 c -4.477 0 -8.268 -2.943 -9.542 -7 z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.views || 0 }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Replies">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.replies || 0 }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Stars">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81 l -3.976 2.888 a 1 1 0 0 0 -0.363 1.118 l 1.518 4.674 c 0.3 0.921 -0.755 1.688 -1.54 1.118 l -3.976 -2.888 a 1 1 0 0 0 -1.175 0 l -3.976 2.888 c -0.784 0.57 -1.838 -0.197 -1.539 -1.118 l 1.518 -4.674 a 1 1 0 0 0 -0.363 -1.118 l -3.976 -2.888 c -0.784 -0.57 -0.38 -1.81 0.588 -1.81 h 4.914 a 1 1 0 0 0 0.951 -0.69 l 1.519 -4.674 z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.stars || 0 }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <!-- 动作链接：如果是合集显示 Open Stack，否则显示 READ/EDIT -->
        <BaseActionLink 
          v-if="isBundle && !currentStack" 
          @click.stop="emit('open-stack', article)"
          color-class="text-blue-600"
          active-border-class="hover:border-blue-600"
          bold
        >
          Open Stack
        </BaseActionLink>
        <template v-else>
            <BaseActionLink v-if="viewMode === 'personal' && isOwner" :to="'/knowledge/editor/'+article.id" bold>
                EDIT
            </BaseActionLink>
            <BaseActionLink v-else :to="'/knowledge/read/'+article.id" bold>
                READ
            </BaseActionLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-paper-card { background: #ffffff; border: 1px solid #e4e4e7; height: 215px; box-shadow: 2px 2px 0px #f4f4f5; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.tool-paper-card:hover { border-color: #18181b !important; transform: translate(-2px, -2px) !important; box-shadow: 4px 4px 0px #e4e4e7 !important; }
.selected-card { transform: translate(-4px, -4px) !important; box-shadow: 8px 8px 0px #18181b !important; }

/* 堆栈物理层叠效果 */
.paper-stack-effect::before { content: ''; position: absolute; left: 4px; top: 4px; width: 100%; height: 100%; border: 1px solid #e4e4e7; background: #fff; z-index: -1; transition: all 0.3s; }
.paper-stack-effect::after { content: ''; position: absolute; left: 8px; top: 8px; width: 100%; height: 100%; border: 1px solid #e4e4e7; background: #fff; z-index: -2; transition: all 0.3s; }

/* 侧边黑色密封条 */
.stack-seal { position: absolute; left: 0; top: 0; width: 24px; height: 100%; background: #18181b; display: flex; align-items: center; justify-content: center; z-index: 10; }
.stack-seal span { transform: rotate(-90deg); white-space: nowrap; color: #fff; font-size: 7px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; }

/* 交互按钮 */
.action-btn-sharp { width: 30px; height: 30px; border: 1px solid #f4f4f5; display: flex; align-items: center; justify-content: center; background: white; transition: all 0.2s; outline: none; box-shadow: 2px 2px 0px #f4f4f5; }
.action-btn-sharp:hover:not(:disabled) { border-color: #18181b; color: #18181b; }
.action-btn-sharp:active:not(:disabled) { transform: translate(0.5px, 0.5px); box-shadow: none; }
</style>
