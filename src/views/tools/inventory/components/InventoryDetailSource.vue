<script setup>
import { reactive, ref } from 'vue'
import BaseSourceManager from '@/components/common/base/BaseSourceManager.vue'

/**
 * @description 详情面板附件管理栏 (物理原名版)
 * 职责：严格对齐数据库字段：img_path, doc_path, qrcode_path
 */
const props = defineProps({
  item: { type: Object, required: true }
})

const emit = defineEmits(['upload', 'delete-source'])

const loading = reactive({ image: false, doc: false, qr: false })

const inputRefs = {
  image: ref(null),
  doc: ref(null)
}

const handleUploadTrigger = (type) => {
  if (type === 'qr') {
    handleRegenerateQR()
  } else {
    inputRefs[type].value?.click()
  }
}

const handleRegenerateQR = async () => {
  loading.qr = true
  try {
    // 关键：复用 upload 事件，标识为 qr 类型，通知父组件执行自动生成逻辑
    await emit('upload', { type: 'qr' })
    await new Promise(r => setTimeout(r, 1500))
  } finally {
    loading.qr = false
  }
}

const onFileSelected = async (e, type) => {
  const file = e.target.files[0]
  if (!file) return
  loading[type] = true
  try {
    await emit('upload', { type, file })
    await new Promise(r => setTimeout(r, 1200))
  } finally {
    loading[type] = false
    e.target.value = ''
  }
}

const handleWipe = async (type) => {
  loading[type] = true
  try {
    await emit('delete-source', type)
  } finally {
    loading[type] = false
  }
}
</script>

<template>
  <div class="flex gap-4 items-center">
    <input :ref="inputRefs.image" type="file" accept="image/*" class="hidden" @change="onFileSelected($event, 'image')">
    <input :ref="inputRefs.doc" type="file" accept=".pdf,.doc,.docx" class="hidden" @change="onFileSelected($event, 'doc')">

    <span class="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-left shrink-0">Registry Source:</span>
    
    <!-- 1. 图片资源 (Key: img_path) -->
    <BaseSourceManager 
      type="image"
      label="Image"
      :path="item.img_path"
      :loading="loading.image"
      @upload="handleUploadTrigger('image')"
      @redo="handleUploadTrigger('image')"
      @wipe="handleWipe('image')"
    />

    <!-- 2. 文档资源 (Key: doc_path) -->
    <BaseSourceManager 
      type="doc"
      label="Doc"
      :path="item.doc_path"
      :exists="item.hasFile"
      :loading="loading.doc"
      @upload="handleUploadTrigger('doc')"
      @redo="handleUploadTrigger('doc')"
      @wipe="handleWipe('doc')"
    />

    <!-- 3. 二维码资源 (Key: qrcode_path) -->
    <BaseSourceManager 
      type="qr"
      label="QR"
      :path="item.qrcode_path"
      :loading="loading.qr"
      @upload="handleUploadTrigger('qr')"
      @redo="handleUploadTrigger('qr')"
      @wipe="handleWipe('qr')"
    />
  </div>
</template>
