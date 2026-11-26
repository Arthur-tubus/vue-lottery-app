<script setup lang="ts">
withDefaults(
  defineProps<{ variant?: 'primary' | 'outline-primary' | 'danger' | 'secondary'; disabled?: boolean; type?: 'button' | 'submit' }>(),
  { variant: 'primary', disabled: false, type: 'button' },
)
</script>

<template>
  <button class="btn" :class="`btn-${variant}`" :type="type" :disabled="disabled">
    <slot />
  </button>
</template>
