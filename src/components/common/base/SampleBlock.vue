<script setup>
import { computed } from 'vue'

/**
 * @description Markdown 风格代码块组件
 * 模拟 GitHub/VSCode 的高辨识度代码展示
 */
const props = defineProps({
  title: String,
  code: [Object, String, Array],
  language: { type: String, default: 'json' }
})

const copyCode = () => {
  const text = typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2)
  navigator.clipboard.writeText(text)
}

const formattedCode = computed(() => {
  if (typeof props.code === 'string') return props.code
  return JSON.stringify(props.code, null, 2)
})

// 简单的语法高亮逻辑（将 JSON 字符染色）
const highlightedCode = computed(() => {
  const json = formattedCode.value
  if (!json) return ''
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'text-blue-600' // 字符串
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-zinc-900 font-bold' // Key
      } else {
        cls = 'text-emerald-600' // String Value
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-orange-600' // Boolean
    } else if (/null/.test(match)) {
      cls = 'text-red-500' // Null
    } else {
      cls = 'text-blue-500' // Number
    }
    return `<span class="${cls}">${match}</span>`
  })
})
</script>

<template>
  <div class="markdown-code-block border border-zinc-200 bg-[#f6f8fa] rounded-md overflow-hidden font-mono group">
    <!-- 头部栏 -->
    <div class="flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200">
      <div class="flex items-center gap-2">
        <div class="flex gap-1">
          <div class="w-2.5 h-2.5 rounded-full bg-red-400/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-amber-400/50"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400/50"></div>
        </div>
        <span class="text-[10px] font-bold text-zinc-400 uppercase ml-2 tracking-tighter">{{ title || 'Code_Source' }}</span>
      </div>
      <button @click="copyCode" class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase">
        Copy
      </button>
    </div>
    <!-- 代码区 -->
    <div class="p-5 overflow-x-auto custom-scrollbar">
      <pre class="text-[12px] leading-relaxed"><code v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<style scoped>
.markdown-code-block {
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>
