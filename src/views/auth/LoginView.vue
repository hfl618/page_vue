<script setup>
/**
 * @description 登录页面
 * 采用逻辑解耦模式，业务逻辑见 hooks/useAuth.js
 */
const { form, loading, handleLogin } = useAuth()
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

    <!-- 社交登录 (自动导入组件) -->
    <SocialAuth action-text="Continue" />

    <!-- 分隔线 -->
    <div class="flex items-center mb-6 px-2">
      <div class="flex-grow border-t border-zinc-100"></div>
      <span class="flex-shrink-0 mx-4 text-zinc-400 text-[11px] font-bold uppercase tracking-widest">Or Secure Login</span>
      <div class="flex-grow border-t border-zinc-100"></div>
    </div>

    <!-- 登录表单 -->
    <form @submit.prevent="handleLogin" class="flex flex-col gap-4 text-left px-2">
      <BaseInput 
        v-model="form.username" 
        placeholder="Username" 
        required 
      />
      
      <BaseInput 
        v-model="form.password" 
        type="password" 
        placeholder="Password" 
        required
      >
        <template #suffix>
          <div class="flex justify-end mt-2">
            <router-link to="/forgot-password" class="text-[12px] font-black text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-tighter">
              Forgot password?
            </router-link>
          </div>
        </template>
      </BaseInput>

      <BaseButton type="submit" :loading="loading" class="mt-4">
        Establish Link
      </BaseButton>
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
