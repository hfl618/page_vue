<script setup>
/**
 * @description 系统反馈页面 (Discussions 占位)
 * 逻辑解耦版：业务逻辑见 hooks/useFeedback.js
 */
const { feedbackText, loading, submitFeedback } = useFeedback()
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center bg-zinc-50/30" translate="no">
    <div class="flex flex-col items-center gap-10 max-w-lg text-center p-12 bg-white border border-zinc-100 shadow-[20px_20px_0px_#f4f4f5] animate-in zoom-in-95 duration-500">
      
      <!-- 自动导入的工业状态指示器 -->
      <IndustrialIndicator animate size="w-20 h-20" />

      <div class="space-y-4">
        <h1 class="text-[28px] font-black text-zinc-900 tracking-tight uppercase leading-none">Terminal Offline</h1>
        <div class="h-0.5 w-12 bg-zinc-900 mx-auto"></div>
        <p class="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-relaxed">
          The discussions module is currently <br>
          undergoing synchronization.
        </p>
      </div>

      <!-- 反馈输入区 -->
      <div class="w-full space-y-4 pt-4 border-t border-zinc-50">
        <div class="flex items-center gap-2 mb-2 text-left">
          <div class="w-1 h-3 bg-zinc-900"></div>
          <span class="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Protocol Feedback</span>
        </div>
        
        <BaseTextarea 
          v-model="feedbackText"
          placeholder="ENTER SYSTEM FEEDBACK..." 
          :rows="3"
        />

        <BaseButton 
          @click="submitFeedback"
          :loading="loading"
        >
          Transmit Feedback
        </BaseButton>
      </div>
    </div>
  </div>
</template>
