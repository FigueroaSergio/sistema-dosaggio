import { getDb } from "./Database";
import { PausedPreparation } from "../composables/usePausedPreparations";

export const PausedPreparationRepository = {
  async getAll(): Promise<PausedPreparation[]> {
    const database = await getDb();
    const rows = await database.select<
      {
        id: string;
        timestamp: string;
        preparation_name: string;
        tare_weight: number;
        note: string;
        step: number;
      }[]
    >(
      "SELECT id, timestamp, preparation_name, tare_weight, note, step FROM paused_preparations",
    );

    const result: PausedPreparation[] = [];

    for (const row of rows) {
      const ingredients = await database.select<
        { name: string; grams: number; tolerance: number; weight: number; separately_measured: number }[]
      >(
        "SELECT name, grams, tolerance, weight, separately_measured FROM paused_preparation_ingredients WHERE paused_preparation_id = $1",
        [row.id],
      );

      result.push({
        id: row.id,
        timestamp: row.timestamp,
        step: row.step,
        preparation: {
          name: row.preparation_name,
          note: row.note || "",
          tareWeight: row.tare_weight,
          ingredients: ingredients.map((i) => ({
            name: i.name,
            grams: i.grams,
            tolerance: i.tolerance,
            weight: i.weight,
            separatelyMeasured: i.separately_measured === 1,
          })),
        },
      });
    }

    return result;
  },

  async getById(id: string): Promise<PausedPreparation | null> {
    const database = await getDb();
    const rows = await database.select<
      {
        id: string;
        timestamp: string;
        preparation_name: string;
        tare_weight: number;
        note: string;
        step: number;
      }[]
    >(
      "SELECT id, timestamp, preparation_name, tare_weight, note, step FROM paused_preparations WHERE id = $1",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const ingredients = await database.select<
      { name: string; grams: number; tolerance: number; weight: number; separately_measured: number }[]
    >(
      "SELECT name, grams, tolerance, weight, separately_measured FROM paused_preparation_ingredients WHERE paused_preparation_id = $1",
      [row.id],
    );

    return {
      id: row.id,
      timestamp: row.timestamp,
      step: row.step,
      preparation: {
        name: row.preparation_name,
        note: row.note || "",
        tareWeight: row.tare_weight,
        ingredients: ingredients.map((i) => ({
          name: i.name,
          grams: i.grams,
          tolerance: i.tolerance,
          weight: i.weight,
          separatelyMeasured: i.separately_measured === 1,
        })),
      },
    };
  },

  async add(pausedPreparation: PausedPreparation): Promise<void> {
    const database = await getDb();
    await database.execute(
      "INSERT INTO paused_preparations (id, timestamp, preparation_name, tare_weight, note, step) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        pausedPreparation.id,
        pausedPreparation.timestamp,
        pausedPreparation.preparation.name,
        pausedPreparation.preparation.tareWeight,
        pausedPreparation.preparation.note,
        pausedPreparation.step,
      ],
    );

    for (const ing of pausedPreparation.preparation.ingredients) {
      await database.execute(
        "INSERT INTO paused_preparation_ingredients (paused_preparation_id, name, grams, tolerance, weight, separately_measured) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          pausedPreparation.id,
          ing.name,
          ing.grams,
          ing.tolerance,
          ing.weight,
          ing.separatelyMeasured ? 1 : 0,
        ],
      );
    }
  },

  async remove(id: string): Promise<void> {
    const database = await getDb();
    await database.execute(
      "DELETE FROM paused_preparation_ingredients WHERE paused_preparation_id = $1",
      [id],
    );
    await database.execute("DELETE FROM paused_preparations WHERE id = $1", [
      id,
    ]);
  },
};
