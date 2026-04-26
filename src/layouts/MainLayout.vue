<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

/**
 * @description 主布局组件
 * 采用逻辑解耦模式，利用自动导入消除冗余。
 */
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const showUserMenu = ref(false)

// 导航配置
const navItems = [
  { name: 'discover', path: '/discover', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { name: 'knowledge', path: '/knowledge', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
]

const isActive = (path) => route.path.startsWith(path)
const closeUserMenu = () => { showUserMenu.value = false }

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  closeUserMenu()
}
</script>

<template>
  <div class="flex flex-row w-full h-screen overflow-hidden bg-white" translate="no" @click="closeUserMenu">
    <!-- 侧边栏 -->
    <aside @click.stop class="h-screen border-r border-zinc-100 flex flex-col items-center py-6 bg-white z-50 flex-shrink-0 w-[48px]">
      <router-link to="/" class="w-6 h-6 flex items-center justify-center mb-10 bg-zinc-900 text-white rounded-0 shadow-[2px_2px_0px_#f4f4f5]">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      </router-link>

      <div class="flex flex-col gap-1 w-full items-center">
        <!-- SidebarItem 自动导入 -->
        <SidebarItem v-for="item in navItems" :key="item.name" :to="item.path" :active="isActive(item.path)">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.0"><path :d="item.icon" /></svg>
        </SidebarItem>
      </div>

      <!-- 用户入口 -->
      <div class="mt-auto flex flex-col w-full items-center relative pb-4">
        <button @click.stop="showUserMenu = !showUserMenu" class="group outline-none">
          <div class="w-7 h-7 border-2 border-zinc-900 grayscale shadow-[2px_2px_0px_#f4f4f5] group-hover:shadow-none transition-all overflow-hidden">
            <img :src="`https://api.dicebear.com/7.x/notionists/svg?seed=${userStore.currentUser?.username || 'Guest'}`" class="w-full h-full object-cover">
          </div>
        </button>
        <!-- 浮动菜单 -->
        <div v-show="showUserMenu" @click.stop class="absolute left-12 bottom-0 w-48 bg-white border border-zinc-900 shadow-[4px_4px_0px_#f4f4f5] z-[100] p-1">
          <div class="flex flex-col gap-1">
            <BaseMenuItem to="/profile" @click="closeUserMenu">
              <template #icon>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </template>
              Profile
            </BaseMenuItem>
            <BaseMenuItem to="/settings" @click="closeUserMenu">
              <template #icon>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.756 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.756 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.756 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.756 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.756 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.756 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.756 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </template>
              Settings
            </BaseMenuItem>
            
            <div class="h-px bg-zinc-100 my-0.5"></div>

            <BaseMenuItem @click="handleLogout" class="!text-red-500 hover:!bg-red-50">
              <template #icon>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              </template>
              Logout
            </BaseMenuItem>
          </div>
        </div>
      </div>
    </aside>

    <!-- 主体区域 -->
    <main class="flex-1 h-full relative min-w-0 bg-[#fafafa] flex flex-col overflow-hidden">
      <!-- GlobalHeader 自动导入且无 Props 需求 -->
      <GlobalHeader />

      <div id="content-container" class="flex-1 overflow-y-auto custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition name="fade-quick" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.15s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
