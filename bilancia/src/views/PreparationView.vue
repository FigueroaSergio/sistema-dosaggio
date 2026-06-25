<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import MainWeight from "../components/MainWeight.vue";
import RecipeComponent from "../components/Recipe.vue";
import TableRecipe from "../components/TableRecipe.vue";
import ModalClean from "../components/ModalClean.vue";
import ModalQuantity from "../components/ModalQuantity.vue";
import ModalRecipeSelect from "../components/ModalRecipeSelect.vue";
import ModalConfirmSave from "../components/ModalConfirmSave.vue";
import { useWeight } from "../composables/useWeight.ts";
import { useRecipes } from "../composables/useRecipes.ts";
import { Preparation, usePreparation } from "../composables/usePreparation.ts";
import { useHistory } from "../composables/useHistory.ts";
import { usePausedPreparations } from "../composables/usePausedPreparations.ts";
import NavBar from "../components/NavBar.vue";
import ModalPausedRecipes from "../components/ModalPausedRecipes.vue";
import type { Recipe } from "../composables/useRecipes.ts";

const router = useRouter();

const openClean = ref(false);
const openQuantity = ref(false);
const selectRecipe = ref("");
const quantity = ref<number | null>(null);
const openRecipeModal = ref(false);
const openSaveConfirmModal = ref(false);
const openPausedModal = ref(false);
const singleMeasurementSource = ref<{
  preparation: Preparation;
  step: number;
} | null>(null);

const { recipes, addRecipe } = useRecipes();
const recipe = ref<Recipe | null>(null);
const recipeTotal = computed(() =>
  recipe.value
    ? recipe.value.ingredients.reduce((sum, ing) => sum + ing.grams, 0)
    : 0,
);

const activeMain = computed(() => !(openClean.value || openQuantity.value));

const { weight } = useWeight(activeMain);
const {
  preparation,
  currentStep,
  step,
  totalNet,
  startRecipe,
  onUpdate,
  setStep,
  next,
  reCalculate,
  reset,
  loadPreparation,
} = usePreparation();
const { addHistory } = useHistory();
const {
  pausedPreparations,
  pausePreparation,
  getPausedPreparation,
  removePausedPreparation,
} = usePausedPreparations();

onMounted(() => {
  if (!preparation.name) {
    openRecipeModal.value = true;
  }
});

const onRecipeSelected = (name: string) => {
  selectRecipe.value = name;
  openRecipeModal.value = false;
  recipe.value = recipes[selectRecipe.value] || null;
  openQuantityModal();
};

watch(weight, (newWeight) => {
  onUpdate(newWeight);
});

const openQuantityModal = () => {
  if (!recipe.value) {
    return;
  }
  quantity.value = recipeTotal.value;
  openQuantity.value = true;
};

const startPreparation = () => {
  if (!recipe.value) {
    return;
  }
  if (!quantity.value) {
    return;
  }

  startRecipe(recipe.value, quantity.value);
  openClean.value = false;
};

const onConfirmQuantity = () => {
  openClean.value = true;
  openQuantity.value = false;
};

const onFinish = () => {
  if (singleMeasurementSource.value) {
    const { preparation: sourcePreparation, step: sourceStep } =
      singleMeasurementSource.value;
    const measuredWeight = preparation.ingredients[0]?.weight || 0;

    const updatedIngredients = sourcePreparation.ingredients.map((ing, idx) =>
      idx === sourceStep
        ? { ...ing, weight: measuredWeight, separatelyMeasured: true }
        : ing,
    );

    const nextStep = Math.min(
      sourceStep + 1,
      sourcePreparation.ingredients.length - 1,
    );
    loadPreparation(
      { ...sourcePreparation, ingredients: updatedIngredients },
      nextStep,
    );
    singleMeasurementSource.value = null;
    return;
  }
  openSaveConfirmModal.value = true;
};

const handleSaveConfirm = async (saveRecipe: boolean) => {
  try {
    await addHistory(preparation);

    if (saveRecipe) {
      savePreparationAsRecipe();
    }
  } catch (e) {
    console.log("ERROR", e);
  } finally {
    selectRecipe.value = "";
    quantity.value = null;
    openSaveConfirmModal.value = false;
    openRecipeModal.value = true;
  }
};
const savePreparationAsRecipe = () => {
  if (
    !preparation ||
    !preparation.name ||
    preparation.ingredients.length === 0
  ) {
    alert("Nessuna preparazione attiva da salvare.");
    return;
  }

  const timestamp = new Date().toLocaleString();
  const newName = `${preparation.name} - ${timestamp}`;

  const newIngredients = preparation.ingredients.map((ing) => ({
    name: ing.name,
    grams: ing.grams, // Salviamo le quantità target scalate
    tolerance: ing.tolerance || 0,
  }));

  addRecipe(newName, {
    name: newName,
    note: preparation.note,
    ingredients: newIngredients,
  });

  alert(`Ricetta "${newName}" salvata con successo!`);
};

