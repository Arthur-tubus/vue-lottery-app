<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLElement | null>(null)

// Фокус у вікні, щоб працював Esc
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    await nextTick()
    dialog.value?.focus()
  },
)
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div ref="dialog" class="card modal-card" tabindex="-1" role="dialog" aria-modal="true" @keydown.esc="emit('close')">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="h6 mb-0">{{ title }}</h2>
          <button type="button" class="btn-close" aria-label="Close" @click="emit('close')" />
        </div>
        <div class="card-body"><slot /></div>
        <div v-if="$slots.footer" class="card-footer d-flex justify-content-end gap-2"><slot name="footer" /></div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgb(0 0 0 / 45%);
}
.modal-card { width: 100%; max-width: 480px; outline: none; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-active .modal-card, .modal-fade-leave-active .modal-card { transition: transform 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-card, .modal-fade-leave-to .modal-card { transform: translateY(-16px); }
@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active, .modal-fade-leave-active, .modal-card { transition: none !important; }
}
</style>
