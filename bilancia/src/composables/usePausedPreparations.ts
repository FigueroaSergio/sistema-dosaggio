import { reactive } from "vue";
import { Preparation } from "./usePreparation";
import { PausedPreparationRepository } from "../repositories/PausedPreparationRepository";

export type PausedPreparation = {
  id: string;
  timestamp: string;
  preparation: Preparation;
  step: number;
};

const pausedPreparations = reactive<PausedPreparation[]>([]);

PausedPreparationRepository.getAll().then((preparations) => {
  pausedPreparations.splice(0, pausedPreparations.length, ...preparations);
});

function uuidv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function usePausedPreparations() {
  const pausePreparation = async (preparation: Preparation, step: number) => {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const paused: PausedPreparation = {
      id,
      timestamp,
      preparation: JSON.parse(JSON.stringify(preparation)),
      step,
    };
    pausedPreparations.push(paused);
    await PausedPreparationRepository.add(paused);
  };

  const getPausedPreparation = (id: string) => {
    return pausedPreparations.find((p) => p.id === id) || null;
  };

  const removePausedPreparation = async (id: string) => {
    const index = pausedPreparations.findIndex((p) => p.id === id);
    if (index !== -1) pausedPreparations.splice(index, 1);
    await PausedPreparationRepository.remove(id);
  };

  return {
    pausedPreparations,
    pausePreparation,
    getPausedPreparation,
    removePausedPreparation,
  };
}
