<script setup>
import { ref } from 'vue'
import { useUiStore } from '@/store/ui'

/**
 * FeedbackView 预留页说明：
 * 1. 对应未开发的 Discussions 模块。
 * 2. 物理级还原“模块同步中”脉冲动画。
 * 3. 预留反馈输入接口。
 */

const uiStore = useUiStore()
const feedbackText = ref('')

const submitFeedback = () => {
  if (!feedbackText.value) return
  
  uiStore.addNotice({
    title: 'PROTOCOL_RECEIVED',
    message: 'Feedback transmitted to system core.',
    type: 'success'
  })
  feedbackText.value = ''
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center bg-zinc-50/30" translate="no">
    <div class="flex flex-col items-center gap-10 max-w-lg text-center p-12 bg-white border border-zinc-100 shadow-[20px_20px_0px_#f4f4f5] animate-in zoom-in-95 duration-500">
      
      <!-- 工业状态指示器 -->
      <div class="w-20 h-20 border-2 border-zinc-900 flex items-center justify-center relative">
        <div class="w-8 h-8 bg-zinc-900 animate-pulse"></div>
        <div class="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-zinc-900"></div>
        <div class="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-zinc-900"></div>
      </div>

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
        <div class="flex items-center gap-2 mb-2">
          <div class="w-1 h-3 bg-zinc-900"></div>
          <span class="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Protocol Feedback</span>
        </div>
        <textarea 
          v-model="feedbackText"
          placeholder="ENTER SYSTEM FEEDBACK..." 
          rows="3"
          class="w-full bg-zinc-50 border border-zinc-100 p-4 text-[11px] font-bold text-zinc-900 placeholder:text-zinc-200 outline-none focus:border-zinc-900 focus:bg-white transition-all resize-none"
        ></textarea>
        <button 
          @click="submitFeedback"
          class="w-full py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_#f4f4f5]"
        >
          Transmit Feedback
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 针对该页面的特定物理效果 */
</style>
