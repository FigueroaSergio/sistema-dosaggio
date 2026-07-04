<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useHistory, type HistoryEntry } from "../composables/useHistory.ts";
import { useRecipes } from "../composables/useRecipes.ts";
import NavBar from "../components/NavBar.vue";
import ModalSaveRecipeName from "../components/ModalSaveRecipeName.vue";
import { message } from "@tauri-apps/plugin-dialog";

const dateFrom = ref("");
const dateTo = ref("");

const filteredHistory = computed(() => {
  return history.filter((entry) => {
    const d = new Date(entry.timestamp);
    const dateStr = d.toISOString().slice(0, 10);
    if (dateFrom.value && dateStr < dateFrom.value) return false;
    if (dateTo.value && dateStr > dateTo.value) return false;
    return true;
  });
});

const router = useRouter();
const { history } = useHistory();
const { addRecipe } = useRecipes();

const selectedEntry = ref<HistoryEntry | null>(null);
const openSaveModal = ref(false);
const defaultRecipeName = ref("");

const selectedTotal = computed(() => {
  if (!selectedEntry.value) return { grams: 0, weight: 0 };
  const prep = selectedEntry.value.preparation;
  return {
    grams: prep.ingredients.reduce((sum, ing) => sum + ing.grams, 0),
    weight: prep.ingredients.reduce((sum, ing) => sum + ing.weight, 0),
  };
});

const selectEntry = (entry: HistoryEntry) => {
  selectedEntry.value = entry;
};

const saveAsRecipe = () => {
  if (!selectedEntry.value) return;

  const prep = selectedEntry.value.preparation;
  const timestamp = new Date().toLocaleString();
  defaultRecipeName.value = `${prep.name} (${timestamp})`;
  openSaveModal.value = true;
};

const confirmSave = async (newName: string) => {
  if (!selectedEntry.value) return;

  const prep = selectedEntry.value.preparation;

  const newIngredients = prep.ingredients.map((ing) => ({
    name: ing.name,
    grams: ing.grams,
    tolerance: ing.tolerance || 0,
  }));

  await addRecipe(newName, {
    name: newName,
    note: prep.note || "",
    ingredients: newIngredients,
  });

  await message(`Ricetta "${newName}" salvata con successo!`);
  openSaveModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <NavBar title="Storico">
      <template #actions>
        <button
          @click="router.push('/')"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition shadow-sm"
        >
          Home
        </button>
      </template>
    </NavBar>

    <!-- Content -->
    <div
      class="flex-1 flex flex-col md:flex-row p-4 gap-6 max-w-7xl mx-auto w-full"
    >
      <!-- Lista ricette -->
      <div
        class="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(50vh-120px)] md:h-[calc(100vh-120px)] overflow-hidden"
      >
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">
          Lista ricette
        </div>
        <div class="p-3 border-b flex items-center gap-2">
          <label class="text-xs font-semibold text-gray-600 whitespace-nowrap">Da</label>
          <input
            type="date"
            v-model="dateFrom"
            class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <label class="text-xs font-semibold text-gray-600 whitespace-nowrap">A</label>
          <input
            type="date"
            v-model="dateTo"
            class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-if="filteredHistory.length === 0"
            class="text-gray-500 text-center py-8"
          >
            Nessuna preparazione in storico.
          </div>
          <div
            v-for="entry in filteredHistory"
            :key="entry.timestamp"
            @click="selectEntry(entry)"
            class="p-4 border-b ring-1 ring-gray-200 cursor-pointer transition"
            :class="{
              'border-green-500 bg-teal-50 ring-1 ring-teal-500':
                selectedEntry === entry,
              'border-gray-200 hover:bg-gray-200': selectedEntry !== entry,
            }"
          >
            <div class="font-bold text-gray-800">
              {{ entry.preparation.name }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ new Date(entry.timestamp).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Dettaglio ricetta -->
      <div
        class="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-120px)] overflow-hidden"
      >
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">
          Dettaglio ricetta
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div
            v-if="!selectedEntry"
            class="h-full flex items-center justify-center text-gray-400 text-lg"
          >
            Seleziona una ricetta dalla lista per vedere i dettagli
          </div>
          <div v-else>
            <h2 class="text-xl font-bold text-gray-900">
              {{ selectedEntry.preparation.name }}
            </h2>
            <p class="text-gray-500">
              {{ new Date(selectedEntry.timestamp).toLocaleString() }}
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-2">
              Ingredienti
            </h3>
            <ul class="space-y-3">
              <li
                v-for="ing in selectedEntry.preparation.ingredients"
                :key="ing.name"
                class="flex justify-between items-center"
              >
                <span class="">{{ ing.name }}</span>
                <span
                  class="font-mono p-1 text-xs rounded-md"
                  :class="{
                    'text-red-700 bg-red-100':
                      Math.abs(ing.weight - ing.grams) > ing.tolerance,
                    'text-gray-700 bg-gray-200':
                      Math.abs(ing.weight - ing.grams) <= ing.tolerance,
                  }"
                >
                  {{ ing.weight.toFixed(2) }}g / {{ ing.grams.toFixed(2) }}g
                </span>
              </li>
            </ul>
            <div
              class="flex justify-between items-center mt-4 pt-3 border-t border-gray-300 font-semibold text-gray-800"
            >
              <span>Totale</span>
              <span class="font-mono text-sm">
                {{ selectedTotal.weight.toFixed(2) }}g / {{ selectedTotal.grams.toFixed(2) }}g
              </span>
            </div>
            <button
              @click="saveAsRecipe"
              class="mt-4 px-4 py-2 bg-teal-600 text-white text-bold rounded-lg hover:bg-teal-700 transition shadow-md text-sm"
            >
              Salva Ricetta
            </button>
          </div>
        </div>
      </div>
    </div>
    <ModalSaveRecipeName
      :active="openSaveModal"
      :default-name="defaultRecipeName"
      @close-modal="openSaveModal = false"
      @confirm="confirmSave"
    ></ModalSaveRecipeName>
  </div>
</template>
