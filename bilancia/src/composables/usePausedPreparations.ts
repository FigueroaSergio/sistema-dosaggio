import { reactive } from "vue";
import { Preparation } from "./usePreparation";

export type PausedPreparation = {
  id: string;
  timestamp: string;
  preparation: Preparation;
  step: number;
};

const pausedPreparations = reactive<PausedPreparation[]>([]);

export function usePausedPreparations() {
  const pausePreparation = (preparation: Preparation, step: number) => {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    pausedPreparations.push({
      id,
      timestamp,
      preparation: JSON.parse(JSON.stringify(preparation)),
      step,
    });
  };

  const getPausedPreparation = (id: string) => {
    return pausedPreparations.find((p) => p.id === id) || null;
  };

  const removePausedPreparation = (id: string) => {
    const index = pausedPreparations.findIndex((p) => p.id === id);
    if (index !== -1) pausedPreparations.splice(index, 1);
  };

  return { pausedPreparations, pausePreparation, getPausedPreparation, removePausedPreparation };
}
