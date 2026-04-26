<script setup>
/**
 * @description 用户设置页面 (100% 原子化重构 - 紧凑型顶栏版)
 * 逻辑解耦版：业务逻辑见 hooks/useUserSettings.js
 */
const { 
  activeNav, form, loading, currentUser, 
  handleSave, handleAvatarUpload 
} = useUserSettings()

const navItems = [
  { id: 'general', name: 'General' },
  { id: 'security', name: 'Security' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'members', name: 'Members', badge: 3 },
  { id: 'billing', name: 'Billing' }
]

const handleReset = () => {
  // 简单的本地重置逻辑，或者调用 hook 中的 purgeSession
  window.location.reload() 
}
</script>

<template>
  <div class="flex-1 h-full flex flex-col bg-white overflow-hidden" translate="no">
    
    <!-- 顶部紧凑型导航栏：左侧菜单 + 右侧操作 -->
    <nav class="shrink-0 border-b border-zinc-100 bg-white px-8 md:px-12 h-14 sticky top-0 z-30 flex items-center justify-between overflow-hidden">
      <!-- 左侧：水平菜单 -->
      <div class="flex items-center gap-8 h-full overflow-x-auto no-scrollbar">
        <div 
          v-for="item in navItems" 
          :key="item.id"
          class="flex items-center gap-2 group cursor-pointer h-full relative"
          @click="activeNav = item.id"
        >
          <BaseActionLink 
            :bold="activeNav === item.id"
            active-border-class="border-transparent"
            :color-class="activeNav === item.id ? 'text-zinc-900' : 'text-zinc-500'"
            class="text-[12px] whitespace-nowrap !px-0 mt-1"
          >
            {{ item.name }}
          </BaseActionLink>
          <span v-if="item.badge" 
                class="text-[8px] font-mono border px-1 rounded-sm transition-colors"
                :class="activeNav === item.id ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900'">
            {{ item.badge }}
          </span>
          <!-- 底部 Active 指示线 -->
          <div v-if="activeNav === item.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900"></div>
        </div>
      </div>

      <!-- 右侧：全局操作按钮 -->
      <div class="flex items-center gap-6 shrink-0 pl-8 border-l border-zinc-50 h-8">
        <BaseActionLink color-class="text-zinc-400 hover:text-zinc-900" @click="handleReset">
          RESET
        </BaseActionLink>
        <BaseButton 
          :loading="loading" 
          @click="handleSave" 
          class="!py-1 !text-[11px] !w-auto px-6"
        >
          SAVE CHANGES
        </BaseButton>
      </div>
    </nav>

    <div class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar text-left">
      <div class="max-w-[800px] mx-auto">
        
        <!-- 表单内容 -->
        <div class="flex flex-col">
          <header class="mb-10">
            <BaseTitle level="h1" size="text-[24px]" class="mb-1 uppercase tracking-tighter">
              {{ navItems.find(n => n.id === activeNav)?.name }} Protocol
            </BaseTitle>
            <p class="text-[12px] text-zinc-400 font-medium italic uppercase tracking-widest">
              NODE_ID: <span class="text-zinc-900 font-black">#{{ currentUser.id || 'ANONYMOUS' }}</span> // CONFIG_MODE: ACTIVE
            </p>
          </header>

          <template v-if="activeNav === 'general'">
            <!-- 头像区域 -->
            <section class="mb-10 border-b border-zinc-100 pb-10">
              <BaseTitle level="h2" size="text-[11px]" class="mb-6 tracking-widest flex items-center gap-2">
                <div class="w-1 h-3 bg-zinc-900"></div>
                Avatar Identity
              </BaseTitle>
              <div class="flex items-center gap-8">
                <div class="w-16 h-16 border-2 border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] overflow-hidden shrink-0 grayscale hover:grayscale-0 transition-all duration-500 bg-zinc-50">
                  <img v-if="currentUser.avatar" :src="currentUser.avatar" class="w-full h-full object-cover">
                </div>
                <div class="flex flex-col items-start gap-2">
                  <div class="flex items-center gap-4">
                    <BaseActionLink class="relative overflow-hidden cursor-pointer">
                      Upload New
                      <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleAvatarUpload" accept="image/*">
                    </BaseActionLink>
                    <span class="text-zinc-200 text-[10px]">/</span>
                    <BaseActionLink color-class="text-zinc-400 hover:text-red-600" active-border-class="hover:border-red-600">
                      Remove
                    </BaseActionLink>
                  </div>
                  <p class="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Format: JPG, PNG. Limit: 1MB.</p>
                </div>
              </div>
            </section>

            <!-- 个人资料表单 -->
            <section class="mb-10 flex flex-col gap-8">
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Registry nomenclature</label>
                <BaseInput v-model="form.username" placeholder="NAME..." />
              </div>
              
              <div class="flex flex-col gap-2">
                <label class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Bio</label>
                <BaseTextarea v-model="form.bio" placeholder="WRITE YOUR BIO..." />
              </div>
            </section>

            <!-- 物理开关组 -->
            <section class="mb-10">
              <div class="flex items-start justify-between p-6 bg-zinc-50 border border-zinc-100 border-dashed text-left">
                <div class="pr-8">
                  <BaseTitle level="h4" size="text-[11px]" class="mb-1">Global Visibility</BaseTitle>
                  <div class="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase">Include this node in public archive indexing.</div>
                </div>
                <PhysicalSwitch v-model="form.publicProfile" />
              </div>
            </section>
          </template>

          <template v-else>
            <!-- 占位状态 -->
            <div class="py-24 flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/50">
               <div class="w-12 h-12 border-2 border-zinc-200 flex items-center justify-center mb-6">
                 <div class="w-4 h-4 bg-zinc-200"></div>
               </div>
               <span class="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Subsystem Offline</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
