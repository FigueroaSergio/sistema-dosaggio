<script setup>
import Modal from "./Modal.vue";

const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal :active="active">
    <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Quantità Desiderata</h2>
      <p class="text-gray-600 mb-6">
        Inserisci la quantità in grammi che desideri preparare:
      </p>
      <div class="mb-6">
        <label
          for="desired-quantity-input"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Quantità (g)
        </label>
        <input
          id="desired-quantity-input"
          type="number"
          min="1"
          step="0.1"
          placeholder="es. 500"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
        />
      </div>
      <div
        id="recipe-info"
        class="bg-blue-50 p-3 rounded-lg mb-6 text-sm text-blue-900"
      >
        <!-- Calcolata dinamicamente -->
      </div>
      <div class="flex gap-3">
        <button
          id="cancel-quantity-btn"
          class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
        >
          Annulla
        </button>
        <button
          id="confirm-quantity-btn"
          class="flex-1 px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-150"
        >
          Conferma
        </button>
      </div>
    </div>
  </Modal>
</template>
