import type { ParticipantInput } from '@/types/participant'

export type FormErrors = Partial<Record<keyof ParticipantInput, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^\+380\d{9}$/
const REQUIRED = 'This value is required.'

export function todayIso(): string {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function validate(values: ParticipantInput, emailTaken: (email: string) => boolean): FormErrors {
  const errors: FormErrors = {}
  const email = values.email.trim()

  if (!values.name.trim()) errors.name = REQUIRED

  if (!values.birthDate) errors.birthDate = REQUIRED
  else if (values.birthDate > todayIso()) errors.birthDate = 'Date of birth cannot be in the future.'

  if (!email) errors.email = REQUIRED
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.'
  else if (emailTaken(email)) errors.email = 'A participant with this email already exists.'

  if (!values.phone.trim()) errors.phone = REQUIRED
  else if (!PHONE_RE.test(values.phone.trim())) errors.phone = 'Use the format +380XXXXXXXXX.'

  return errors
}
