import { computed, ComputedRef, reactive, ref } from "vue";
import { Ingredient, Recipe } from "./useRecipes";
import i18n from "../i18n";
export type IngredientPreparation = Ingredient & {
  weight: number;
  separatelyMeasured?: boolean;
};
export type Preparation = {
  name: string;
  ingredients: IngredientPreparation[];
  tareWeight: number;
  note: string;
};
export const getProgress = (ingredient: IngredientPreparation) => {
  return Math.min(100, getPercentage(ingredient));
};
export const getPercentage = (ingredient: IngredientPreparation) => {
  if (ingredient.grams === 0) return 0;
  return Math.min(100, Math.max(0, (ingredient.weight / ingredient.grams) * 100));
};
export function usePreparation() {
  const step = ref(-1);
  const preparation = reactive<Preparation>({
    name: "",
    ingredients: [],
    tareWeight: 0,
    note: "",
  });
  const total = computed(() =>
    preparation.ingredients.reduce(
      (prev, curr) => prev + curr.weight,
      preparation.tareWeight,
    ),
  );
  const totalNet = computed(() =>
    preparation.ingredients.reduce((prev, curr) => prev + curr.grams, 0),
  );
  const separateSum = computed(() =>
    preparation.ingredients.reduce(
      (prev, curr) => prev + (curr.separatelyMeasured ? curr.weight : 0),
      0,
    ),
  );
  const startRecipe = (recipe: Recipe, quantity: number) => {
    preparation.name = recipe.name;
    preparation.note = recipe.note;
    preparation.ingredients = recipe.ingredients.map((e) => ({
      ...e,
      weight: 0,
    }));
    preparation.tareWeight = 0;
    step.value = -1;

    scaleRecipeToQuantity(quantity);
  };
  const next = () => {
    setStep(step.value + 1);
  };

  const prev = () => {
    setStep(step.value - 1);
  };

  const setStep = (idx: number) => {
    if (idx < -1) {
      step.value = -1;
    }
    if (idx > preparation.ingredients.length - 1) {
      step.value = preparation.ingredients.length - 1;
      return;
    }
    step.value = idx;
  };

  const onUpdate = (weight: number) => {
    if (step.value === -1) {
      preparation.tareWeight = weight;
      return;
    }
    const scaleBasedTotal = total.value - separateSum.value;
    preparation.ingredients[step.value].weight =
      weight - (scaleBasedTotal - preparation.ingredients[step.value].weight);
  };
  const scaleRecipeToQuantity = (desiredQuantityGrams: number) => {
    const recipeTotalWeight = totalNet.value;
    if (recipeTotalWeight <= 0) {
      console.warn("Recipe total weight is 0 or negative");
    }

    const scaleFactor = desiredQuantityGrams / recipeTotalWeight;

    preparation.ingredients = preparation.ingredients.map((ingredient) => ({
      ...ingredient,
      grams: +(ingredient.grams * scaleFactor).toFixed(2),
    }));
  };

  const reCalculate = () => {
    const percentage = getPercentage(preparation.ingredients[step.value]);
    if (percentage <= 0) {
      return;
    }
    const factor = percentage / 100;
    preparation.ingredients.forEach((ing) => {
      ing.grams = ing.grams * factor;
    });
  };

  const currentStep: ComputedRef<IngredientPreparation> = computed(() => {
    if (step.value === -1) {
      return {
        name: i18n.global.t('modal.pausedRecipes.tare'),
        grams: preparation.tareWeight,
        weight: preparation.tareWeight,
        tolerance: 0,
      };
    }
    return preparation.ingredients[step.value];
  });

  const azzera = (newWeight: number) => {
    preparation.tareWeight = newWeight;
  };

  const loadPreparation = (
    savedPreparation: Preparation,
    savedStep: number,
  ) => {
    preparation.name = savedPreparation.name;
    preparation.ingredients = JSON.parse(
      JSON.stringify(savedPreparation.ingredients),
    );
    preparation.note = savedPreparation.note;

    preparation.tareWeight = savedPreparation.tareWeight;
    step.value = savedStep;
  };

  const reset = () => {
    preparation.name = "";
    preparation.ingredients = [];
    preparation.tareWeight = 0;
    step.value = -1;
  };

  return {
    preparation,
    setStep,
    next,
    prev,
    startRecipe,
    onUpdate,
    reCalculate,
    azzera,
    totalNet,
    total,
    separateSum,
    currentStep,
    step,
    reset,
    loadPreparation,
  };
}
