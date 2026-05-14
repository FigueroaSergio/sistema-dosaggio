<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useRecipes, type Recipe } from "../composables/useRecipes.ts";
import { exportRecipesToCSV, parseCSVToRecipes } from "../utils/csv-parser.ts";
import { RecipeValidator } from "../Validators/Recipe.ts";
import type { ValidationError } from "../utils/Validator.ts";
import NavBar from "../components/NavBar.vue";

const router = useRouter();
const { recipes, addRecipe, deleteRecipe } = useRecipes();

const selectedRecipeName = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const validator = ref(RecipeValidator);
const recipeData = reactive<Recipe>({
  name: "",
  ingredients: [],
});
const errors = ref<ValidationError | null>(null);
const isEditing = ref(false);

const selectRecipeToEdit = (recipe: Recipe) => {
  selectedRecipeName.value = recipe.name;
  isEditing.value = true;
  recipeData.name = recipe.name;
  recipeData.ingredients = JSON.parse(JSON.stringify(recipe.ingredients));
  errors.value = null;
};

const createNewRecipe = () => {
  selectedRecipeName.value = null;
  isEditing.value = false;
  recipeData.name = "";
  recipeData.ingredients = [];
  errors.value = null;
};

const onAddIngredient = () => {
  recipeData.ingredients.push({ name: "", grams: 0, tolerance: 0 });
};

const onRemoveIngredient = (idx: number) => {
  recipeData.ingredients.splice(idx, 1);
};

const onSave = () => {
  let result = validator.value.validate(recipeData);

  if (result.hasErrors()) {
    errors.value = result.getErrors();
    return;
  }

  // Se stiamo modificando ed il nome è cambiato, eliminiamo la vecchia ricetta
  if (
    isEditing.value &&
    selectedRecipeName.value &&
    selectedRecipeName.value !== recipeData.name
  ) {
    deleteRecipe(selectedRecipeName.value);
  }

  addRecipe(recipeData.name, JSON.parse(JSON.stringify(recipeData)));
  alert(`Ricetta "${recipeData.name}" salvata con successo!`);

  selectedRecipeName.value = recipeData.name;
  isEditing.value = true;
  errors.value = null;
};

const onDelete = (name: string) => {
  if (confirm("Sei sicuro di voler eliminare questa ricetta?")) {
    deleteRecipe(name);
    if (selectedRecipeName.value === name) {
      createNewRecipe();
    }
  }
};

const processImportContent = (content: string) => {
  try {
    const parsedRecipes = parseCSVToRecipes(content);
    parsedRecipes.forEach((r) => {
      addRecipe(r.name, r);
    });
    alert(`Importate ${parsedRecipes.length} ricette con successo.`);
    if (fileInput.value) fileInput.value.value = "";
  } catch (err) {
    alert("Errore durante l'analisi del file CSV.");
  }
};

const triggerImport = async () => {
  if ((window as any).__TAURI_INTERNALS__) {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const { readTextFile } = await import("@tauri-apps/plugin-fs");

      const selected = await open({
        multiple: false,
        filters: [{ name: "CSV", extensions: ["csv"] }],
      });

      if (selected && typeof selected === "string") {
        const content = await readTextFile(selected);
        processImportContent(content);
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante l'importazione con i plugin Tauri.");
    }
  } else {
    fileInput.value?.click();
  }
};

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    processImportContent(content);
  };
  reader.readAsText(file);
};

