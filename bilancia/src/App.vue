<script setup lang="ts">
import { ref, computed, watch } from "vue";
import NavBar from "./components/NavBar.vue";
import MainWeight from "./components/MainWeight.vue";
import Recipe from "./components/Recipe.vue";
import "./index.css";
import TableRecipe from "./components/TableRecipe.vue";
import ModaHistory from "./components/ModaHistory.vue";
import ModalClean from "./components/ModalClean.vue";
import ModalImport from "./components/ModalImport.vue";
import ModalQuantity from "./components/ModalQuantity.vue";
import ModalManage from "./components/ModalManage.vue";
import { useWeight } from "./composables/useWeight.ts";
import { useRecipes } from "./composables/useRecipes.ts";
import { usePreparation } from "./composables/usePreparation.ts";
const openHistory = ref(false);
const openImport = ref(false);
const openExport = ref(false);
const openManage = ref(false);
const openClean = ref(false);
const openQuantity = ref(false);
const selectRecipe = ref("");
const quantity = ref<number | null>(null);
const recipe = computed(() => {
  const recipe = recipes[selectRecipe.value];
  if (!recipe) {
    return;
  }
  return recipe;
});
const activeMain = computed(
  () =>
    !(
      openHistory.value ||
      openImport.value ||
      openExport.value ||
      openManage.value ||
      openClean.value ||
      openQuantity.value
    ),
);
const { weight } = useWeight(activeMain);
const { recipes } = useRecipes();
const {
  preparation,
  currentStep,
  step,
  total,
  startRecipe,
  onUpdate,
  setStep,
  next,
} = usePreparation();

watch(weight, (newWeight) => {
  onUpdate(newWeight);
});

const openQuantityModal = () => {
  if (!recipe.value) {
    return;
  }
  openQuantity.value = true;
};
const startPreparation = () => {
  if (!recipe.value) {
    return;
  }
  if (!quantity.value) {
    return;
  }
  console.log(quantity);

  startRecipe(recipe.value, quantity.value);
  openClean.value = false;
};
const onConfirmQuantity = () => {
  openClean.value = true;
  openQuantity.value = false;
};
</script>

<template>
  <body class="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
    <nav-bar
      @click-history="openHistory = true"
      @click-import-csv="openImport = true"
      @click-export-csv="openExport = true"
      @click-manage="openManage = true"
    ></nav-bar>
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900">
          Sistema di Dosaggio Intelligente {{ quantity }}
        </h1>
        <p class="text-gray-500">
          Guida passo-passo per le tue ricette.
          <span class="font-bold">Inserimento peso in Kg.</span>
        </p>
      </header>
      <ModaHistory
        :active="openHistory"
        @close-modal="openHistory = false"
      ></ModaHistory>
      <ModalClean
        :active="openClean"
        @close-modal="openClean = false"
        @confirm="startPreparation"
      ></ModalClean>
      <ModalImport
        :active="openImport"
        @close-modal="openImport = false"
      ></ModalImport>
      <ModalManage
        :active="openManage"
        @close-modal="openManage = false"
      ></ModalManage>
      <ModalQuantity
        :active="openQuantity"
        :recipe="recipe"
        v-model="quantity"
        @close-modal="openQuantity = false"
        @confirm="onConfirmQuantity"
      ></ModalQuantity>

      <main-weight
        :ingredient="currentStep"
        :preparation="preparation"
        :step="step"
        @next="next"
      ></main-weight>
      <recipe
        :recipes="recipes"
        v-model="selectRecipe"
        :total="total"
        :taraWeight="preparation.tareWeight"
        @start="openQuantityModal"
      ></recipe>
      <table-recipe
        :preparation="preparation"
        :step="step"
        @select="setStep"
      ></table-recipe>
    </div>
  </body>
</template>

<style scoped></style>
