<script setup>
/**
 * @description 知识库文章/合集展示卡片 (支持多选模式)
 */
const props = defineProps({
  article: { type: Object, required: true },
  viewMode: { type: String, default: 'community' },
  currentStack: { type: Object, default: null },
  processingIds: { type: Object, default: () => new Set() },
  selected: { type: Boolean, default: false } // 选中状态
})

const emit = defineEmits(['open-stack', 'delete', 'toggle-privacy', 'toggle-star', 'toggle-selection'])

const containerClasses = computed(() => {
  const isActiveStack = props.currentStack && props.article.id === props.currentStack.id
  return {
    'paper-stack-effect pl-12 shadow-xl': props.article.is_stack && !props.currentStack,
    'shadow-lg border-zinc-400': props.article.is_collection && !props.currentStack,
    'border-[#18181b] shadow-[4px_4px_0px_#f4f4f5] active-stack': isActiveStack,
    'ring-2 ring-zinc-900 border-zinc-900 selected-card': props.selected
  }
})

// 处理卡片点击逻辑
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
    
    <!-- 选中态指示器 -->
    <div v-if="selected" class="absolute left-2 top-2 z-40 bg-zinc-900 text-white p-0.5">
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
    </div>

    <!-- 合集侧边黑条 (覆盖字体版) -->
    <div v-if="article.is_stack && !currentStack" class="stack-seal">
      <span>STACK_ARCHIVE</span>
    </div>

    <!-- 右上角：交互按钮区 -->
    <div class="absolute top-3 right-3 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-all translate-y-[-4px] group-hover:translate-y-0">
      <template v-if="viewMode === 'personal' && article.is_owner">
        <div class="flex items-center gap-1.5" @click.stop>
          <BaseIconButton 
            :active="article.visibility === 'public'" 
            active-class="text-emerald-600 border-emerald-100"
            :loading="processingIds?.has(article.id + '-privacy')"
            @click.stop="emit('toggle-privacy', article)"
          >
             <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path v-if="article.visibility === 'public'" d="M15 12 a 3 3 0 1 1 -6 0 a 3 3 0 0 1 6 0 z M 2.458 12 C 3.732 7.943 7.523 5 12 5 c 3.478 0 6.522 1.756 8.542 4.542 a 2 2 0 0 1 0 2.916 C 18.522 17.244 15.478 19 12 19 c -4.477 0 -8.268 -2.943 -9.542 -7 z"/>
                <path v-else d="M12 2 C 9.243 2 7 4.243 7 7 v 3 H 6 a 2 2 0 0 0 -2 2 v 8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2 h -1 V 7 c 0 -2.757 -2.243 -5 -5 -5 z"/>
             </svg>
          </BaseIconButton>
          
          <BaseIconButton 
            class="hover:text-red-600 hover:border-red-100"
            :loading="processingIds?.has(article.id + '-delete')"
            @click.stop="emit('delete', article)"
          >
             <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path d="M19 7 l -0.867 12.142 A 2 2 0 0 1 16.138 21 H 7.862 a 2 2 0 0 1 -1.995 -1.858 L 5 7 m 5 4 v 6 m 4 -6 v 6 m 1 -10 V 4 a 1 1 0 0 0 -1 -1 h -4 a 1 1 0 0 0 -1 1 v 3 M 4 7 h 16"/>
             </svg>
          </BaseIconButton>
        </div>
      </template>

      <BaseIconButton 
        :active="article.is_starred"
        active-class="text-amber-500 border-amber-100"
        @click.stop="emit('toggle-star', article)"
      >
        <svg :class="article.is_starred ? 'fill-current' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" class="w-3.5 h-3.5">
            <path d="M11.049 2.927 c 0.3 -0.921 1.603 -0.921 1.902 0 l 1.519 4.674 a 1 1 0 0 0 0.95 0.69 h 4.915 c 0.969 0 1.371 1.24 0.588 1.81 l -3.976 2.888 a 1 1 0 0 0 -0.363 1.118 l 1.518 4.674 c 0.3 0.921 -0.755 1.688 -1.54 1.118 l -3.976 -2.888 a 1 1 0 0 0 -1.175 0 l -3.976 2.888 c -0.784 0.57 -1.838 -0.197 -1.539 -1.118 l 1.518 -4.674 a 1 1 0 0 0 -0.363 -1.118 l -3.976 -2.888 c -0.784 -0.57 -0.38 -1.81 0.588 -1.81 h 4.914 a 1 1 0 0 0 0.951 -0.69 l 1.519 -4.674 z"/>
        </svg>
      </BaseIconButton>
    </div>

    <!-- 卡片主体内容 -->
    <div class="mt-2 mb-3 flex items-center gap-3 pointer-events-none">
      <span class="text-[8px] font-bold text-zinc-300 uppercase font-mono">{{ article.created_at?.substring(0, 10) }}</span>
    </div>

    <div class="flex-1 min-w-0 flex flex-col pointer-events-none">
        <template v-if="article.is_collection && !currentStack">
            <div class="flex-1 flex flex-col">
                <div v-if="article.collection_image" class="w-full h-20 mb-3 border border-zinc-900 shadow-sm overflow-hidden">
                    <img :src="article.collection_image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                </div>
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 flex items-center justify-center border-2 border-zinc-900 shadow-[3px_3px_0px_#f4f4f5] shrink-0" :class="`bg-${article.collection_color || 'zinc'}-500`" >
                        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path v-if="article.collection_icon === 'code'" d="M10 20 l 4 -16 m 4 4 l 4 4 -4 4 M 6 16 l -4 -4 4 -4"/>
                            <path v-else-if="article.collection_icon === 'database'" d="M4 7 v 10 c 0 2.21 3.582 4 8 4 s 8 -1.79 8 -4 V 7 M 4 7 c 0 2.21 3.582 4 8 4 s 8 -1.79 8 -4 M 4 7 c 0 -2.21 3.582 -4 8 -4 s 8 1.79 8 4 m 0 5 c 0 2.21 -3.582 4 -8 4 s -8 -1.79 -8 -4"/>
                            <path v-else d="M19 11 H 5 m 14 0 a 2 2 0 0 1 2 2 v 6 a 2 2 0 0 1 -2 2 H 5 a 2 2 0 0 1 -2 -2 v -6 a 2 2 0 0 1 2 -2 m 14 0 V 9 a 2 2 0 0 0 -2 -2 M 5 11 V 9 a 2 2 0 0 1 2 -2 m 0 0 V 5 a 2 2 0 0 1 2 -2 h 6 a 2 2 0 0 1 2 2 v 2 M 7 7 h 10"/>
                        </svg>
                    </div>
                    <BaseTitle level="h3" size="text-[18px]" class="truncate flex-1">
                      {{ article.collection_title || article.title }}
                    </BaseTitle>
                </div>
                <p class="text-[11px] text-zinc-400 font-bold italic line-clamp-3 mb-4">{{ article.collection_desc || article.excerpt }}</p>
            </div>
        </template>
        <template v-else>
            <div class="flex-1 flex flex-col text-left">
                <BaseTitle level="h3" size="text-[14px]" class="line-clamp-1 group-hover:text-black">
                  {{ article.title }}
                </BaseTitle>
                <div class="mt-0.5 flex items-center gap-3">
                    <span class="text-[9px] font-bold text-zinc-400">@{{ article.author }}</span>
                    <div v-if="article.tags" class="flex flex-wrap gap-1">
                        <BaseTag v-for="tag in String(article.tags).split(',')" :key="tag">
                          {{ tag.trim() }}
                        </BaseTag>
                    </div>
                </div>
                <p class="text-[11px] text-zinc-500 mt-3 line-clamp-2 leading-relaxed font-medium italic min-w-0">{{ article.excerpt || 'Accessing Registry Protocol...' }}</p>
            </div>
        </template>
    </div>

    <!-- 底部动作条 -->
    <div class="mt-2 pt-3 border-t border-zinc-100 flex justify-between items-center" @click.stop>
      <div class="flex items-center gap-2.5 text-zinc-400">
        <div class="flex items-center gap-1.5" title="Views">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M15 12 a 3 3 0 1 1 -6 0 a 3 3 0 0 1 6 0 z M 2.458 12 C 3.732 7.943 7.523 5 12 5 c 3.478 0 6.522 1.756 8.542 4.542 a 2 2 0 0 1 0 2.916 C 18.522 17.244 15.478 19 12 19 c -4.477 0 -8.268 -2.943 -9.542 -7 z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.views || 0 }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Replies">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.replies || 0 }}</span>
        </div>
        <div class="flex items-center gap-1.5" title="Stars">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118 l 1.518 4.674 c 0.3 0.921 -0.755 1.688 -1.54 1.118 l -3.976 -2.888 a 1 1 0 0 0 -1.175 0 l -3.976 2.888 c -0.784 0.57 -1.838 -0.197 -1.539 -1.118 l 1.518 -4.674 a 1 1 0 0 0 -0.363 -1.118 l -3.976 -2.888 c -0.784 -0.57 -0.38 -1.81 0.588 -1.81 h 4.914 a 1 1 0 0 0 0.951 -0.69 l 1.519 -4.674 z"/></svg>
            <span class="text-[10px] font-bold font-mono text-zinc-900">{{ article.stars || 0 }}</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <BaseActionLink 
          v-if="article.is_stack && !currentStack" 
          @click.stop="emit('open-stack', article)"
          color-class="text-blue-600"
          active-border-class="hover:border-blue-600"
        >
          Open Stack
        </BaseActionLink>
        <BaseActionLink v-else :to="article.is_owner ? '/knowledge/editor/'+article.id : '/knowledge/read/'+article.id">
          {{ article.is_owner ? 'EDIT' : 'READ' }}
        </BaseActionLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-paper-card { background: #ffffff; border: 1px solid #e4e4e7; height: 200px; box-shadow: 2px 2px 0px #f4f4f5; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
.tool-paper-card:hover { border-color: #18181b !important; transform: translate(-2px, -2px) !important; box-shadow: 4px 4px 0px #e4e4e7 !important; }
.selected-card { transform: translate(-4px, -4px) !important; box-shadow: 8px 8px 0px #18181b !important; }

.paper-stack-effect::before { content: ''; position: absolute; left: 4px; top: 4px; width: 100%; height: 100%; border: 1px solid #e4e4e7; background: #fff; z-index: -1; transition: all 0.3s; }
.paper-stack-effect::after { content: ''; position: absolute; left: 8px; top: 8px; width: 100%; height: 100%; border: 1px solid #e4e4e7; background: #fff; z-index: -2; transition: all 0.3s; }

.stack-seal { position: absolute; left: 0; top: 0; width: 24px; height: 100%; background: #18181b; display: flex; align-items: center; justify-content: center; z-index: 10; }
.stack-seal span { transform: rotate(-90deg); white-space: nowrap; color: #fff; font-size: 7px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; }
</style>
