<script setup lang="ts">
import { useId } from 'vue'

defineProps<{ label?: string; type?: string; placeholder?: string; error?: string; max?: string }>()
const emit = defineEmits<{ blur: [] }>()
const model = defineModel<string>({ required: true })
const id = useId()
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label fw-semibold mb-1">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :max="max"
      @blur="emit('blur')"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
