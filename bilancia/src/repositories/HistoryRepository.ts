import { getDb } from "./Database";
import { HistoryEntry } from "../composables/useHistory";
import { Preparation } from "../composables/usePreparation";
import * as Sentry from "@sentry/vue";

export const HistoryRepository = {
  async getAllHistory(): Promise<HistoryEntry[]> {
    const database = await getDb();
    const loadedHistory = await database.select<
      {
        id: number;
        timestamp: string;
        preparation_name: string;
        tare_weight: number;
        note: string;
      }[]
    >("SELECT id, timestamp, preparation_name, tare_weight, note FROM history");

    const result: HistoryEntry[] = [];

    for (const h of loadedHistory) {
      const ingredients = await database.select<
        {
          name: string;
          grams: number;
          tolerance: number;
          weight: number;
        }[]
      >(
        "SELECT name, grams, tolerance, weight FROM history_ingredients WHERE history_id = $1",
        [h.id],
      );

      result.push({
        timestamp: h.timestamp,
        preparation: {
          name: h.preparation_name,
          note: h.note || "",
          tareWeight: h.tare_weight,
          ingredients: ingredients.map((i) => ({
            name: i.name,
            grams: i.grams,
            tolerance: i.tolerance,
            weight: i.weight,
          })),
        },
      });
    }

    return result;
  },

  async addHistory(timestamp: string, preparation: Preparation): Promise<void> {
    try {
      const database = await getDb();
      const result = await database.execute(
        "INSERT INTO history (timestamp, preparation_name, tare_weight, note) VALUES ($1, $2, $3, $4)",
        [timestamp, preparation.name, preparation.tareWeight, preparation.note],
      );

      const historyId = result.lastInsertId;
      for (const ing of preparation.ingredients) {
        await database.execute(
          "INSERT INTO history_ingredients (history_id, name, grams, tolerance, weight) VALUES ($1, $2, $3, $4, $5)",
          [historyId, ing.name, ing.grams, ing.tolerance, ing.weight],
        );
      }
      Sentry.logger.info("History entry added", { timestamp, preparationName: preparation.name });
    } catch (e) {
      Sentry.captureException(e);
      Sentry.logger.error("Failed to add history entry", { timestamp, preparationName: preparation.name });
      throw e;
    }
  },
};
