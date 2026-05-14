<script setup lang="ts">
import { Preparation, getPercentage } from "../composables/usePreparation";
defineEmits<{ (e: "select", idx: number): void }>();
defineProps<{ preparation: Preparation; step: number }>();
</script>
<template>
  <div class="bg-white shadow-lg rounded-xl">
    <h2
      id="prep-title"
      class="text-xl font-bold text-white bg-teal-600 p-2 rounded-t-xl"
    >
      {{ preparation.name ? preparation.name : "Dettaglio della Ricetta" }}
    </h2>

    <div class="overflow-x-auto rounded-b-xl">
      <table id="recipe-table" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ingrediente
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              Richiesto (g)
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              Peso Aggiunto (g)
            </th>
            <!-- <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Progresso
            </th> -->
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              % Versato
            </th>
          </tr>
        </thead>
        <tbody id="recipe-table-body" class="bg-white divide-y divide-gray-200">
          <!-- Filas de ingredientes se insertarán aquí -->
          <tr
            v-for="(ingredient, index) in preparation.ingredients"
            :key="index"
            :class="index === step ? 'current-ingredient-row' : ''"
            @click="$emit('select', index)"
          >
            <td
              class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ ingredient.name }}
            </td>
            <td
              class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center"
            >
              {{ ingredient.grams.toFixed(2) }} g
            </td>
            <td
              class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold text-center"
            >
              {{ ingredient.weight.toFixed(2) }} g
            </td>
            <!-- <td class="px-4 py-3 whitespace-nowrap">
              <progress
                :value="getPercentage(ingredient)"
                max="100"
                class="w-full bar-color-black"
              ></progress>
            </td> -->
            <td
              class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 progress-color-black text-center"
            >
              {{ getPercentage(ingredient).toFixed(0) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="css">
.current-ingredient-row {
  background-color: #f0fdf4 !important; /* Green 50 */
  border-left: 5px solid #059669 !important; /* Green 600 */
}
progress::-webkit-progress-bar {
  background-color: #e5e7eb;
}
/* Progress value color defined by JS */
progress::-webkit-progress-value {
  border-radius: 5px;
  transition: background-color 0.3s;
}
progress::-moz-progress-bar {
  border-radius: 5px;
  transition: background-color 0.3s;
}
progress {
  transition: width 0.3s ease-in-out;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  background-color: #e5e7eb; /* Gray 200 */
}
</style>
