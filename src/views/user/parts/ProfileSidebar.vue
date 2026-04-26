<script setup>
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

/**
 * ProfileSidebar 像素级还原版：
 * 1. 补齐 Followers, Location, Website 信息。
 * 2. 补齐 Activity Chart (活跃热力图) 物理还原。
 * 3. 补齐 Achievements (成就勋章) 模块。
 * 4. 结构对齐 profile_sidebar.html 的 3:9 布局比例。
 */

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
</script>

<template>
  <aside class="flex flex-col text-left">
    <!-- 1. 头像组件：还原 w-28 h-28 与 6px 偏移阴影 -->
    <div class="mb-6 relative">
      <div class="w-28 h-28 border-2 border-zinc-900 shadow-[6px_6px_0px_#f4f4f5] grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden bg-white">
        <img :src="currentUser.avatar" class="w-full h-full object-cover">
      </div>
      <div class="absolute -bottom-2 -right-2 bg-zinc-900 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter shadow-sm">Active_Node</div>
    </div>

    <!-- 2. 用户核心标题 -->
    <h1 class="text-[24px] font-black text-zinc-900 tracking-tighter leading-tight uppercase">
      {{ currentUser.username }}
    </h1>
    <div class="flex items-center gap-3 mb-4">
      <h2 class="text-[12px] text-zinc-400 font-bold uppercase tracking-widest">
        @{{ currentUser.username }}_embed
      </h2>
      <router-link to="/settings" class="text-[10px] font-black text-zinc-900 border-b-2 border-zinc-100 hover:border-zinc-900 transition-all uppercase px-0.5">
        EDIT
      </router-link>
    </div>

    <!-- 3. 社交统计 -->
    <div class="flex items-center gap-3 text-[12px] text-zinc-600 mb-5 font-medium">
      <a href="#" class="hover:text-blue-600 transition-colors"><span class="font-bold text-zinc-900">1.2k</span> followers</a>
      <span class="w-1 h-1 bg-zinc-300 rounded-full"></span>
      <a href="#" class="hover:text-blue-600 transition-colors"><span class="font-bold text-zinc-900">45</span> following</a>
    </div>

    <!-- 4. 简介 -->
    <p class="text-[13px] text-zinc-700 leading-relaxed mb-6 font-medium">
      {{ currentUser.bio }}
    </p>

    <!-- 5. 链接与位置 -->
    <div class="flex flex-col gap-4 mb-8">
      <div class="flex flex-col gap-2.5 text-[12.5px] text-zinc-600">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="1.5"/>
          </svg>
          Tokyo, Japan
        </div>
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
          <a href="#" class="hover:text-blue-600 hover:underline font-semibold text-zinc-800 tracking-tight">yourtools.dev</a>
        </div>
      </div>
    </div>

    <!-- 6. 活跃度图表 (Activity Heatmap) -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-[12px] font-bold text-zinc-900 uppercase">Activity</h3>
        <span class="text-[11px] text-zinc-400 font-mono">90 Days</span>
      </div>
      <div class="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm">
        <div class="flex flex-wrap gap-[3px] overflow-hidden">
          <div v-for="i in 24" :key="i" class="w-2.5 h-2.5 bg-zinc-100 rounded-sm hover:bg-zinc-900 transition-colors cursor-pointer"></div>
        </div>
      </div>
    </div>

    <!-- 7. 成就勋章 (Achievements) -->
    <div class="mb-8">
      <h3 class="text-[12px] font-bold text-zinc-900 uppercase tracking-wider mb-4">Achievements</h3>
      <div class="flex flex-wrap gap-2.5">
        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-100 to-amber-50 border border-yellow-200 text-yellow-600 shadow-sm">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
        </div>
        <div class="flex items-center justify-center px-3 h-9 rounded-lg bg-zinc-900 text-white font-bold text-[10px] uppercase tracking-tighter">IoT_TEAM</div>
      </div>
    </div>

    <!-- 8. 系统指标：补全底部内容 -->
    <div class="mt-4 pt-8 border-t border-zinc-100 flex flex-col gap-5">
      <!-- 节点在线状态 -->
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Node_Status</span>
        <div class="flex items-center gap-1.5">
          <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span class="text-[10px] font-bold text-zinc-900 uppercase">Online</span>
        </div>
      </div>

      <!-- 预留：最近动态预览 (时间线模式) -->
      <div class="flex flex-col gap-4">
        <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Recent_Activity</span>
        
        <div class="relative pl-4 flex flex-col gap-6">
          <!-- 时间轴竖线 -->
          <div class="absolute left-[3px] top-1 bottom-1 w-px bg-zinc-100"></div>

          <!-- 动态项 1 -->
          <div class="relative group/step">
            <!-- 时间点 -->
            <div class="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-zinc-900 ring-4 ring-white z-10"></div>
            <div class="flex flex-col gap-0.5">
              <div class="text-[10px] font-bold text-zinc-900 uppercase leading-tight group-hover/step:text-blue-600 transition-colors">UPLOAD: SERIAL_BIN_V2.1</div>
              <div class="text-[8px] font-mono text-zinc-300 uppercase">24 MINS AGO</div>
            </div>
          </div>

          <!-- 动态项 2 (预留) -->
          <div class="relative group/step">
            <div class="absolute -left-[16px] top-1 w-1.5 h-1.5 rounded-full bg-zinc-200 ring-4 ring-white z-10 group-hover/step:bg-zinc-900 transition-all"></div>
            <div class="flex flex-col gap-0.5">
              <div class="text-[10px] font-bold text-zinc-400 uppercase leading-tight group-hover/step:text-zinc-900 transition-colors">Registry_Node_Sync</div>
              <div class="text-[8px] font-mono text-zinc-200 uppercase">2 HOURS AGO</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Registry_Auth</span>
        <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter italic">Verified</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* 确保侧边栏在极小屏下不至于过于拥挤 */
@media (max-width: 768px) {
  aside {
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 2rem;
  }
}
</style>
