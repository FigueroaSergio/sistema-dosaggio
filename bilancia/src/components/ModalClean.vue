<script setup>
import Modal from "./Modal.vue";
const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal :active="active">
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        ⚠️ Prepara la Bilancia
      </h2>
      <p class="text-gray-600 mb-6">
        Per favore, assicurati che la bilancia sia vuota e pulita. Rimuovi
        qualsiasi elemento o residuo dalla superficie di pesatura.
      </p>
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6"
      >
        <p class="text-yellow-800 font-medium">
          La bilancia deve essere completamente libera prima di iniziare.
        </p>
      </div>
      <button
        id="clean-scale-confirm-btn"
        class="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
      >
        Fatto ✓
      </button>
    </div>
  </Modal>
</template>
