<script setup lang="ts">
import { RecipeRegistry } from "../composables/useRecipes.ts";
const { recipes, total, taraWeight } = defineProps<{
  recipes: RecipeRegistry;
  total: number;
  taraWeight: number;
}>();
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <div class="bg-gray-100 p-4 rounded-lg">
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
</template>
