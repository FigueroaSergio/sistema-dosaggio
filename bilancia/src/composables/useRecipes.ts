import { reactive } from "vue";
import { RecipeRepository } from "../repositories/RecipeRepository";

export type Ingredient = { name: string; grams: number; tolerance: number };
export type Recipe = { name: string; ingredients: Ingredient[]; note: string };
export type RecipeRegistry = Record<string, Recipe>;

const recipes = reactive<RecipeRegistry>({});

export async function initRecipes() {
  const loadedRecipes = await RecipeRepository.getAllRecipes();
  for (const r of loadedRecipes) {
    recipes[r.name] = r;
  }
}

export function useRecipes() {
  async function addRecipe(name: string, recipe: Recipe) {
    recipes[name] = recipe;
    await RecipeRepository.addRecipe(name, recipe);
  }

  async function deleteRecipe(name: string) {
    delete recipes[name];
    await RecipeRepository.deleteRecipe(name);
  }

  return { recipes, addRecipe, deleteRecipe };
}
