<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import ParticipantsTable from '@/components/ParticipantsTable.vue'
import RegisterBlock from '@/components/RegisterBlock.vue'
import SearchBar from '@/components/SearchBar.vue'
import WinnersBlock from '@/components/WinnersBlock.vue'
import type { Participant, ParticipantInput, SortDir, SortKey } from '@/types/participant'

const STORAGE_KEY = 'lottery-participants'
const MAX_WINNERS = 3

function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? (data as Participant[]) : []
  } catch {
    return []
  }
}

const participants = ref<Participant[]>(loadParticipants())
const winnerIds = ref<string[]>([])
const nameFilter = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDir = ref<SortDir>('asc')
const editing = ref<Participant | null>(null)
const removing = ref<Participant | null>(null)

watch(participants, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => p !== undefined),
)
const candidates = computed(() => participants.value.filter((p) => !winnerIds.value.includes(p.id)))
const canDraw = computed(() => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0)

// Спочатку фільтр, потім сортування копії — вихідний список не змінюється
const visibleParticipants = computed(() => {
  const query = nameFilter.value.trim().toLowerCase()
  const filtered = participants.value.filter((p) => p.name.toLowerCase().includes(query))
  const key = sortKey.value
  if (!key) return filtered
  const factor = sortDir.value === 'asc' ? 1 : -1
  return [...filtered].sort((a, b) => a[key].localeCompare(b[key]) * factor)
})

function isEmailTaken(email: string, excludeId?: string): boolean {
  const normalized = email.trim().toLowerCase()
  return participants.value.some((p) => p.id !== excludeId && p.email.toLowerCase() === normalized)
}

function addParticipant(values: ParticipantInput): void {
  participants.value.push({ id: crypto.randomUUID(), ...values })
}

function updateParticipant(values: ParticipantInput): void {
  const target = participants.value.find((p) => p.id === editing.value?.id)
  if (target) Object.assign(target, values)
  editing.value = null
}

function confirmRemove(): void {
  const target = removing.value
  if (target) {
    participants.value = participants.value.filter((p) => p.id !== target.id)
    winnerIds.value = winnerIds.value.filter((id) => id !== target.id)
  }
  removing.value = null
}

function drawWinner(): void {
  if (!canDraw.value) return
  const pick = candidates.value[Math.floor(Math.random() * candidates.value.length)]
  if (pick) winnerIds.value.push(pick.id)
}

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
</script>

<template>
  <main class="container py-5" style="max-width: 820px">
    <div class="d-grid gap-3">
      <WinnersBlock
        :winners="winners"
        :can-draw="canDraw"
        @draw="drawWinner"
        @remove="(id) => (winnerIds = winnerIds.filter((w) => w !== id))"
      />
      <RegisterBlock :email-taken="(email) => isEmailTaken(email)" @save="addParticipant" />
      <section class="card card-body">
        <SearchBar @filter-by-name="(name) => (nameFilter = name)" />
        <ParticipantsTable
          :participants="visibleParticipants"
          :sort-key="sortKey"
          :sort-dir="sortDir"
          @sort="toggleSort"
          @edit="(p) => (editing = p)"
          @remove="(p) => (removing = p)"
        />
      </section>
    </div>

    <BaseModal :open="editing !== null" title="Редагування учасника" @close="editing = null">
      <ParticipantForm
        v-if="editing"
        :initial="editing"
        :email-taken="(email) => isEmailTaken(email, editing?.id)"
        submit-label="Оновити дані"
        @submit="updateParticipant"
      />
    </BaseModal>

    <BaseModal :open="removing !== null" title="Видалення учасника" @close="removing = null">
      <p v-if="removing" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ removing.name }}", "{{ removing.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmRemove">Так</BaseButton>
        <BaseButton variant="secondary" @click="removing = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
