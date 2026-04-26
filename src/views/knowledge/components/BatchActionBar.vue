<script setup>
/**
 * @description 批量操作悬浮条
 */
defineProps({
  count: Number
})
defineEmits(['merge', 'delete', 'cancel'])
</script>

<template>
  <Transition name="slide-up">
    <div v-if="count > 0" class="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] flex items-center gap-8 bg-zinc-900 text-white px-6 py-2.5 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] border border-white/10 backdrop-blur-md">
        <div class="flex items-center gap-4 border-r border-white/20 pr-8">
            <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400">Selected Units</span>
            <span class="text-xl font-black font-mono">{{ count }}</span>
        </div>
        <div class="flex items-center gap-6">
            <BaseActionLink color-class="text-white" active-border-class="hover:border-white" @click="$emit('merge')">
              Merge to Stack
            </BaseActionLink>
            <BaseActionLink color-class="text-red-400 hover:text-red-500" active-border-class="hover:border-red-500" @click="$emit('delete')">
              Delete Selected
            </BaseActionLink>
            <div class="w-px h-4 bg-white/20"></div>
            <button @click="$emit('cancel')" class="text-[10px] font-black uppercase tracking-tighter hover:text-zinc-400 transition-colors">Cancel</button>
        </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { 
  transform: translate(-50%, 120%) scale(0.95); 
  opacity: 0; 
}
</style>
