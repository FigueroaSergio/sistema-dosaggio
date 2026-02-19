<script setup>
import Modal from "./Modal.vue";
const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal :active="active" title="📋 Storico Preparazioni">
    <div>
      <div id="history-list" class="max-h-96 overflow-y-auto">
        <!-- Preparazioni caricate dinamicamente -->
      </div>

      <div class="mt-6">
        <button
          id="close-history-btn"
          class="w-full px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-150"
          @click="$emit('close-modal')"
        >
          Chiudi
        </button>
      </div>
    </div>
  </Modal>
</template>
