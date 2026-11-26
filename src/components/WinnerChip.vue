<script setup lang="ts">
defineProps<{ name: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span class="badge text-bg-primary d-inline-flex align-items-center gap-1">
    {{ name }}
    <button type="button" class="btn-close btn-close-white" :aria-label="`Remove ${name}`" @click="emit('remove')" />
  </span>
</template>

<style scoped>
.btn-close { width: 0.4rem; height: 0.4rem; }
</style>
