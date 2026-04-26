<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useUiStore } from '@/store/ui'
import request from '@/api/request'

const userStore = useUserStore()
const uiStore = useUiStore()
const profile = ref(null)
const loading = ref(true)

const fetchProfile = async () => {
  try {
    const res = await request.get('/v1/user/profile')
    profile.value = res
  } catch (e) {
    console.error('CRITICAL: User Profile establishing failed.')
    // 降级处理：使用 store 中的基本信息
    profile.value = userStore.currentUser
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="h-full flex flex-col bg-white border-r border-zinc-100" translate="no">
    <!-- 极致工业风个人资料卡 -->
    <div class="p-8 flex-1 overflow-y-auto custom-scrollbar">
      <div v-if="profile" class="space-y-10">
        <!-- 头像与基本信息 -->
        <div class="flex flex-col items-center text-center">
          <div class="w-24 h-24 bg-zinc-900 border border-zinc-900 p-1 mb-6 shadow-[8px_8px_0px_#f4f4f5]">
            <img v-if="profile.avatar" :src="profile.avatar" class="w-full h-full object-cover grayscale">
            <div v-else class="w-full h-full flex items-center justify-center text-white text-2xl font-black uppercase">
              {{ profile.username?.[0] }}
            </div>
          </div>
          <h2 class="text-xl font-black uppercase tracking-tighter text-zinc-900">{{ profile.username }}</h2>
          <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Registry Member</p>
        </div>

        <!-- 简介协议 -->
        <div class="space-y-4 text-left">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-zinc-900"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-900">Bio Protocol</span>
          </div>
          <p class="text-xs font-medium text-zinc-500 leading-relaxed italic border-l-2 border-zinc-100 pl-4">
            {{ profile.bio || 'No active transmission.' }}
          </p>
        </div>

        <!-- 元数据网格 -->
        <div class="grid grid-cols-1 gap-6 pt-6 border-t border-zinc-50 text-left">
          <div v-if="profile.location" class="space-y-1">
            <span class="text-[8px] font-black uppercase text-zinc-400">Geolocation</span>
            <p class="text-[11px] font-bold text-zinc-900 uppercase">{{ profile.location }}</p>
          </div>
          <div v-if="profile.website" class="space-y-1">
            <span class="text-[8px] font-black uppercase text-zinc-400">External Node</span>
            <a :href="profile.website" target="_blank" class="text-[11px] font-bold text-zinc-900 uppercase hover:underline decoration-2">Link established</a>
          </div>
          <div class="space-y-1">
            <span class="text-[8px] font-black uppercase text-zinc-400">Protocol Since</span>
            <p class="text-[11px] font-bold text-zinc-900 uppercase">{{ profile.created_at }}</p>
          </div>
        </div>
      </div>

      <!-- 加载占位 -->
      <div v-else class="flex flex-col gap-6 animate-pulse">
        <div class="w-24 h-24 bg-zinc-100 mx-auto"></div>
        <div class="h-4 bg-zinc-100 w-1/2 mx-auto"></div>
        <div class="h-20 bg-zinc-50 w-full"></div>
      </div>
    </div>
  </div>
</template>
