import { computed, reactive } from "vue";

export type Ingredient = { name: string; grams: number; tolerance: number };
export type Recipe = { name: string; ingredients: Ingredient[] };
export type RecipeRegistry = Record<string, Recipe>;

export function useRecipes() {
  const recipes = reactive<RecipeRegistry>({
    "1 BASE BIANCA 57900": {
      name: "1 BASE BIANCA 57900",
      ingredients: [
        { name: "LATTE", grams: 400.0, tolerance: 0.0 },
        { name: "ZUCCHERO", grams: 500.0, tolerance: 0.0 },
      ],
    },
  });
  function addRecipe(name: string, recipe: Recipe) {
    recipes[name] = recipe;
  }
  function deleteRecipe(name: string) {
    delete recipes[name];
  }
  const listRecipes = computed(() => Object.keys(recipes));
  return { recipes, addRecipe, deleteRecipe };
}
