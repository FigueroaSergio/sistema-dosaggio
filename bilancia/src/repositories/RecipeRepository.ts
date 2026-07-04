import { getDb } from "./Database";
import { Recipe } from "../composables/useRecipes";
import * as Sentry from "@sentry/vue";

export const RecipeRepository = {
  async getAllRecipes(): Promise<Recipe[]> {
    const database = await getDb();
    const loadedRecipes = await database.select<{ name: string; note: string }[]>(
      "SELECT name, note FROM recipes",
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
        note: r.note,
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
    try {
      const database = await getDb();
      await database.execute(
        "INSERT OR REPLACE INTO recipes (name, note) VALUES ($1, $2)",
        [name, recipe.note],
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
      Sentry.logger.info("Recipe added", { name });
    } catch (e) {
      Sentry.captureException(e);
      Sentry.logger.error("Failed to add recipe", { name });
      throw e;
    }
  },

  async deleteRecipe(name: string): Promise<void> {
    try {
      const database = await getDb();
      await database.execute(
        "DELETE FROM recipe_ingredients WHERE recipe_name = $1",
        [name],
      );
      await database.execute("DELETE FROM recipes WHERE name = $1", [name]);
      Sentry.logger.info("Recipe deleted", { name });
    } catch (e) {
      Sentry.captureException(e);
      Sentry.logger.error("Failed to delete recipe", { name });
      throw e;
    }
  },
};
