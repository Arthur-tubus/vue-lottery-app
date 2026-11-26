<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const emit = defineEmits<{ 'filter-by-name': [name: string] }>()
const query = ref('')
let timer: ReturnType<typeof setTimeout> | undefined

// debounce 300 мс
watch(query, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('filter-by-name', value), 300)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <input v-model="query" class="form-control mb-3" type="search" placeholder="Search by name" />
</template>
