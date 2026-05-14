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
import { usePreparation } from "../composables/usePreparation.ts";
import { useHistory } from "../composables/useHistory.ts";
import { usePausedPreparations } from "../composables/usePausedPreparations.ts";
import NavBar from "../components/NavBar.vue";
import ModalPausedRecipes from "../components/ModalPausedRecipes.vue";

const router = useRouter();

const openClean = ref(false);
const openQuantity = ref(false);
const selectRecipe = ref("");
const quantity = ref<number | null>(null);
const openRecipeModal = ref(false);
const openSaveConfirmModal = ref(false);
const openPausedModal = ref(false);

const { recipes, addRecipe } = useRecipes();
const recipe = computed(() => {
  const recipe = recipes[selectRecipe.value];
  if (!recipe) {
    return;
  }
  return recipe;
});

const activeMain = computed(() => !(openClean.value || openQuantity.value));

const { weight } = useWeight(activeMain);
const {
  preparation,
  currentStep,
  step,
  total,
  startRecipe,
  onUpdate,
  setStep,
  next,
  reCalculate,
  azzera,
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
  openQuantityModal();
};

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

  startRecipe(recipe.value, quantity.value);
  openClean.value = false;
};

const onConfirmQuantity = () => {
  openClean.value = true;
  openQuantity.value = false;
};

const onFinish = () => {
  openSaveConfirmModal.value = true;
};

const handleSaveConfirm = (saveRecipe: boolean) => {
  addHistory(preparation);

  if (saveRecipe) {
    savePreparationAsRecipe();
  }

  reset();
  selectRecipe.value = "";
  quantity.value = null;
  openSaveConfirmModal.value = false;
  openRecipeModal.value = true;
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
    ingredients: newIngredients,
  });

  alert(`Ricetta "${newName}" salvata con successo!`);
};

const onPause = () => {
  if (!preparation.name) return;
  pausePreparation(preparation, step.value);
  reset();
  selectRecipe.value = "";
  quantity.value = null;
  openRecipeModal.value = true;
};

const onSelectPaused = (id: string) => {
  const paused = getPausedPreparation(id);
  if (paused) {
    if (preparation.name) {
      pausePreparation(preparation, step.value);
    }
    loadPreparation(paused.preparation, paused.step);
    removePausedPreparation(id);
    openPausedModal.value = false;
  }
};

const goHome = () => {
  if (preparation.name) {
    pausePreparation(preparation, step.value);
    reset();
  }
  router.push("/");
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

    <div class="flex-1 max-w-4xl md:max-w-7xl mx-auto w-full p-2 lg:p-8">
      <ModalClean
        :active="openClean"
        @close-modal="openClean = false"
        @confirm="startPreparation"
      ></ModalClean>
      <ModalQuantity
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

      <div class="md:grid md:grid-cols-12 md:gap-2 items-start">
        <div class="md:col-span-6">
          <main-weight
            :ingredient="currentStep"
            :preparation="preparation"
            :step="step"
            @next="next"
            @re-calc="reCalculate"
            @finish="onFinish"
            @save-recipe="savePreparationAsRecipe"
            @azzera="azzera(weight)"
            @pause="onPause"
          ></main-weight>
        </div>
        <div class="md:col-span-6 flex flex-col">
          <RecipeComponent
            :recipes="recipes"
            v-model="selectRecipe"
            :total="total"
            :taraWeight="preparation.tareWeight"
            @start="openQuantityModal"
          ></RecipeComponent>
          <table-recipe
            :preparation="preparation"
            :step="step"
            @select="setStep"
          ></table-recipe>
        </div>
      </div>
    </div>
  </div>
</template>
