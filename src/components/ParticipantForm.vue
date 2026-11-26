<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { ParticipantInput } from '@/types/participant'
import { todayIso, validate } from '@/utils/validation'

const props = withDefaults(
  defineProps<{ initial?: ParticipantInput; emailTaken?: (email: string) => boolean; submitLabel?: string }>(),
  { initial: undefined, emailTaken: () => false, submitLabel: 'Save' },
)
const emit = defineEmits<{ submit: [values: ParticipantInput] }>()

type Field = keyof ParticipantInput
const fields: Field[] = ['name', 'birthDate', 'email', 'phone']
const emptyValues = (): ParticipantInput => ({ name: '', birthDate: '', email: '', phone: '' })

const values = reactive<ParticipantInput>({ ...emptyValues(), ...props.initial })
const touched = reactive<Record<Field, boolean>>({ name: false, birthDate: false, email: false, phone: false })
const errors = computed(() => validate(values, props.emailTaken))

function errorFor(field: Field): string | undefined {
  return touched[field] ? errors.value[field] : undefined
}

function submit(): void {
  fields.forEach((field) => (touched[field] = true))
  if (Object.keys(errors.value).length > 0) return
  emit('submit', {
    name: values.name.trim(),
    birthDate: values.birthDate,
    email: values.email.trim(),
    phone: values.phone.trim(),
  })
}

// Очищення без спрацювання валідації: скидаємо і значення, і touched
function reset(): void {
  Object.assign(values, emptyValues())
  fields.forEach((field) => (touched[field] = false))
}

defineExpose({ reset })
</script>

<template>
  <div @keyup.enter="submit">
    <BaseInput v-model="values.name" label="Name" placeholder="Enter user name" :error="errorFor('name')" @blur="touched.name = true" />
    <BaseInput v-model="values.birthDate" label="Date of Birth" type="date" :max="todayIso()" :error="errorFor('birthDate')" @blur="touched.birthDate = true" />
    <BaseInput v-model="values.email" label="Email" type="email" placeholder="Enter email" :error="errorFor('email')" @blur="touched.email = true" />
    <BaseInput v-model="values.phone" label="Phone number" type="tel" placeholder="+380XXXXXXXXX" :error="errorFor('phone')" @blur="touched.phone = true" />
    <div class="text-end mt-4">
      <BaseButton @click="submit">{{ submitLabel }}</BaseButton>
    </div>
  </div>
</template>
