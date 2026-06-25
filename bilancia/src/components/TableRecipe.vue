<script setup lang="ts">
import { Preparation, getPercentage } from "../composables/usePreparation";
defineEmits<{
  (e: "select", idx: number): void;
  (e: "measure-alone", idx: number): void;
}>();
defineProps<{ preparation: Preparation; step: number; showActions: boolean }>();
</script>
<template>
  <div class="bg-white shadow-lg rounded-xl h-full flex flex-col min-h-0">
    <div class="overflow-x-auto rounded-b-xl flex-1 min-h-0 overflow-y-auto">
      <table id="recipe-table" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              class="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ingrediente
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              Richiesto
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              Aggiunto
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              Versato
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              v-if="showActions"
            >
              Azione
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
            class="cursor-pointer"
          >
            <td class="px-2 py-0 text-sm font-medium text-gray-900">
              {{ ingredient.name }}
            </td>
            <td class="px-2 py-0 text-sm text-center">
              {{ ingredient.grams.toFixed(2) }} g
            </td>
            <td
              class="px-2 py-0 text-sm text-gray-700 font-semibold text-center"
            >
              {{ ingredient.weight.toFixed(2) }} g
            </td>
            <td class="px-2 py-0 text-sm progress-color-black text-center">
              {{ getPercentage(ingredient).toFixed(0) }}%
            </td>
            <td class="px-2 py-1 text-center" v-if="showActions">
              <button
                @click.stop="$emit('measure-alone', index)"
                class="px-2 py-2 bg-teal-100 text-teal-700 text-xs font-bold rounded-lg hover:bg-teal-200 transition"
              >
                Misura
              </button>
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
