<script setup lang="ts">
import { computed } from "vue";
import {
  IngredientPreparation,
  Preparation,
  getPercentage,
} from "../composables/usePreparation";
const emit = defineEmits<{
  (e: "re-calc" | "next" | "finish" | "save-recipe" | "azzera" | "pause"): void;
}>();

const handleAction = (
  e: Event,
  action: "next" | "re-calc" | "finish" | "azzera" | "pause" | "save-recipe",
) => {
  emit(action);
  if (e.target instanceof HTMLElement) {
    e.target.blur();
  }
};
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
const totalWeightSoFar = computed(
  () =>
    props.preparation.ingredients.reduce((sum, ing) => sum + ing.weight, 0) +
    props.ingredient.grams -
    props.ingredient.weight +
    props.preparation.tareWeight,
);
</script>
<template>
  <div
    id="main-status-card"
    class="bg-white shadow-xl rounded-xl p-2 mb-2 border border-teal-200"
  >
    <!-- DISPLAY PRINCIPAL -->
    <div class="flex flex-col items-center justify-center py-2 relative">
      <!-- Main Weight Display -->
      <div class="flex items-end justify-center relative w-full">
        <div
          id="main-progress-bar-container"
          class="absolute inset-0 flex items-center overflow-hidden rounded"
        >
          <progress
            id="main-progress-bar"
            :value="getPercentage(ingredient)"
            max="100"
            class="w-full bar-color-black"
            style="height: 100%"
          ></progress>
        </div>
        <span
          id="added-weight-display"
          class="font-semibold transition-colors duration-300 text-7xl relative z-10 py-2"
          style="
            color: rgb(31, 41, 55);
            text-shadow:
              0 0 4px #fff,
              0 0 8px #fff,
              0 0 16px rgba(255, 255, 255, 0.9),
              0 0 24px rgba(255, 255, 255, 0.6);
          "
          >{{ ingredient.weight.toFixed(0) }}
        </span>
        <span
          class="text-3xl ml-2 mb-2 relative z-10"
          style="
            color: rgb(31, 41, 55);
            text-shadow:
              0 0 4px #fff,
              0 0 8px #fff,
              0 0 16px rgba(255, 255, 255, 0.9),
              0 0 24px rgba(255, 255, 255, 0.6);
          "
          >g</span
        >
      </div>

      <!-- Small Instruction/Target Text -->
      <div class="flex flex-wrap mt-2 justify-between w-full">
        <div
          id="target-weight-display"
          class="text-gray-700 text-lg relative z-10"
        >
          <template v-if="step < 0"> Peso del Contenitore </template>
          <template v-else>
            {{ preparation.ingredients[step].name }}:<br />
            <span class="text-6xl font-semibold">
              {{ preparation.ingredients[step].grams.toFixed(0) }} g</span
            >
          </template>
        </div>

        <div v-if="step >= 0" class="text-gray-700 text-lg relative z-10">
          Peso Lordo da aggiungere:<br />
          <span class="text-6xl font-semibold"
            >{{ totalWeightSoFar.toFixed(0) }} g</span
          >
        </div>
      </div>

      <!-- Percentage text below -->
      <!-- <p
        id="main-progress-percent"
        class="text-sm font-medium text-gray-500 text-center mt-1 progress-color-black relative z-10"
        v-if="step >= 0"
      >
        {{ getPercentage(ingredient).toFixed(0) }}% Versato
      </p> -->
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
    <div id="prep-actions" class="flex flex-wrap gap-1 pt-2 justify-center">
      <template v-if="preparation.name">
        <button
          v-if="step < 0"
          id="azzera-btn"
          class="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          @click="handleAction($event, 'azzera')"
          title="Azzera la tara"
        >
          Azzera
        </button>

        <button
          id="recalc-btn"
          class="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
          @click="handleAction($event, 're-calc')"
        >
          Ricalcola
        </button>
        <button
          id="pause-btn"
          class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          title="Sospendi la preparazione attuale per riprenderla più tardi"
          @click="handleAction($event, 'pause')"
        >
          Sospendi
        </button>
        <button
          id="next-ingredient-btn"
          class="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          @click="handleAction($event, 'next')"
          title="Passa all'ingrediente successivo"
        >
          {{ step < 0 ? "Tara" : "Continua" }}
        </button>

        <button
          id="finish-btn"
          class="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
          title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
          v-if="finish"
          @click="handleAction($event, 'finish')"
        >
          Completa
        </button>
      </template>
    </div>
  </div>
</template>
<style lang="css"></style>
