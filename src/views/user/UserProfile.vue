<script setup>
import { onMounted } from 'vue'
import { useUserProfile } from './hooks/useUserProfile'
import ProfileSidebar from './parts/ProfileSidebar.vue'
import ArticleCard from '@/components/common/cards/ArticleCard.vue'
import ToolCard from '@/components/common/cards/ToolCard.vue'

/**
 * @description 用户个人资料详情组件 - 工业级复刻版
 */
const { 
  profile, 
  loading, 
  loadProfile, 
  activeTab, 
  activeStarTab,
  currentStack,
  userTools,
  starredArticles,
  starredTools,
  filteredArticles
} = useUserProfile()

/**
 * @description 模拟活动数据 (竖向展示)
 */
const activityRegistry = [
  { id: 1, title: 'UPLOAD: SERIAL_BIN_V2.1', time: '24 MINS AGO' },
  { id: 2, title: 'SYNC: SECTOR_4_REGISTRY', time: '2 HOURS AGO' },
  { id: 3, title: 'AUTH: BIOMETRIC_UPLINK', time: '5 HOURS AGO' },
  { id: 4, title: 'ARCHIVE: PACKET_88E2', time: 'YESTERDAY' },
  { id: 5, title: 'FIREWALL: PROTOCOL_INIT', time: 'YESTERDAY' }
]

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="min-h-full bg-white relative z-10 px-6 py-6" translate="no">
    <!-- 主体网格布局 -->
    <div v-if="!loading && profile" class="flex flex-col md:grid md:grid-cols-12 gap-10 pb-20">
      
      <!-- 左侧栏：个人核心信息 (ProfileSidebar 自动注入 logic) -->
      <div class="md:col-span-4 lg:col-span-2">
        <ProfileSidebar />
      </div>

      <!-- 右侧栏：动态内容区 -->
      <div class="md:col-span-8 lg:col-span-10 mt-4 md:mt-0">
        
        <!-- Tab 导航 -->
        <div class="flex items-center justify-between mb-8 border-b border-zinc-100">
          <div class="flex gap-8 text-[14px] font-medium w-full overflow-x-auto custom-scrollbar">
            <!-- 正常模式：Tab 切换 -->
            <div v-if="!currentStack" class="flex gap-8 whitespace-nowrap">
              <button 
                v-for="tab in ['tools', 'knowledge', 'discussions', 'activity', 'stars']" 
                :key="tab"
                @click="activeTab = tab"
                :class="activeTab === tab ? 'pb-3 border-b-2 border-zinc-900 text-zinc-900' : 'pb-3 border-b-2 border-transparent text-zinc-400 hover:text-zinc-900'"
                class="transition-all outline-none font-black uppercase tracking-tighter"
              >
                {{ tab === 'stars' ? 'Stars' : tab }}
                <span v-if="tab === 'stars'" class="ml-1.5 px-1.5 py-0.5 bg-zinc-100 text-zinc-400 text-[10px] font-bold rounded-sm">
                  {{ starredArticles.length + starredTools.length }}
                </span>
              </button>
            </div>
            
            <!-- 堆栈模式：路径显示 -->
            <div v-else class="flex items-center justify-between w-full pb-3">
              <div class="flex items-center gap-3">
                <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stack /</span>
                <span class="text-[14px] font-bold text-zinc-900 uppercase">{{ currentStack.title }}</span>
              </div>
              <button 
                @click="currentStack = null" 
                class="px-3 py-1 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_#f4f4f5] hover:shadow-none"
              >
                CLOSE STACK
              </button>
            </div>
          </div>
        </div>

        <!-- 内容渲染区 -->
        <div class="relative min-h-[400px]">
          
          <!-- 1. Tools 作品集 -->
          <transition name="fade-slide">
            <div v-if="activeTab === 'tools' && !currentStack" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <ToolCard 
                v-for="tool in userTools" 
                :key="tool.id" 
                v-bind="tool" 
                :author="profile.username"
              />
              <div v-if="userTools.length === 0" class="col-span-full">
                <div class="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 bg-zinc-50/30">
                  <h3 class="text-[12px] font-black text-zinc-900 uppercase tracking-[0.3em] mb-2">Registry Empty</h3>
                  <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic mb-8">No tools deployed by this identity.</p>
                  <router-link to="/tools/publish" class="font-black text-zinc-900 border-b-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all uppercase px-4 py-1.5 text-[10px] tracking-widest">
                    Deploy New Module
                  </router-link>
                </div>
              </div>
            </div>
          </transition>

          <!-- 2. Knowledge 知识库 (支持 Stack) -->
          <transition name="fade-slide">
            <div v-if="activeTab === 'knowledge' || currentStack" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              <ArticleCard 
                v-for="article in filteredArticles" 
                :key="article.id" 
                :article="article"
                view-mode="personal"
                :current-stack="currentStack"
                @open-stack="currentStack = $event"
              />
              <div v-if="filteredArticles.length === 0" class="col-span-full">
                <div class="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 bg-zinc-50/30">
                  <h3 class="text-[12px] font-black text-zinc-900 uppercase tracking-[0.3em] mb-2">Archive Locked</h3>
                  <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic mb-8">No intelligence data identified in this sector.</p>
                  <router-link to="/knowledge/editor/new" class="font-black text-zinc-900 border-b-2 border-zinc-900 hover:bg-zinc-900 hover:text-white transition-all uppercase px-4 py-1.5 text-[10px] tracking-widest">
                    Draft New Entry
                  </router-link>
                </div>
              </div>
            </div>
          </transition>

          <!-- 3. Stars 收藏夹 -->
          <transition name="fade-slide">
            <div v-if="activeTab === 'stars' && !currentStack" class="space-y-8">
              <div class="flex items-center gap-6 border-b border-zinc-50 pb-4">
                <button 
                  v-for="sTab in ['articles', 'tools']" 
                  :key="sTab"
                  @click="activeStarTab = sTab"
                  :class="activeStarTab === sTab ? 'text-zinc-900 font-bold border-b-2 border-zinc-900' : 'text-zinc-400 font-medium border-b-2 border-transparent'"
                  class="text-[12px] uppercase tracking-widest transition-all outline-none pb-4 -mb-[18px] flex items-center gap-1.5"
                >
                  {{ sTab }}
                  <span class="px-1.5 py-0.5 bg-zinc-100 text-zinc-400 text-[9px] font-bold rounded-sm">
                    {{ sTab === 'articles' ? starredArticles.length : starredTools.length }}
                  </span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <template v-if="activeStarTab === 'articles'">
                  <ArticleCard 
                    v-for="article in starredArticles" 
                    :key="article.id" 
                    :article="article"
                    view-mode="community"
                  />
                </template>
                <template v-else>
                  <ToolCard 
                    v-for="tool in starredTools" 
                    :key="tool.id" 
                    v-bind="tool"
                  />
                </template>
                
                <!-- 收藏空状态 -->
                <div v-if="(activeStarTab === 'articles' && starredArticles.length === 0) || (activeStarTab === 'tools' && starredTools.length === 0)" class="col-span-full">
                  <div class="py-24 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 bg-zinc-50/30">
                    <h3 class="text-[12px] font-black text-zinc-900 uppercase tracking-[0.3em] mb-2">Nothing Bookmarked</h3>
                    <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">This archive sector is currently empty.</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- 4. Discussions (占位) -->
          <transition name="fade-slide">
            <div v-if="activeTab === 'discussions' && !currentStack" class="space-y-4">
              <div class="bg-white border border-zinc-200 p-8 flex flex-col gap-4 shadow-[2px_2px_0px_#f4f4f5] group hover:border-zinc-900 transition-all">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-zinc-100 border border-zinc-900 flex items-center justify-center">
                    <svg class="w-4 h-4 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[11px] font-black text-zinc-900 uppercase">Personal_Node_Sync</span>
                    <span class="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">Status: Idle</span>
                  </div>
                </div>
                <h2 class="text-xl font-bold text-zinc-900 tracking-tighter uppercase">No active transmissions.</h2>
              </div>
            </div>
          </transition>

          <!-- 5. Activity (竖向时间线排列) -->
          <transition name="fade-slide">
            <div v-if="activeTab === 'activity' && !currentStack" class="flex flex-col gap-4">
              <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Recent_Activity</span>
              <div class="relative pl-4 flex flex-col gap-6">
                <!-- 垂直轴线 -->
                <div class="absolute left-[3px] top-1 bottom-1 w-px bg-zinc-100"></div>
                
                <div 
                  v-for="item in activityRegistry" 
                  :key="item.id" 
                  class="relative group/step"
                >
                  <!-- 节点圆点 -->
                  <div class="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-zinc-900 ring-4 ring-white z-10 transition-transform group-hover/step:scale-125"></div>
                  
                  <!-- 内容 -->
                  <div class="flex flex-col gap-0.5">
                    <div class="text-[10px] font-bold text-zinc-900 uppercase leading-tight group-hover/step:text-zinc-500 transition-colors">
                      {{ item.title }}
                    </div>
                    <div class="text-[8px] font-mono text-zinc-300 uppercase">
                      {{ item.time }}
                    </div>
                  </div>
                </div>

                <!-- 扩展占位 (维持 5 个) -->
                <div v-if="activityRegistry.length === 0" class="py-10 text-center border border-dashed border-zinc-100 bg-zinc-50/30">
                  <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">No Recent Transmission</span>
                </div>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </div>

    <!-- 加载骨架屏 -->
    <div v-else class="flex flex-col md:grid md:grid-cols-12 gap-10 animate-pulse">
      <div class="md:col-span-4 lg:col-span-2 space-y-6">
        <div class="w-28 h-28 bg-zinc-100"></div>
        <div class="h-8 bg-zinc-100 w-1/2"></div>
        <div class="h-20 bg-zinc-50 w-full"></div>
      </div>
      <div class="md:col-span-8 lg:col-span-10 space-y-8 mt-8">
        <div class="h-10 bg-zinc-50 w-full"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="h-[160px] bg-zinc-50"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #18181b;
}
</style>