const onExport = async () => {
  const csvData = exportRecipesToCSV(recipes);

  if ((window as any).__TAURI_INTERNALS__) {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");

      const path = await save({
        filters: [{ name: "CSV", extensions: ["csv"] }],
        defaultPath: "recipes.csv",
      });

      if (path) {
        await writeTextFile(path, csvData);
        alert("Esportazione completata con successo.");
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante l'esportazione.");
    }
  } else {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "recipes.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <input
      type="file"
      ref="fileInput"
      accept=".csv"
      class="hidden"
      @change="handleImport"
    />

    <NavBar title="Gestione">
      <template #actions>
        <button
          @click="createNewRecipe"
          class="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm"
        >
          Nuova
        </button>
        <button
          @click="triggerImport"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          Importa
        </button>
        <button
          @click="onExport"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          Esporta
        </button>
        <button
          @click="router.push('/')"
          class="px-4 py-2 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          Home
        </button>
      </template>
    </NavBar>

    <!-- Content -->
    <div
      class="flex-1 flex flex-col md:flex-row p-2 gap-2 max-w-7xl mx-auto w-full"
    >
      <!-- Lista ricette -->
      <div
        class="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(50vh-100px)] md:h-[calc(100vh-100px)] overflow-hidden"
      >
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">
          Lista ricette
        </div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-if="Object.keys(recipes).length === 0"
            class="text-gray-500 text-center py-8"
          >
            Nessuna ricetta presente.
          </div>
          <div
            v-for="recipe in recipes"
            :key="recipe.name"
            @click="selectRecipeToEdit(recipe)"
            class="p-2 border-b cursor-pointer transition flex justify-between items-center"
            :class="{
              'border-teal-500 bg-teal-50 ring-1 ring-teal-500':
                selectedRecipeName === recipe.name,
              'border-gray-200 hover:bg-gray-200':
                selectedRecipeName !== recipe.name,
            }"
          >
            <div>
              <div class="font-bold text-gray-800">{{ recipe.name }}</div>
              <div class="text-sm text-gray-500 mt-1">
                {{ recipe.ingredients.length }} ingredienti
              </div>
            </div>
            <button
              @click.stop="onDelete(recipe.name)"
              class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Dettaglio ricetta form -->
      <div
        class="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-100px)] md:h-[calc(100vh-100px)] overflow-hidden"
      >
        <div
          class="p-4 border-b bg-gray-50 font-semibold text-gray-700 flex justify-between items-center"
        >
          <span>Dettaglio ricetta</span>
          <span
            v-if="isEditing"
            class="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded"
            >Modalità modifica</span
          >
          <span
            v-else
            class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
            >Nuova ricetta</span
          >
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Nome Ricetta</label
            >
            <input
              type="text"
              v-model="recipeData.name"
              placeholder="es. Pane Integrale"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
            />
            <div
              class="text-red-600 text-sm mt-1"
              v-if="errors && errors.first('root.name')"
            >
              Nome ricetta obbligatorio
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-semibold text-gray-700">Ingredienti</h4>
              <button
                @click="onAddIngredient"
                class="text-sm text-teal-600 hover:text-teal-800 font-medium px-3 py-1 bg-teal-50 rounded hover:bg-teal-100 transition"
              >
                + Aggiungi
              </button>
            </div>
            <div
              class="text-red-600 text-sm mb-3"
              v-if="errors && errors.first(`root.ingredients`)"
            >
              Aggiungere almeno un ingrediente
            </div>

            <div class="space-y-4">
              <div
                v-for="(ingredient, idx) in recipeData.ingredients"
                :key="idx"
                class="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm relative group"
              >
                <!-- Remove button positioned at top right for easy access -->
                <button
                  @click="onRemoveIngredient(idx)"
                  class="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Rimuovi ingrediente"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <!-- Name Input: Full width on mobile, 6 cols on desktop -->
                  <div class="md:col-span-6">
                    <label
                      class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                      >Ingrediente</label
                    >
                    <input
                      type="text"
                      placeholder="Nome ingrediente"
                      v-model="ingredient.name"
                      class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
                    />
                    <div
                      class="text-red-600 text-xs mt-1"
                      v-if="
                        errors && errors.first(`root.ingredients[${idx}].name`)
                      "
                    >
                      Obbligatorio
                    </div>
                  </div>

                  <!-- Grams Input: Full width on mobile, 3 cols on desktop -->
                  <div class="md:col-span-3">
                    <label
                      class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                      >Peso (g)</label
                    >
                    <input
                      type="number"
                      placeholder="0.00"
                      v-model.number="ingredient.grams"
                      step="0.001"
                      min="0"
                      class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
                    />
                    <div
                      class="text-red-600 text-xs mt-1"
                      v-if="
                        errors && errors.first(`root.ingredients[${idx}].grams`)
                      "
                    >
                      Quantità richiesta
                    </div>
                  </div>

                  <!-- Tolerance Input: Full width on mobile, 3 cols on desktop -->
                  <div class="md:col-span-3">
                    <label
                      class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1"
                      >Toll. (g)</label
                    >
                    <input
                      type="number"
                      placeholder="0.00"
                      v-model.number="ingredient.tolerance"
                      step="0.001"
                      min="0"
                      class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="recipeData.ingredients.length === 0"
              class="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 mx-auto mb-2 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Nessun ingrediente inserito
            </div>
          </div>

          <div class="pt-2 bg-white flex justify-end">
            <button
              @click="onSave"
              class="w-full md:w-auto px-8 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition shadow-lg active:scale-95"
            >
              Salva Ricetta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
