<script setup>
import Modal from "./Modal.vue";
const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal :active="active" title="✏️ Gestisci Ricette">
    <div>
      <!-- Sezione per creare/modificare ricetta -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Crea o Modifica Ricetta
        </h3>
        <div class="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Ricetta
            </label>
            <input
              id="recipe-name-input"
              type="text"
              placeholder="es. Pane Integrale"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
            />
            <div
              id="recipe-name-error"
              class="error-message"
              style="display: none"
            >
              ⚠️ Nome ricetta obbligatorio
            </div>
          </div>
        </div>

        <!-- Ingredienti -->
        <div id="ingredients-container" class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Ingredienti</h4>
          <div id="ingredients-list"></div>
          <button
            id="add-ingredient-btn"
            class="mt-2 px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition duration-150"
          >
            + Aggiungi Ingrediente
          </button>
        </div>

        <div class="flex gap-3">
          <button
            id="cancel-manage-btn"
            class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
            @click="$emit('close-modal')"
          >
            Annulla
          </button>
          <button
            id="save-recipe-btn"
            class="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-150"
          >
            Salva Ricetta
          </button>
        </div>
      </div>

      <!-- Lista ricette esistenti -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Ricette Esistenti
        </h3>
        <div id="existing-recipes-list" class="max-h-64 overflow-y-auto">
          <!-- Ricette caricate dinamicamente -->
        </div>
      </div>
    </div>
  </Modal>
</template>
