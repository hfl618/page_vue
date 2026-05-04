<script setup>
/**
 * @description 工业风下划线动作链接
 * 特性：只有鼠标悬停时才显现下划线，保持界面清爽。
 */
const props = defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  block: { type: Boolean, default: false },
  // 自定义文字颜色
  colorClass: { type: String, default: 'text-zinc-900' },
  // 悬停时下划线的颜色
  activeBorderClass: { type: String, default: 'hover:border-zinc-900' },
  // 是否加粗
  bold: { type: Boolean, default: false }
})

const emit = defineEmits(['click'])

const handleClick = (e) => {
  if (props.to || props.href) return // 如果是链接，交给浏览器处理
  emit('click', e)
}
</script>

<template>
  <component 
    :is="to ? 'router-link' : (href ? 'a' : (to === '' && href === '' ? 'span' : 'button'))"
    :to="to"
    :href="href"
    @click="handleClick"
    class="transition-all uppercase px-0.5 pb-0.5 text-[10px] inline-block cursor-pointer border-b-2 border-transparent"
    :class="[
      block ? 'w-full text-center' : '',
      bold ? 'font-black' : 'font-bold',
      colorClass,
      activeBorderClass
    ]"
  >
    <slot></slot>
  </component>
</template>
