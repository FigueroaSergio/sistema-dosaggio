<script setup lang="ts">
import {
  IngredientPreparation,
  Preparation,
  getPercentage,
} from "../composables/usePreparation";
defineEmits<{ (e: "re-calc"): void; (e: "next"): void }>();
const props = defineProps<{
  ingredient: IngredientPreparation;
  preparation: Preparation;
  step: number;
}>();
</script>
<template>
  <div
    id="main-status-card"
    class="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-200"
  >
    <h2 class="text-lg font-semibold text-gray-700 mb-3">
      Peso Netto Aggiunto
    </h2>

    <!-- DISPLAY PRINCIPAL -->
    <div class="flex flex-col items-center justify-center py-4">
      <!-- Main Weight Display -->
      <div class="flex items-end">
        <span
          id="added-weight-display"
          class="weight-main-display text-gray-800 transition-colors duration-300 text-3xl"
          >{{ ingredient.weight }}
        </span>
        <span class="text-3xl text-gray-500 ml-2 mb-2">g</span>
      </div>

      <!-- Small Instruction/Target Text -->
      <p
        id="target-weight-display"
        class="text-center text-sm text-gray-400 font-semibold"
      >
        Peso netto (Peso lordo - Tara precedente) {{ ingredient }}
      </p>

      <!-- Current Ingredient Progress Bar -->
      <div
        id="main-progress-bar-container"
        class="w-full mt-4"
        v-if="step >= 0"
      >
        <progress
          id="main-progress-bar"
          :value="getPercentage(ingredient)"
          max="100"
          class="w-full bar-color-black"
        ></progress>
        <p
          id="main-progress-percent"
          class="text-sm font-medium text-gray-500 text-center mt-1 progress-color-black"
        >
          {{ getPercentage(ingredient).toFixed(0) }}% Versato
        </p>
      </div>
    </div>

    <!-- INSTRUCCIÓN ACTUAL -->
    <div
      class="bg-teal-50 border-l-4 border-teal-500 p-4 mt-4 rounded-md"
      v-if="!preparation.name"
    >
      <p id="current-instruction" class="text-teal-800 font-medium">
        👋 Seleziona una ricetta per iniziare la preparazione.
      </p>
    </div>

    <!-- ACCIONES DE PREPARACIÓN -->
    <div id="prep-actions" class="flex gap-4 mt-6 justify-center">
      <button
        id="next-ingredient-btn"
        class="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
        v-if="preparation.name"
        @click="$emit('next')"
      >
        Ingrediente Successivo
      </button>
      <button
        id="recalc-btn"
        class="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
        title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
        v-if="preparation.name"
        @click="$emit('re-calc')"
      >
        Ricalcola Quantità
      </button>
    </div>
  </div>
</template>
<style lang="css">
.weight-main-display {
  font-family: "Inter", sans-serif;
  font-size: 4rem !important;
  font-weight: 800;
}
</style>
