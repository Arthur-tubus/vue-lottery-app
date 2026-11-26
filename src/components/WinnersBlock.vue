<script setup lang="ts">
import type { Participant } from '@/types/participant'
import BaseButton from '@/components/BaseButton.vue'
import WinnerChip from '@/components/WinnerChip.vue'

defineProps<{ winners: Participant[]; canDraw: boolean }>()
const emit = defineEmits<{ draw: []; remove: [id: string] }>()
</script>

<template>
  <section class="card card-body flex-row align-items-center gap-3">
    <div class="form-control d-flex flex-wrap align-items-center gap-2 flex-grow-1">
      <WinnerChip v-for="winner in winners" :key="winner.id" :name="winner.name" @remove="emit('remove', winner.id)" />
      <span class="text-body-tertiary">Winners</span>
    </div>
    <BaseButton :disabled="!canDraw" @click="emit('draw')">New winner</BaseButton>
  </section>
</template>
