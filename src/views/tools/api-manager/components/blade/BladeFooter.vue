<script setup>
import BaseActionLink from '@/components/common/base/BaseActionLink.vue'

defineProps({
  api: Object
})

const emit = defineEmits(['copy'])
</script>

<template>
  <footer class="px-8 py-6 border-t border-zinc-50 flex items-center justify-between bg-zinc-50/5">
    <span class="text-[7px] font-mono text-zinc-300 uppercase">Registry_Node: {{ api.id || 'SYNC' }}</span>
    <BaseActionLink @click="emit('copy', api.path)" color-class="text-zinc-900" bold class="text-[8px] uppercase">Establish_Sync</BaseActionLink>
  </footer>
</template>
