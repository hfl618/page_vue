<script setup>
/**
 * @description 注册页面
 * 采用逻辑解耦模式，业务逻辑见 hooks/useAuth.js
 */
const { 
  form, loading, userStatus, isPasswordVisible, 
  togglePassword, handleSignup 
} = useAuth()
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col items-center mb-8 text-center animate-fade">
      <div class="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
      </div>
      <h1 class="text-[24px] font-semibold text-black tracking-tight">Create your account</h1>
      <p class="text-[14px] text-gray-500 mt-1">Join HeFlos-Hub to build faster.</p>
    </div>

    <SocialAuth action-text="Sign up" />

    <div class="flex items-center mb-6 px-2">
      <div class="flex-grow border-t border-gray-200"></div>
      <span class="flex-shrink-0 mx-4 text-gray-400 text-[11px] font-bold uppercase tracking-widest">Or Secure Signup</span>
      <div class="flex-grow border-t border-gray-200"></div>
    </div>

    <form @submit.prevent="handleSignup" class="flex flex-col gap-5 text-left px-2">
      <!-- 姓名输入行 -->
      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="form.firstName" placeholder="First Name" required />
        <BaseInput v-model="form.lastName" placeholder="Last Name" required />
      </div>

      <!-- 用户名输入：带实时反馈 -->
      <BaseInput 
        v-model="form.username" 
        placeholder="Username" 
        required 
        :error="userStatus.error"
        :success="userStatus.success"
      >
        <template #suffix>
          <!-- 状态指示图标 -->
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 pointer-events-none">
              <div v-if="userStatus.loading" class="w-3.5 h-3.5 border-2 border-zinc-100 border-t-zinc-900 animate-spin rounded-full"></div>
              <svg v-if="userStatus.success" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
              <svg v-if="userStatus.error" class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
        </template>
      </BaseInput>
      
      <div class="flex flex-col gap-2 mt-4"> 
        <BaseInput 
          v-model="form.password" 
          :type="isPasswordVisible ? 'text' : 'password'" 
          placeholder="Create Password" 
          required
        >
          <template #suffix>
            <button type="button" @click="togglePassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-black transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <template v-if="!isPasswordVisible"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></template>
                <template v-else><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></template>
              </svg>
            </button>
          </template>
        </BaseInput>
        <PasswordValidator :value="form.password" />
      </div>

      <BaseButton type="submit" :loading="loading" :disabled="!!userStatus.error || userStatus.loading" class="mt-4">
        Create Account
      </BaseButton>
    </form>

    <p class="text-center text-[13px] text-zinc-400 mt-10 font-bold uppercase tracking-tight">
      Already have an account? 
      <router-link to="/login" class="text-zinc-900 font-black border-b-2 border-zinc-900 ml-1 hover:bg-zinc-900 hover:text-white transition-all px-1">
        Log in
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
