<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import type { Participant, SortDir, SortKey } from '@/types/participant'

const props = defineProps<{ participants: Participant[]; sortKey: SortKey | null; sortDir: SortDir }>()
const emit = defineEmits<{ sort: [key: SortKey]; edit: [participant: Participant]; remove: [participant: Participant] }>()

function indicator(key: SortKey): string {
  if (props.sortKey !== key) return '↕'
  return props.sortDir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th class="text-body-tertiary">#</th>
          <th>
            <button type="button" class="btn btn-link p-0 text-reset fw-bold text-decoration-none" @click="emit('sort', 'name')">
              Name {{ indicator('name') }}
            </button>
          </th>
          <th>
            <button type="button" class="btn btn-link p-0 text-reset fw-bold text-decoration-none" @click="emit('sort', 'birthDate')">
              Date of Birth {{ indicator('birthDate') }}
            </button>
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th><span class="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(participant, index) in participants" :key="participant.id">
          <td class="text-primary">{{ index + 1 }}</td>
          <td>{{ participant.name }}</td>
          <td>{{ participant.birthDate }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td class="text-end text-nowrap">
            <BaseButton variant="outline-primary" class="btn-sm me-2" @click="emit('edit', participant)">Редагувати дані</BaseButton>
            <BaseButton variant="danger" class="btn-sm" @click="emit('remove', participant)">Видалити учасника</BaseButton>
          </td>
        </tr>
        <tr v-if="participants.length === 0">
          <td colspan="6" class="text-center text-body-tertiary py-3">No participants found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