const onPause = async () => {
  if (!preparation.name) return;
  await pausePreparation(preparation, step.value);
  reset();
  selectRecipe.value = "";
  quantity.value = null;
  openRecipeModal.value = true;
};

const onSelectPaused = async (id: string) => {
  const paused = getPausedPreparation(id);
  if (paused) {
    if (preparation.name) {
      await pausePreparation(preparation, step.value);
    }
    loadPreparation(paused.preparation, paused.step);
    await removePausedPreparation(id);
    openPausedModal.value = false;
  }
};

const goHome = async () => {
  if (!preparation.name) {
    router.push("/");
    return;
  }
  try {
    if (singleMeasurementSource.value) {
      await pausePreparation(
        singleMeasurementSource.value?.preparation,
        singleMeasurementSource.value?.step,
      );
    } else {
      await pausePreparation(preparation, step.value);
    }
  } catch (e) {
    console.log("ERROR saving preparation");
  }
  {
    reset();
    router.push("/");
  }
};

const handleMeasureAlone = (index: number) => {
  const ingredient = preparation.ingredients[index];
  singleMeasurementSource.value = {
    preparation: { ...preparation },
    step: index,
  };

  const tempRecipe: Recipe = {
    name: `Misura: ${ingredient.name}`,
    note: "",
    ingredients: [{ ...ingredient }],
  };
  selectRecipe.value = tempRecipe.name;
  quantity.value = ingredient.grams;
  recipe.value = tempRecipe;
  startRecipe(tempRecipe, ingredient.grams);
  openClean.value = true;
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen font-sans flex flex-col">
    <NavBar title="Inizia Ricetta">
      <template #actions>
        <button
          v-if="pausedPreparations.length > 0"
          @click="openPausedModal = true"
          class="px-4 py-2 border border-indigo-600 text-indigo-600 bg-white font-medium rounded-lg hover:bg-indigo-50 transition shadow-sm"
        >
          Riprendi ({{ pausedPreparations.length }})
        </button>
        <button
          @click="openRecipeModal = true"
          class="px-4 py-2 border border-teal-600 text-teal-600 bg-white font-medium rounded-lg hover:bg-teal-50 transition shadow-sm"
        >
          Cerca Ricetta
        </button>
        <button
          @click="goHome"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          Home
        </button>
      </template>
    </NavBar>

    <div
      class="flex-1 max-w-4xl md:max-w-7xl mx-auto w-full p-1 lg:p-2 flex flex-col min-h-0"
    >
      <ModalClean
        :active="openClean"
        @close-modal="openClean = false"
        @confirm="startPreparation"
      ></ModalClean>
      <ModalQuantity
        v-if="recipe"
        :active="openQuantity"
        :recipe="recipe"
        v-model="quantity"
        @close-modal="openQuantity = false"
        @confirm="onConfirmQuantity"
      ></ModalQuantity>
      <ModalRecipeSelect
        :active="openRecipeModal"
        :recipes="recipes"
        @close-modal="openRecipeModal = false"
        @select="onRecipeSelected"
      ></ModalRecipeSelect>
      <ModalConfirmSave
        :active="openSaveConfirmModal"
        @close-modal="openSaveConfirmModal = false"
        @confirm="handleSaveConfirm"
      ></ModalConfirmSave>
      <ModalPausedRecipes
        :active="openPausedModal"
        @close-modal="openPausedModal = false"
        @select="onSelectPaused"
        @remove="removePausedPreparation"
      ></ModalPausedRecipes>

      <div
        class="md:grid md:grid-cols-12 md:gap-2 items-stretch flex-1 min-h-0"
      >
        <div class="md:col-span-6 flex flex-col justify-between min-h-0">
          <main-weight
            :ingredient="currentStep"
            :preparation="preparation"
            :step="step"
            @next="next"
            @re-calc="reCalculate"
            @finish="onFinish"
            @save-recipe="savePreparationAsRecipe"
            @pause="onPause"
          ></main-weight>
          <RecipeComponent
            :preparation="preparation"
            :total="totalNet"
            @start="openQuantityModal"
          ></RecipeComponent>
        </div>
        <div class="md:col-span-6 flex flex-col min-h-0">
          <table-recipe
            :preparation="preparation"
            :step="step"
            @select="setStep"
            @measure-alone="handleMeasureAlone"
            :showActions="!singleMeasurementSource"
          ></table-recipe>
        </div>
      </div>
    </div>
  </div>
</template>
