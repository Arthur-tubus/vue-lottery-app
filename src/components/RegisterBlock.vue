<script setup lang="ts">
import { ref } from 'vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import type { ParticipantInput } from '@/types/participant'

defineProps<{ emailTaken: (email: string) => boolean }>()
const emit = defineEmits<{ save: [values: ParticipantInput] }>()

const form = ref<InstanceType<typeof ParticipantForm> | null>(null)

function onSubmit(values: ParticipantInput): void {
  emit('save', values)
  form.value?.reset()
}
</script>

<template>
  <section class="card card-body">
    <h2 class="h6 fw-bold text-uppercase mb-0">Register form</h2>
    <p class="text-body-tertiary mb-4">Please fill in all the fields.</p>
    <ParticipantForm ref="form" :email-taken="emailTaken" @submit="onSubmit" />
  </section>
</template>
