<script setup>
/**
 * @description 用户设置页面
 * 逻辑解耦版：业务逻辑见 hooks/useUserSettings.js
 */
const { 
  activeNav, form, loading, currentUser, 
  handleSave, handleAvatarUpload 
} = useUserSettings()

const navs = [
  { group: 'Personal', items: [
    { id: 'general', name: 'General' },
    { id: 'security', name: 'Security' },
    { id: 'notifications', name: 'Notifications' }
  ]},
  { group: 'Workspace', items: [
    { id: 'members', name: 'Members', badge: 3 },
    { id: 'billing', name: 'Billing' }
  ]}
]
</script>

<template>
  <div class="flex-1 h-full flex flex-col bg-white overflow-hidden" translate="no">
    <div class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar text-left">
      <div class="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-16 lg:gap-24">
        
        <!-- 左侧：二级导航 -->
        <nav class="w-full md:w-48 shrink-0 flex flex-col gap-1.5">
          <template v-for="group in navs" :key="group.group">
            <div class="text-[11px] font-black text-zinc-400 tracking-widest uppercase mb-4 mt-8 first:mt-1">
              {{ group.group }}
            </div>
            <button 
              v-for="item in group.items" 
              :key="item.id"
              @click="activeNav = item.id"
              class="text-[14px] py-1.5 transition-all text-left flex justify-between items-center group"
              :class="activeNav === item.id ? 'font-bold text-zinc-900 border-b border-zinc-900 w-fit' : 'text-zinc-500 hover:text-zinc-900'"
            >
              <span>{{ item.name }}</span>
              <span v-if="item.badge" class="ml-4 text-[10px] font-mono border border-zinc-200 px-1.5 py-0.5 text-zinc-400 group-hover:border-zinc-900 group-hover:text-zinc-900 transition-colors">{{ item.badge }}</span>
            </button>
          </template>
        </nav>

        <!-- 右侧：表单内容 -->
        <div class="flex-1 min-w-0 max-w-[560px] flex flex-col">
          <header class="mb-12">
            <h1 class="text-[28px] font-black text-zinc-900 tracking-tight mb-2 uppercase">General Settings</h1>
            <p class="text-[13px] text-zinc-400 font-medium italic">Update your node identity and personal protocol details.</p>
          </header>

          <!-- 头像区域 -->
          <section class="mb-12 border-b border-zinc-100 pb-12">
            <h2 class="text-[12px] font-black text-zinc-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black">
              <div class="w-1 h-3 bg-zinc-900"></div>
              Avatar Identity
            </h2>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 border-2 border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] overflow-hidden shrink-0 grayscale hover:grayscale-0 transition-all duration-500 bg-zinc-50">
                <img v-if="currentUser.avatar" :src="currentUser.avatar" class="w-full h-full object-cover">
              </div>
              <div class="flex flex-col items-start gap-2">
                <div class="flex items-center gap-3">
                  <label class="text-[11px] font-black text-zinc-900 border-b-2 border-zinc-100 hover:border-zinc-900 transition-all uppercase cursor-pointer">
                    Upload New
                    <input type="file" class="hidden" @change="handleAvatarUpload" accept="image/*">
                  </label>
                  <span class="text-zinc-200 text-[10px]">/</span>
                  <button class="text-[11px] font-black text-zinc-400 hover:text-red-600 transition-colors uppercase">Remove</button>
                </div>
                <p class="text-[10px] text-zinc-300 font-bold uppercase tracking-tighter">Supported: JPG, PNG. MAX_LOAD: 1MB.</p>
              </div>
            </div>
          </section>

          <!-- 个人资料表单 -->
          <section class="mb-12 flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Display Name</label>
              <BaseInput v-model="form.username" placeholder="NAME..." />
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Protocol Bio</label>
              <BaseTextarea v-model="form.bio" placeholder="WRITE YOUR BIO..." />
            </div>
          </section>

          <!-- 物理开关组 -->
          <section class="mb-12">
            <div class="flex items-start justify-between p-6 bg-zinc-50 border border-zinc-100 border-dashed">
              <div class="pr-8">
                <div class="text-[12px] font-black text-zinc-900 mb-1 uppercase tracking-tight">Public Profile Indexing</div>
                <div class="text-[10px] text-zinc-400 font-bold leading-relaxed uppercase">Allow your node to be visible in global registry.</div>
              </div>
              <PhysicalSwitch v-model="form.publicProfile" />
            </div>
          </section>

          <!-- 底部保存按钮 -->
          <div class="mt-4">
             <BaseButton :loading="loading" @click="handleSave" class="!w-auto px-8">
                Save Protocol Changes
             </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
