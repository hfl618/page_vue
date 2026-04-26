<script setup>
import { EDITOR_CONFIG } from '@/constants'

/**
 * @description 工业级 Vditor 封装组件
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Protocol sequence pending...' }
})

const emit = defineEmits(['update:modelValue'])
const vditorInstance = ref(null)

// 监听外部 modelValue 变化（仅在实例存在且内容不一致时更新）
watch(() => props.modelValue, (newVal) => {
  if (vditorInstance.value && newVal !== vditorInstance.value.getValue()) {
    vditorInstance.value.setValue(newVal)
  }
})

onMounted(() => {
  vditorInstance.value = new window.Vditor('vditor-mount', {
    height: '100%',
    mode: 'ir',
    value: props.modelValue,
    placeholder: props.placeholder,
    theme: EDITOR_CONFIG.DEFAULT_THEME,
    cdn: EDITOR_CONFIG.VDITOR_CDN,
    cache: { enable: false },
    counter: { enable: true },
    input: (val) => {
      emit('update:modelValue', val)
    },
    upload: {
      url: EDITOR_CONFIG.UPLOAD_URL,
      linkToImgUrl: EDITOR_CONFIG.UPLOAD_URL,
      max: 10 * 1024 * 1024,
      filename: (name) => name.replace(/[^(a-zA-Z0-9\.)]/g, '_')
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
  <div id="vditor-mount" class="h-full"></div>
</template>

<style>
.vditor { border: none !important; }
.vditor-toolbar { 
  border-bottom: 1px solid #f4f4f5 !important; 
  background: #fff !important; 
  padding: 0 40px !important; 
}
.vditor-reset {
  font-family: 'Inter', system-ui, sans-serif !important;
  font-size: 16px !important;
}
</style>
