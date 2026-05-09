<script setup>
/**
 * @description 详情面板附件管理栏 (复原版：单行横向排布)
 */
defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['upload'])
</script>

<template>
  <div class="mt-1 flex gap-5 items-center">
    <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Registry Source:</span>
    
    <!-- 图片资源 -->
    <div class="flex items-center gap-1.5">
      <button 
        @click="emit('upload', 'image')"
        class="text-[8px] font-black px-1.5 py-0.5 transition-all uppercase flex items-center gap-1"
        :class="item.img ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-zinc-300'"
      >
        <svg v-if="item.img" class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-2 h-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        Image
      </button>
      <span v-if="item.img" @click="emit('upload', 'image')" class="text-[7px] text-zinc-300 font-bold uppercase cursor-pointer hover:text-zinc-900 underline underline-offset-2">Redo</span>
    </div>

    <!-- 文档资源 -->
    <div class="flex items-center gap-1.5">
      <button 
        @click="emit('upload', 'doc')"
        class="text-[8px] font-black px-1.5 py-0.5 transition-all uppercase flex items-center gap-1"
        :class="item.hasFile ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-zinc-300'"
      >
        <svg v-if="item.hasFile" class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-2 h-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        Doc
      </button>
      <span v-if="item.hasFile" @click="emit('upload', 'doc')" class="text-[7px] text-zinc-300 font-bold uppercase cursor-pointer hover:text-zinc-900 underline underline-offset-2">Redo</span>
    </div>

    <!-- 二维码资源 -->
    <div class="flex items-center gap-1.5">
      <button 
        @click="emit('upload', 'qr')"
        class="text-[8px] font-black px-1.5 py-0.5 transition-all uppercase flex items-center gap-1"
        :class="item.qrCode ? 'bg-violet-50 text-violet-700 border border-violet-100' : 'bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-zinc-300'"
      >
        <svg v-if="item.qrCode" class="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
        <svg v-else class="w-2 h-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M6 18L18 6M6 6l12 12"/></svg>
        QR
      </button>
      <span v-if="item.qrCode" @click="emit('upload', 'qr')" class="text-[7px] text-zinc-300 font-bold uppercase cursor-pointer hover:text-zinc-900 underline underline-offset-2">Redo</span>
    </div>
  </div>
</template>
