<script setup lang="ts">
import { computed } from "vue";
import {
  IngredientPreparation,
  Preparation,
  getPercentage,
} from "../composables/usePreparation";
defineEmits<{ (e: "re-calc"): void; (e: "next"): void; (e: "finish"): void }>();
const props = defineProps<{
  ingredient: IngredientPreparation;
  preparation: Preparation;
  step: number;
}>();
const finish = computed(
  () =>
    props.preparation.ingredients.length - 1 === props.step ||
    props.preparation.ingredients.every((ing) => ing.weight !== 0),
);
</script>
<template>
  <div
    id="main-status-card"
    class="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-200"
  >
    <!-- DISPLAY PRINCIPAL -->
    <div class="flex flex-col items-center justify-center py-4">
      <!-- Main Weight Display -->
      <div class="flex items-end">
        <span
          id="added-weight-display"
          class="font-semibold text-gray-800 transition-colors duration-300 text-7xl"
          >{{ ingredient.weight }}
        </span>
        <span class="text-3xl text-gray-500 ml-2 mb-2">g</span>
      </div>

      <!-- Small Instruction/Target Text -->
      <p
        id="target-weight-display"
        class="text-center text-gray-700 font-semibold text-lg"
      >
        <template v-if="step < 0">
          Peso netto (Peso lordo - Tara precedente)
        </template>
        <template v-else>
          {{ preparation.ingredients[step].name }}:
          {{ preparation.ingredients[step].grams.toFixed(2) }} g
        </template>
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
      <template v-if="preparation.name">
        <button
          id="next-ingredient-btn"
          class="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          @click="$emit('next')"
        >
          Ingrediente Successivo
        </button>
        <button
          id="recalc-btn"
          class="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
          @click="$emit('re-calc')"
        >
          Ricalcola Quantità
        </button>
        <button
          id="finish-btn"
          class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
          v-if="finish"
          @click="$emit('finish')"
        >
          Completa Ricetta
        </button>
      </template>
    </div>
  </div>
</template>
<style lang="css"></style>
