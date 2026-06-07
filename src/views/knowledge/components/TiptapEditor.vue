<script setup>
import { onBeforeUnmount, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Plugin } from 'prosemirror-state'
import { useEditorStore } from '@/store/editor'

/**
 * @description Tiptap 核心编辑器组件
 */
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Input content, or type "#" for headers...' }
})

const emit = defineEmits(['update:modelValue', 'file-injected'])
const store = useEditorStore()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'industrial-img',
      },
    }),
    Placeholder.configure({ 
      placeholder: props.placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),
    // 拦截浏览器默认粘贴行为
    {
      name: 'customPasteHandler',
      addProseMirrorPlugins() {
        return [
          new Plugin({
            props: {
              handlePaste(view, event) {
                const items = Array.from(event.clipboardData?.items || [])
                const imageItem = items.find(item => item.type.includes('image'))
                if (imageItem) {
                  const file = imageItem.getAsFile()
                  emit('file-injected', file)
                  return true // 阻止默认乱码输出
                }
                return false
              }
            }
          })
        ]
      }
    }
  ],
  onUpdate: ({ editor }) => {
    // 同步内容到父组件 (HTML 格式)
    emit('update:modelValue', editor.getHTML())

    // 提取大纲并更新到 Store
    const json = editor.getJSON()
    const headings = []
    json.content?.forEach(node => {
      if (node.type === 'heading') {
        headings.push({
          level: node.attrs.level,
          text: node.content ? node.content.map(n => n.text).join('') : 'Untitled'
        })
      }
    })
    store.updateTOC(headings)
  }
})

// 监听外部内容变化 (如初始化加载)
watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, false)
  }
})

// 暴露方法给外部调用
const insertMedia = (media) => {
  if (!editor.value) return
  if (media.type === 'image') {
    editor.value.chain().focus().setImage({ src: media.url }).run()
  } else {
    editor.value.chain().focus().insertContent(`\n<p><a href="${media.url}" target="_blank" class="industrial-link">📄 ATTACHMENT: ${media.name}</a></p>\n`).run()
  }
}

defineExpose({ insertMedia })

onBeforeUnmount(() => {
  if (editor.value) editor.value.destroy()
})
</script>

<template>
  <div class="tiptap-core-wrapper h-full flex flex-col bg-white">
    <editor-content :editor="editor" class="flex-1 overflow-y-auto custom-scrollbar" />
  </div>
</template>

<style scoped>
.tiptap-core-wrapper :deep(.ProseMirror) {
  outline: none;
  min-height: 100%;
  padding: 60px 80px;
  font-family: var(--font-sans);
  font-size: 15px;
  line-height: 1.8;
  color: #18181b;
}

/* 占位符样式 */
.tiptap-core-wrapper :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #d4d4d8;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}

/* 工业化排版样式 */
.tiptap-core-wrapper :deep(.ProseMirror h1) { font-size: 28px; font-weight: 900; margin-top: 2rem; margin-bottom: 1.5rem; letter-spacing: -0.02em; border-bottom: 2px solid #18181b; padding-bottom: 0.5rem; }
.tiptap-core-wrapper :deep(.ProseMirror h2) { font-size: 20px; font-weight: 800; margin-top: 1.8rem; margin-bottom: 1rem; border-left: 4px solid #18181b; padding-left: 1rem; }
.tiptap-core-wrapper :deep(.ProseMirror h3) { font-size: 16px; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; }
.tiptap-core-wrapper :deep(.ProseMirror p) { margin-bottom: 1.2rem; }

/* 物理图片样式 */
.tiptap-core-wrapper :deep(.industrial-img) {
  max-width: 100%;
  border: 1px solid #18181b;
  box-shadow: 4px 4px 0px #f4f4f5;
  margin: 2rem 0;
  transition: transform 0.2s;
}
.tiptap-core-wrapper :deep(.industrial-img:hover) {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px #e4e4e7;
}

/* 工业链接 */
.tiptap-core-wrapper :deep(.industrial-link) {
  color: #18181b;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
</style>
