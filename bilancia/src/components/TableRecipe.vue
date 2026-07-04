<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Preparation, getPercentage } from "../composables/usePreparation";
import BaseBtn from "./BaseBtn.vue";
const { t } = useI18n();
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
              {{ t("table.ingredient") }}
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              {{ t("table.required") }}
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              {{ t("table.added") }}
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
            >
              {{ t("table.poured") }}
            </th>
            <th
              scope="col"
              class="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              v-if="showActions"
            >
              {{ t("table.action") }}
            </th>
          </tr>
        </thead>
        <tbody id="recipe-table-body" class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(ingredient, index) in preparation.ingredients"
            :key="index"
            :class="
              index === step
                ? '!border-l-4 !border-teal-500 !border-t-transparent bg-teal-50'
                : ''
            "
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
              <BaseBtn
                variant="primary"
                size="xs"
                @click.stop="$emit('measure-alone', index)"
              >
                {{ t("table.measure") }}
              </BaseBtn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="css">
.current-ingredient-row {
  border-left: 5px solid #059669 !important;
}
progress::-webkit-progress-bar {
  background-color: #e5e7eb;
}
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
  background-color: #e5e7eb;
}
</style>
