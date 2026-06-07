<script setup>
import { ref, computed } from 'vue'

/**
 * @description 工业级递归 JSON 树组件 (高阶扩展版)
 * 预留接口：
 * 1. path: 完整的引用路径，支持点击复制。
 * 2. searchQuery: 搜索关键词，支持高亮定位。
 * 3. customRender: 插槽支持，允许外部决定特定字段的显示方式。
 */
const props = defineProps({
  data: [Object, Array, String, Number, Boolean],
  label: String,
  depth: { type: Number, default: 0 },
  isLast: { type: Boolean, default: true },
  // 递归传递的父路径 (如: data.user[0])
  currentPath: { type: String, default: '' },
  // 外部传入的搜索词
  searchQuery: { type: String, default: '' }
})

const emit = defineEmits(['node-click', 'path-copy'])

const isExpanded = ref(props.depth < 1)

const isObject = computed(() => props.data !== null && typeof props.data === 'object')
const isArray = computed(() => Array.isArray(props.data))

const keys = computed(() => {
  if (!isObject.value) return []
  // 性能优化：如果是超大数组，此处可增加分片逻辑
  return Object.keys(props.data)
})

// 计算当前节点的完整引用路径
const fullPath = computed(() => {
  if (!props.label) return props.currentPath
  const separator = props.currentPath ? (isArray.value ? '' : '.') : ''
  const keyPart = isArray.value ? `[${props.label}]` : props.label
  return `${props.currentPath}${separator}${keyPart}`
})

// 语义化识别：颜色、链接等
const isUrl = computed(() => typeof props.data === 'string' && props.data.startsWith('http'))
const isColor = computed(() => typeof props.data === 'string' && /^#([0-9a-f]{3}){1,2}$/i.test(props.data))

const toggle = () => {
  if (isObject.value) isExpanded.value = !isExpanded.value
}

const handleKeyClick = () => {
  // 扩展：点击键名，发出路径拷贝事件
  navigator.clipboard.writeText(fullPath.value)
  emit('path-copy', fullPath.value)
}

const valueColor = computed(() => {
  if (typeof props.data === 'string') return 'text-emerald-700'
  if (typeof props.data === 'number') return 'text-blue-700'
  if (typeof props.data === 'boolean') return 'text-orange-700'
  return 'text-zinc-600'
})
</script>

<template>
  <div class="json-tree-node font-mono text-[11px] leading-relaxed select-text" :class="{ 'opacity-40': searchQuery && !fullPath.includes(searchQuery) }">
    <div class="flex items-start group relative">
      
      <!-- 1. 展开/折叠箭头 -->
      <span v-if="isObject" @click="toggle" class="w-4 h-4 flex items-center justify-center cursor-pointer text-zinc-400 hover:text-zinc-900 transition-colors mt-0.5">
        <svg :class="{ 'rotate-90': isExpanded }" class="w-2.5 h-2.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </span>
      <span v-else class="w-4"></span>

      <!-- 2. 键名渲染 (支持路径拷贝交互) -->
      <div class="flex flex-wrap items-center">
        <span 
          v-if="label" 
          @click="handleKeyClick"
          class="text-zinc-500 mr-2 cursor-pointer hover:text-blue-600 hover:underline decoration-dotted underline-offset-4 transition-colors"
          title="Click to copy path"
        >
          {{ label }}:
        </span>

        <!-- 3. 对象/数组摘要 -->
        <template v-if="isObject">
          <span @click="toggle" class="cursor-pointer text-zinc-400 hover:text-zinc-600">
            {{ isArray ? '[' : '{' }}
            <span v-if="!isExpanded" class="text-[9px] px-1.5 py-0.5 bg-zinc-100 rounded-sm mx-1 italic text-zinc-400 border border-zinc-200/50">
              {{ isArray ? `${data.length} items` : `${keys.length} keys` }}
            </span>
            <span v-if="!isExpanded">{{ isArray ? ']' : '}' }}{{ isLast ? '' : ',' }}</span>
          </span>
        </template>

        <!-- 4. 基础类型显示 (支持插槽扩展) -->
        <template v-else>
          <slot name="value" :value="data" :path="fullPath">
            <div class="flex items-center gap-2">
              <span :class="valueColor" class="break-all">{{ typeof data === 'string' ? `"${data}"` : data }}</span>
              
              <!-- 语义化扩展 A: 颜色预览 -->
              <div v-if="isColor" :style="{ backgroundColor: data }" class="w-3 h-3 border border-zinc-200 rounded-sm shadow-sm shrink-0"></div>
              
              <!-- 语义化扩展 B: 链接跳转 -->
              <a v-if="isUrl" :href="data" target="_blank" class="text-blue-400 hover:text-blue-600">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </slot>
          <span v-if="!isLast" class="text-zinc-400">,</span>
        </template>
      </div>

      <!-- 路径悬浮提示 (极简工业风) -->
      <div class="absolute left-0 -top-6 bg-zinc-900 text-white text-[8px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-xl border border-zinc-800" v-if="label && depth > 0">
        {{ fullPath }}
      </div>
    </div>

    <!-- 5. 递归子节点 -->
    <div v-if="isObject && isExpanded" class="ml-4 border-l border-zinc-100 pl-2">
      <BaseJsonTree 
        v-for="(key, index) in keys" 
        :key="key"
        :data="data[key]"
        :label="isArray ? String(index) : key"
        :depth="depth + 1"
        :is-last="index === keys.length - 1"
        :current-path="fullPath"
        :search-query="searchQuery"
        @path-copy="(p) => emit('path-copy', p)"
      />
      <div class="text-zinc-400">{{ isArray ? ']' : '}' }}{{ isLast ? '' : ',' }}</div>
    </div>
  </div>
</template>

<style scoped>
.json-tree-node { white-space: nowrap; }
</style>
