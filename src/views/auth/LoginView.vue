<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import SocialAuth from './parts/SocialAuth.vue'
import { login } from '@/api/modules/auth'
import { useUserStore } from '@/store/user'

/**
 * LoginView 联调版：
 * 1. 接入真实 API。
 * 2. 自动存储 Token 到 localStorage。
 * 3. 登录成功后跳转至 /discover。
 */

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const data = await login(username.value, password.value)
    
    // 关键修复：增加防御性判断，防止 code 404 等情况导致的代码崩溃
    if (!data) {
      console.warn('Protocol sync failed: No data returned.')
      return
    }

    // 1. 存储 Token
    if (data.token) {
      localStorage.setItem('heflos_token', data.token)
    }
    
    // 2. 同步到全局 Store
    if (data.user) {
      userStore.currentUser = { ...userStore.currentUser, ...data.user }
    }
    
    // 3. 跳转
    await router.push('/discover')
    
  } catch (err) {
    console.error('Auth Protocol Rejected:', err)
  }
}
</script>

<template>
  <AuthLayout>
    <!-- 头部：Logo 与 欢迎语 -->
    <div class="flex flex-col items-center mb-8 text-center animate-fade">
      <div class="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
      </div>
      <h1 class="text-[24px] font-semibold text-zinc-900 leading-tight tracking-tight">Welcome to HeFlos</h1>
      <p class="text-[14px] text-zinc-500 mt-1.5 font-medium">The hub for developer-first tools.</p>
    </div>

    <!-- 社交登录 -->
    <SocialAuth action-text="Continue" />

    <!-- 分隔线 -->
    <div class="flex items-center mb-6 px-2">
      <div class="flex-grow border-t border-zinc-100"></div>
      <span class="flex-shrink-0 mx-4 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">Or Secure Login</span>
      <div class="flex-grow border-t border-zinc-100"></div>
    </div>

    <!-- 表单 -->
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 text-left px-2">
      <div>
        <input v-model="username" type="text" placeholder="Username" required 
               class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-zinc-300 font-bold bg-zinc-50/50">
      </div>
      
      <div class="relative group">
        <input v-model="password" type="password" placeholder="Password" required 
               class="w-full border border-zinc-200 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all placeholder:text-zinc-300 font-bold bg-zinc-50/50">
        <div class="flex justify-end mt-2">
          <router-link to="/forgot-password" class="text-[12px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-tighter">
            Forgot password?
          </router-link>
        </div>
      </div>

      <button type="submit" class="w-full bg-zinc-900 text-white py-3 rounded-lg text-[13px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_#f4f4f5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none mt-4">
        Establish Link
      </button>
    </form>

    <!-- 页脚 -->
    <p class="text-center text-[13px] text-zinc-400 mt-10 font-bold uppercase tracking-tight">
      New to system? 
      <router-link to="/signup" class="text-zinc-900 font-black border-b-2 border-zinc-900 ml-1 hover:bg-zinc-900 hover:text-white transition-all px-1">
        Sign up
      </router-link>
    </p>
  </AuthLayout>
</template>

<style scoped>
.animate-fade {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
