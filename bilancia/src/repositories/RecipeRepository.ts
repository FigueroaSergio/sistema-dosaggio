import { getDb } from "./Database";
import { Recipe } from "../composables/useRecipes";

export const RecipeRepository = {
  async getAllRecipes(): Promise<Recipe[]> {
    const database = await getDb();
    const loadedRecipes = await database.select<{ name: string }[]>(
      "SELECT name FROM recipes",
    );

    const result: Recipe[] = [];

    for (const r of loadedRecipes) {
      const ingredients = await database.select<
        {
          name: string;
          grams: number;
          tolerance: number;
        }[]
      >(
        "SELECT name, grams, tolerance FROM recipe_ingredients WHERE recipe_name = $1",
        [r.name],
      );

      result.push({
        name: r.name,
        ingredients: ingredients.map((i) => ({
          name: i.name,
          grams: i.grams,
          tolerance: i.tolerance,
        })),
      });
    }

    return result;
  },

  async addRecipe(name: string, recipe: Recipe): Promise<void> {
    const database = await getDb();
    await database.execute(
      "INSERT OR REPLACE INTO recipes (name) VALUES ($1)",
      [name],
    );
    await database.execute(
      "DELETE FROM recipe_ingredients WHERE recipe_name = $1",
      [name],
    );
    for (const ing of recipe.ingredients) {
      await database.execute(
        "INSERT INTO recipe_ingredients (recipe_name, name, grams, tolerance) VALUES ($1, $2, $3, $4)",
        [name, ing.name, ing.grams, ing.tolerance],
      );
    }
  },

  async deleteRecipe(name: string): Promise<void> {
    const database = await getDb();
    await database.execute(
      "DELETE FROM recipe_ingredients WHERE recipe_name = $1",
      [name],
    );
    await database.execute("DELETE FROM recipes WHERE name = $1", [name]);
  },
};
