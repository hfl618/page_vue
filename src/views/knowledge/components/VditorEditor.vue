<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * VditorEditor 工业封装版：
 * 1. 独立生命周期：负责 script 动态加载与销毁。
 * 2. 指令中心：父组件可通过 expose 的方法触发 加粗、代码等指令。
 * 3. 大纲广播：内容变动时自动提取 headings 并发送事件。
 */

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Enter content...' }
})

const emit = defineEmits(['update:modelValue', 'outline-change'])
const vditorInstance = ref(null)

// 暴露给父组件的方法
const triggerAction = (type) => {
  const btn = document.querySelector(`.vditor-toolbar button[data-type="${type}"]`) || 
              document.querySelector(`.vditor-toolbar__item button[data-type="${type}"]`)
  if (btn) btn.click()
}

defineExpose({ triggerAction })

onMounted(() => {
  vditorInstance.value = new window.Vditor('vditor-target', {
    mode: 'ir',
    height: 'auto',
    minHeight: 600,
    placeholder: props.placeholder,
    value: props.modelValue,
    cache: { enable: false },
    after: () => {
      const tb = document.querySelector('.vditor-toolbar')
      if (tb) tb.style.display = 'none'
    },
    input: (v) => {
      emit('update:modelValue', v)
      
      // 提取大纲并广播
      const headings = document.querySelectorAll('.vditor-ir h1, .vditor-ir h2, .vditor-ir h3')
      const outline = Array.from(headings).map(h => ({
        text: h.innerText.replace(/^#+\s/, ''),
        level: h.tagName.toLowerCase(),
        el: h
      }))
      emit('outline-change', outline)
    }
  })
})

onBeforeUnmount(() => {
  if (vditorInstance.value) {
    vditorInstance.value.destroy()
  }
})
</script>

<template>
  <div id="vditor-target" class="w-full"></div>
</template>

<style>
/* 针对 Vditor 的 Reset 注入 */
.vditor-reset {
  font-family: 'Inter', system-ui, sans-serif !important;
  font-size: 16px !important;
  line-height: var(--article-line-spacing, 1.8) !important;
}
</style>
