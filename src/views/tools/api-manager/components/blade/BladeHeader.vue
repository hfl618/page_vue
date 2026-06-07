<script setup>
import BaseTag from '@/components/common/base/BaseTag.vue'
import BaseButton from '@/components/common/base/BaseButton.vue'
import BaseTitle from '@/components/common/base/BaseTitle.vue'

const props = defineProps({
  api: Object
})

const emit = defineEmits(['toggle-status'])

const getMethodConfig = (method) => {
  if (!method) return { bg: 'bg-zinc-100', color: 'text-zinc-400' }
  const m = String(method).toUpperCase()
  if (m === 'GET') return { bg: 'bg-emerald-600', color: 'text-white' }
  if (m === 'POST') return { bg: 'bg-blue-600', color: 'text-white' }
  return { bg: 'bg-zinc-500', color: 'text-white' }
}

const getSecurityLabel = (sec) => {
  if (sec === 'public') return { text: '🌐 PUBLIC', class: 'text-emerald-500' }
  if (sec === 'admin') return { text: '🚩 ADMIN_ONLY', class: 'text-red-500 font-black' }
  return { text: '🔐 USER_AUTH', class: 'text-blue-500' }
}

const formatPath = (path) => {
  if (!path) return ''
  return path.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/&lt;([^&]+)&gt;/g, '&lt;<span class="text-orange-500 font-bold">$1</span>&gt;')
}
</script>

<template>
  <header class="px-8 pt-8 pb-5 flex flex-col gap-4 shrink-0 text-left border-b border-zinc-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <BaseTag 
          v-for="m in (Array.isArray(api.methods) ? api.methods : [api.method])" 
          :key="m" 
          :bg-class="getMethodConfig(m).bg" 
          :color-class="getMethodConfig(m).color" 
          bold 
          class="!text-[8px] !px-2 !py-0 !border-none"
        >
          {{ m }}
        </BaseTag>
        <span class="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">{{ api.module || 'NODE' }}</span>
        <div class="h-3 w-px bg-zinc-100"></div>
        <!-- 核心：显示安全等级 -->
        <span :class="getSecurityLabel(api.security).class" class="text-[8px] font-black uppercase tracking-tighter">
          {{ getSecurityLabel(api.security).text }}
        </span>
      </div>
      <button 
        @click="emit('toggle-status', api)" 
        class="text-[8px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-zinc-900 transition-colors" 
        :class="api.isActive ? 'text-emerald-500' : 'text-red-400'"
      >
        <div class="w-1 h-1 rounded-full" :class="api.isActive ? 'bg-emerald-500 shadow-[0_0_4px_#10b981]' : 'bg-red-400'"></div>
        {{ api.isActive ? 'LIVE_NODE' : 'LOCKED' }}
      </button>
    </div>
    <div class="space-y-1">
      <BaseTitle level="h3" size="text-md" class="!mb-0 tracking-tight uppercase">{{ api.title }}</BaseTitle>
      <code class="text-[10px] font-mono text-zinc-400 block break-all select-all" v-html="formatPath(api.path)"></code>
    </div>
  </header>
</template>
