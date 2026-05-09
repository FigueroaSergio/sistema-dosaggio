import { reactive } from "vue";
import { Preparation } from "./usePreparation";

export type HistoryEntry = {
  timestamp: string;
  preparation: Preparation;
};

const history = reactive<HistoryEntry[]>([]);

export function useHistory() {

  const addHistory = (preparation: Preparation) => {
    history.push({
      timestamp: new Date().toISOString(),
      preparation: JSON.parse(JSON.stringify(preparation)),
    });
  };

  return { history, addHistory };
}
