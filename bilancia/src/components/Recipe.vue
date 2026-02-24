<script setup lang="ts">
import { RecipeRegistry } from "../composables/useRecipes.ts";
const model = defineModel<string>({ required: true });
const { recipes } = defineProps<{
  recipes: RecipeRegistry;
  total: number;
  taraWeight: number;
}>();
const emit = defineEmits<{
  (e: "start"): void;
}>();
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
    <!-- CARD 1: SELECCIÓN -->
    <div class="lg:col-span-1 bg-white shadow-lg rounded-xl p-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Ricetta</h3>
      <select
        id="recipe-selector"
        v-model="model"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
      >
        <option disabled value="">-- Seleziona una ricetta --</option>
        <option
          v-for="recipe in Object.keys(recipes)"
          :value="recipe"
          :key="recipe"
        >
          {{ recipe }}
        </option>
      </select>
      <button
        id="start-prep-btn"
        class="w-full mt-4 p-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-150"
        @click="$emit('start')"
      >
        Inizia
      </button>
    </div>

    <!-- CARD 2 & 3: ESTADO DE PESOS DE REFERENCIA -->
    <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-gray-100 p-4 rounded-lg sm:col-span-2">
        <p class="text-sm font-medium text-gray-500">Peso Lordo (Kg)</p>
        <span id="raw-weight" class="text-4xl font-extrabold text-gray-800"
          >{{ total.toFixed(2) }} g</span
        >
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <p class="text-sm font-medium text-gray-500">Tara (Contenitore)</p>
        <span id="tare-weight" class="text-2xl font-bold text-gray-800"
          >{{ taraWeight.toFixed(2) }} g</span
        >
      </div>
    </div>
  </div>
</template>
