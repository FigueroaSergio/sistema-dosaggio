<script setup>
import Modal from "./Modal.vue";

const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal :active="active" title="📥 Importa Ricette da CSV">
    <div>
      <div class="mb-6">
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
        />
      </div>
      <div id="csv-import-status" class="text-sm mb-4"></div>
      <div class="flex gap-3">
        <button
          id="cancel-import-btn"
          class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
          @click="$emit('close-modal')"
        >
          Annulla
        </button>
        <button
          id="confirm-import-btn"
          class="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
        >
          Importa
        </button>
      </div>
    </div>
  </Modal>
</template>
