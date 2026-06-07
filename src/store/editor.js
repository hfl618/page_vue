import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * @module EditorStore
 * @description 核心编辑器状态管理 (TOC, Media, Dock)
 */
export const useEditorStore = defineStore('editor', () => {
  // === 状态 (State) ===
  const tocList = ref([])         // 大纲列表
  const mediaList = ref([])       // 素材库列表
  const isDockActive = ref(false) // 右侧抽屉是否展开

  // === 动作 (Actions) ===
  const updateTOC = (headings) => {
    tocList.value = headings
  }

  const addMedia = (media) => {
    // 检查是否已存在 (简单去重)
    if (!mediaList.value.some(m => m.url === media.url)) {
      mediaList.value.unshift(media)
    }
    isDockActive.value = true // 存入新素材后，自动弹开抽屉提示用户
  }

  const toggleDock = () => {
    isDockActive.value = !isDockActive.value
  }

  const setDockActive = (active) => {
    isDockActive.value = active
  }

  return { 
    tocList, 
    mediaList, 
    isDockActive, 
    updateTOC, 
    addMedia, 
    toggleDock,
    setDockActive
  }
})
