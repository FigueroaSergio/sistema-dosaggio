<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRecipes, type Recipe } from '../composables/useRecipes.ts';
import { exportRecipesToCSV, parseCSVToRecipes } from '../utils/csv-parser.ts';
import { RecipeValidator } from '../Validators/Recipe.ts';
import type { ValidationError } from '../utils/Validator.ts';

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
  if (isEditing.value && selectedRecipeName.value && selectedRecipeName.value !== recipeData.name) {
    deleteRecipe(selectedRecipeName.value);
  }

  addRecipe(recipeData.name, JSON.parse(JSON.stringify(recipeData)));
  
  selectedRecipeName.value = recipeData.name;
  isEditing.value = true;
  errors.value = null;
  
  alert("Ricetta salvata con successo!");
};

const onDelete = (name: string) => {
  if(confirm("Sei sicuro di voler eliminare questa ricetta?")) {
    deleteRecipe(name);
    if (selectedRecipeName.value === name) {
      createNewRecipe();
    }
  }
};

const triggerImport = () => {
  fileInput.value?.click();
};

const handleImport = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
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
  reader.readAsText(file);
};

const onExport = () => {
  const csvData = exportRecipesToCSV(recipes);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "recipes.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <input type="file" ref="fileInput" accept=".csv" class="hidden" @change="handleImport" />

    <!-- Top bar -->
    <div class="border-b bg-white p-4 flex flex-wrap justify-between items-center gap-4 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800">Gestione</h1>
      <div class="flex gap-2 flex-wrap">
        <button @click="createNewRecipe" class="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm">Nuova</button>
        <button @click="triggerImport" class="px-4 py-2 border border-gray-300 bg-white font-medium rounded-lg hover:bg-gray-100 transition shadow-sm">Importa</button>
        <button @click="onExport" class="px-4 py-2 border border-gray-300 bg-white font-medium rounded-lg hover:bg-gray-100 transition shadow-sm">Exporta</button>
        <button @click="router.push('/')" class="px-4 py-2 border border-gray-300 bg-white font-medium rounded-lg hover:bg-gray-100 transition shadow-sm">Home</button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col md:flex-row p-4 gap-6 max-w-7xl mx-auto w-full">
      <!-- Lista ricette -->
      <div class="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">Lista ricette</div>
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="Object.keys(recipes).length === 0" class="text-gray-500 text-center py-8">
            Nessuna ricetta presente.
          </div>
          <div 
            v-for="recipe in recipes" 
            :key="recipe.name"
            @click="selectRecipeToEdit(recipe)"
            class="p-4 mb-2 border rounded-lg cursor-pointer transition flex justify-between items-center"
            :class="{'border-teal-500 bg-teal-50 ring-1 ring-teal-500': selectedRecipeName === recipe.name, 'border-gray-200 hover:bg-gray-50': selectedRecipeName !== recipe.name}"
          >
            <div>
              <div class="font-bold text-gray-800">{{ recipe.name }}</div>
              <div class="text-sm text-gray-500 mt-1">{{ recipe.ingredients.length }} ingredienti</div>
            </div>
            <button @click.stop="onDelete(recipe.name)" class="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition">✕</button>
          </div>
        </div>
      </div>

      <!-- Dettaglio ricetta form -->
      <div class="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700 flex justify-between items-center">
          <span>Dettaglio ricetta</span>
          <span v-if="isEditing" class="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded">Modalità modifica</span>
          <span v-else class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Nuova ricetta</span>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6">
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome Ricetta</label>
            <input
              type="text"
              v-model="recipeData.name"
              placeholder="es. Pane Integrale"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
            />
            <div class="text-red-600 text-sm mt-1" v-if="errors && errors.first('root.name')">
              ⚠️ Nome ricetta obbligatorio
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-semibold text-gray-700">Ingredienti</h4>
              <button @click="onAddIngredient" class="text-sm text-teal-600 hover:text-teal-800 font-medium px-3 py-1 bg-teal-50 rounded hover:bg-teal-100 transition">+ Aggiungi</button>
            </div>
            <div class="text-red-600 text-sm mb-3" v-if="errors && errors.first(`root.ingredients`)">
              ⚠️ Aggiungere almeno un ingrediente
            </div>
            
            <div class="space-y-3">
              <div v-for="(ingredient, idx) in recipeData.ingredients" :key="idx" class="flex flex-wrap md:flex-nowrap gap-3 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div class="flex-1 w-full md:w-auto">
                  <label class="block text-xs text-gray-500 mb-1">Ingrediente</label>
                  <input type="text" placeholder="Nome" v-model="ingredient.name" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"/>
                  <div class="text-red-600 text-xs mt-1" v-if="errors && errors.first(`root.ingredients[${idx}].name`)">⚠️ Obbligatorio</div>
                </div>
                <div class="w-1/3 md:w-24">
                  <label class="block text-xs text-gray-500 mb-1">Grammi</label>
                  <input type="number" placeholder="q.tà" v-model.number="ingredient.grams" step="0.001" min="0" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"/>
                  <div class="text-red-600 text-xs mt-1" v-if="errors && errors.first(`root.ingredients[${idx}].grams`)">⚠️ Quantità</div>
                </div>
                <div class="w-1/3 md:w-24">
                  <label class="block text-xs text-gray-500 mb-1">Toll. (g)</label>
                  <input type="number" placeholder="toll." v-model.number="ingredient.tolerance" step="0.001" min="0" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"/>
                </div>
                <div class="w-full md:w-auto flex justify-end md:self-center mt-2 md:mt-5">
                  <button @click="onRemoveIngredient(idx)" class="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition" title="Rimuovi ingrediente">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="recipeData.ingredients.length === 0" class="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Nessun ingrediente inserito
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50 flex justify-end mt-auto">
          <button @click="onSave" class="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-md">
            Salva Ricetta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
