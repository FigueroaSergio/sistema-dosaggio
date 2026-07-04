<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  IngredientPreparation,
  Preparation,
  getPercentage,
} from "../composables/usePreparation";
import BaseBtn from "./BaseBtn.vue";
const { t } = useI18n();
const emit = defineEmits<{
  (e: "re-calc" | "next" | "finish" | "azzera" | "pause"): void;
}>();

const handleAction = (
  e: Event,
  action: "next" | "re-calc" | "finish" | "azzera" | "pause",
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
const totalWeightSoFar = computed(() => {
  const onScaleWeight = props.preparation.ingredients.reduce(
    (sum, ing) => sum + (ing.separatelyMeasured ? 0 : ing.weight),
    0,
  );
  return (
    onScaleWeight +
    props.ingredient.grams -
    (props.ingredient.separatelyMeasured ? 0 : props.ingredient.weight) +
    props.preparation.tareWeight
  );
});
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
          >{{ t("weight.unit") }}</span
        >
      </div>

      <!-- Small Instruction/Target Text -->
      <div class="flex flex-wrap mt-2 justify-between w-full">
        <div
          id="target-weight-display"
          class="text-gray-700 text-lg relative z-10"
        >
          <template v-if="step < 0">
            {{ t("weight.containerWeight") }}
          </template>
          <template v-else>
            {{ preparation.ingredients[step].name }}:<br />
            <span class="text-6xl font-semibold">
              {{ preparation.ingredients[step].grams.toFixed(0) }}
              {{ t("weight.unit") }}</span
            >
          </template>
        </div>

        <div v-if="step >= 0" class="text-gray-700 text-lg relative z-10">
          {{ t("weight.grossWeight") }}<br />
          <span class="text-6xl font-semibold"
            >{{ totalWeightSoFar.toFixed(0) }} {{ t("weight.unit") }}</span
          >
        </div>
      </div>
    </div>

    <!-- INSTRUCCIÓN ACTUAL -->
    <div
      class="bg-teal-50 border-l-4 border-teal-500 p-4 mt-4 rounded-md"
      v-if="!preparation.name"
    >
      <p id="current-instruction" class="text-teal-800 font-medium">
        {{ t("weight.selectRecipe") }}
      </p>
    </div>

    <!-- ACCIONES DE PREPARACIÓN -->
    <div id="prep-actions" class="flex flex-wrap gap-1 pt-2 justify-center">
      <template v-if="preparation.name">
        <BaseBtn
          id="recalc-btn"
          variant="warning"
          size="lg"
          :title="t('weight.recalcTooltip')"
          class="w-full max-w-xs sm:max-w-[200px]"
          @click="handleAction($event, 're-calc')"
        >
          {{ t("weight.recalculate") }}
        </BaseBtn>
        <BaseBtn
          id="pause-btn"
          variant="info"
          size="lg"
          :title="t('weight.pauseTooltip')"
          class="w-full max-w-xs sm:max-w-[200px]"
          @click="handleAction($event, 'pause')"
        >
          {{ t("weight.pause") }}
        </BaseBtn>
        <BaseBtn
          id="next-ingredient-btn"
          variant="success"
          size="lg"
          block
          :title="t('weight.nextTooltip')"
          class="flex-1"
          @click="handleAction($event, 'next')"
        >
          {{ t("weight.continue") }}
        </BaseBtn>

        <BaseBtn
          id="finish-btn"
          variant="primary"
          size="lg"
          :title="t('weight.recalcTooltip')"
          class="w-full max-w-xs sm:max-w-[200px]"
          v-if="finish"
          @click="handleAction($event, 'finish')"
        >
          {{ t("weight.complete") }}
        </BaseBtn>
      </template>
    </div>
  </div>
</template>
<style lang="css"></style>
