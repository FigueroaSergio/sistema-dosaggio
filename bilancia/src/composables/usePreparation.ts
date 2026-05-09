import { computed, ComputedRef, reactive, ref } from "vue";
import { Ingredient, Recipe } from "./useRecipes";
export type IngredientPreparation = Ingredient & { weight: number };
export type Preparation = {
  name: string;
  ingredients: IngredientPreparation[];
  tareWeight: number;
};
export const getProgress = (ingredient: IngredientPreparation) => {
  return Math.min(100, getPercentage(ingredient));
};
export const getPercentage = (ingredient: IngredientPreparation) => {
  return Math.max(0, (ingredient.weight / ingredient.grams) * 100);
};
export function usePreparation() {
  const step = ref(-1);
  const preparation = reactive<Preparation>({
    name: "",
    ingredients: [],
    tareWeight: 0,
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
  const startRecipe = (recipe: Recipe, quantity: number) => {
    preparation.name = recipe.name;
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
    preparation.ingredients[step.value].weight =
      weight - (total.value - preparation.ingredients[step.value].weight);
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
        name: "Tara",
        grams: preparation.tareWeight,
        weight: preparation.tareWeight,
        tolerance: 0,
      };
    }
    return preparation.ingredients[step.value];
  });
  
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
    totalNet,
    total,
    currentStep,
    step,
    reset,
  };
}
