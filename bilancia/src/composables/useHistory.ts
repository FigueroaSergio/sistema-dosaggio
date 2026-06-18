import { reactive } from "vue";
import { Preparation } from "./usePreparation";
import { HistoryRepository } from "../repositories/HistoryRepository";

export type HistoryEntry = {
  timestamp: string;
  preparation: Preparation;
};

const history = reactive<HistoryEntry[]>([]);

export async function initHistory() {
  const loadedHistory = await HistoryRepository.getAllHistory();

  for (const h of loadedHistory) {
    history.push(h);
  }
}

export function useHistory() {
  const addHistory = async (preparation: Preparation) => {
    const timestamp = new Date().toISOString();
    const snapshot = JSON.parse(JSON.stringify(preparation));

    history.push({
      timestamp,
      preparation: snapshot,
    });

    await HistoryRepository.addHistory(timestamp, snapshot);
  };

  return { history, addHistory };
}
