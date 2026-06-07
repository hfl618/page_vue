<script setup>
import BaseButton from './BaseButton.vue'

/**
 * @type {import('histoire').Story}
 */
</script>

<template>
  <Story title="Base/BaseButton" :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Primary">
      <BaseButton variant="primary">Primary Button</BaseButton>
    </Variant>
    
    <Variant title="Secondary">
      <BaseButton variant="secondary">Secondary Button</BaseButton>
    </Variant>

    <Variant title="Loading">
      <BaseButton loading>Loading Button</BaseButton>
    </Variant>

    <Variant title="Disabled">
      <BaseButton disabled>Disabled Button</BaseButton>
    </Variant>

    <Variant title="Custom Style">
      <BaseButton 
        variant="custom" 
        color-class="bg-red-600 text-white border-red-700"
        hover-class="hover:bg-red-500"
      >
        Danger Action
      </BaseButton>
    </Variant>
  </Story>
</template>
