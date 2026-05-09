<script setup lang="ts">
import Modal from "./Modal.vue";

defineProps<{ active: boolean }>();
const emit = defineEmits<{
  (e: "close-modal"): void;
  (e: "confirm", save: boolean): void;
}>();
</script>

<template>
  <Modal :active="active" title="Salva Nuova Ricetta" @close-modal="$emit('close-modal')">
    <div class="p-4 text-center">
      <p class="text-lg text-gray-700 mb-6">
        Vuoi salvare i pesi di questa preparazione come una nuova ricetta?
      </p>
      <div class="flex justify-center flex-wrap gap-4">
        <button 
          @click="$emit('confirm', false)" 
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          No, completa solo
        </button>
        <button 
          @click="$emit('confirm', true)" 
          class="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm"
        >
          Sì, salva ricetta
        </button>
      </div>
    </div>
  </Modal>
</template>
