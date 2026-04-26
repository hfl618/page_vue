<script setup>
/**
 * @description 基础文件上传组件
 */
defineProps({
  accept: String,
  label: String,
  icon: String,
  loading: Boolean,
  fileName: String
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="border-2 border-zinc-900 border-dashed p-12 text-center relative group bg-zinc-50 hover:bg-white transition-all">
    <input 
      type="file" 
      @change="emit('change', $event)" 
      :accept="accept" 
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    >
    <div class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-white border-2 border-zinc-900 flex items-center justify-center shadow-[4px_4px_0px_#18181b]"
           :class="fileName ? 'bg-zinc-900 text-white' : 'text-zinc-900'">
         <svg v-if="!fileName" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
           <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
         </svg>
         <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
           <path d="M5 13l4 4L19 7"/>
         </svg>
      </div>
      <p class="text-sm font-black text-zinc-900 uppercase tracking-widest">
        {{ fileName ? 'LOADED: ' + fileName : label || 'SELECT_FILE' }}
      </p>
    </div>
  </div>
</template>
