<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHistory, type HistoryEntry } from "../composables/useHistory.ts";
import { useRecipes } from "../composables/useRecipes.ts";
import { exportHistoryToCSV } from "../utils/csv-parser.ts";
import NavBar from "../components/NavBar.vue";
import BaseBtn from "../components/BaseBtn.vue";
import List from "../components/List.vue";
import ModalSaveRecipeName from "../components/ModalSaveRecipeName.vue";
import { message, save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import * as Sentry from "@sentry/vue";

const { t } = useI18n();
const dateFrom = ref("");
const dateTo = ref("");

const filteredHistory = computed(() => {
  return history
    .filter((entry) => {
      const d = new Date(entry.timestamp);
      const dateStr = d.toISOString().slice(0, 10);
      if (dateFrom.value && dateStr < dateFrom.value) return false;
      if (dateTo.value && dateStr > dateTo.value) return false;
      return true;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
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

  await message(t("history.recipeSaved", { name: newName }));
  openSaveModal.value = false;
};

const onExportHistory = async () => {
  const dataToExport =
    filteredHistory.value.length > 0 ? filteredHistory.value : history;
  if (dataToExport.length === 0) {
    await message(t("history.noHistory"));
    return;
  }

  let csvData = "";
  try {
    csvData = exportHistoryToCSV(dataToExport);
  } catch (e) {
    Sentry.captureException(e);
    Sentry.logger.error("Failed to export history to CSV");
    await message("Export error: " + e);
    return;
  }

  try {
    const path = await save({
      filters: [{ name: "CSV", extensions: ["csv"] }],
      defaultPath: "storico.csv",
    });

    if (path) {
      await writeTextFile(path, csvData);
      Sentry.logger.info("History exported to file", { path });
      await message(`File salvato in: ${path}`);
      return;
    }
  } catch (e) {
    Sentry.captureException(e);
    Sentry.logger.error("Failed to save exported history file");
    await message("Export error: " + e);
  }
  try {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "storico.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Sentry.logger.info("History exported via blob download");
  } catch (e) {
    Sentry.captureException(e);
    Sentry.logger.error("Failed to export history via blob");
    await message("Export error: " + e);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <NavBar :title="$t('history.title')">
      <template #actions>
        <BaseBtn variant="secondary" outline @click="onExportHistory">
          {{ $t("history.export") }}
        </BaseBtn>
        <BaseBtn variant="secondary" outline @click="router.push('/')">
          {{ $t("nav.home") }}
        </BaseBtn>
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
          {{ $t("history.recipeList") }}
        </div>
        <div class="p-3 border-b flex items-center gap-2">
          <label
            class="text-xs font-semibold text-gray-600 whitespace-nowrap"
            >{{ $t("history.from") }}</label
          >
          <input
            type="date"
            v-model="dateFrom"
            class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <label
            class="text-xs font-semibold text-gray-600 whitespace-nowrap"
            >{{ $t("history.to") }}</label
          >
          <input
            type="date"
            v-model="dateTo"
            class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <List
          :items="filteredHistory"
          :selected-key="selectedEntry?.timestamp ?? null"
          key-field="timestamp"
          :empty-message="$t('history.noHistory')"
          @select="
            (key: string) => {
              let p = filteredHistory.find((e) => e.timestamp === key);
              if (p) selectEntry(p);
            }
          "
          ><template #header="{ item }">{{ item.preparation.name }}</template>
          <template #description="{ item }">
            {{ new Date(item.timestamp).toLocaleString() }}
          </template>
        </List>
      </div>

      <!-- Dettaglio ricetta -->
      <div
        class="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-120px)] overflow-hidden"
      >
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">
          {{ $t("history.recipeDetail") }}
        </div>
        <div class="flex-1 overflow-y-auto p-6">
          <div
            v-if="!selectedEntry"
            class="h-full flex items-center justify-center text-gray-400 text-lg"
          >
            {{ $t("history.selectRecipe") }}
          </div>
          <div v-else>
            <h2 class="text-xl font-bold text-gray-900">
              {{ selectedEntry.preparation.name }}
            </h2>
            <p class="text-gray-500">
              {{ new Date(selectedEntry.timestamp).toLocaleString() }}
            </p>

            <h3 class="text-xl font-semibold text-gray-800 mt-2">
              {{ $t("history.ingredients") }}
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
              <span>{{ $t("history.total") }}</span>
              <span class="font-mono text-sm">
                {{ selectedTotal.weight.toFixed(2) }}g /
                {{ selectedTotal.grams.toFixed(2) }}g
              </span>
            </div>
            <BaseBtn variant="primary" class="mt-4" @click="saveAsRecipe">
              {{ $t("history.saveRecipe") }}
            </BaseBtn>
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
