<script setup lang="ts">
import Modal from "./Modal.vue";
import { Recipe, RecipeRegistry } from "./../composables/useRecipes";
import { reactive, ref } from "vue";
import { RecipeValidator } from "../Validators/Recipe";
import { ValidationError } from "../utils/Validator";
const { active, recipes } = defineProps<{
  active: Boolean;
  recipes: RecipeRegistry;
}>();
const validator = ref(RecipeValidator);
const recipeData = reactive<Recipe>({
  name: "",
  ingredients: [],
});
const errors = ref<ValidationError | null>(null);
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

  console.log(result);
};
</script>
<template>
  <Modal :active="active" title="✏️ Gestisci Ricette">
    <div>
      <!-- Sezione per creare/modificare ricetta -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Crea o Modifica Ricetta
        </h3>
        <div class="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Ricetta
            </label>
            <input
              id="recipe-name-input"
              type="text"
              v-model="recipeData.name"
              placeholder="es. Pane Integrale"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150"
            />
            <div
              id="recipe-name-error"
              class="error-message"
              v-if="errors && errors.first('root.name')"
            >
              ⚠️ Nome ricetta obbligatorio
            </div>
          </div>
        </div>

        <!-- Ingredienti -->
        <div id="ingredients-container" class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Ingredienti</h4>
          <div
            class="ingredient-grams-error error-message"
            v-if="errors && errors.first(`root.ingredients`)"
          >
            ⚠️ Aggiungere un ingrediente
          </div>
          <div id="ingredients-list">
            <div
              v-for="(ingredient, idx) in recipeData.ingredients"
              class="flex gap-2 mb-2"
            >
              <div class="flex-1">
                <input
                  type="text"
                  placeholder="Ingrediente"
                  v-model="ingredient.name"
                  required
                  class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-purple-500 focus:border-purple-500"
                />
                <div
                  class="ingredient-name-error error-message"
                  v-if="errors && errors.first(`root.ingredients[${idx}].name`)"
                >
                  ⚠️ Nome ingrediente obbligatorio
                </div>
              </div>
              <div class="w-28">
                <input
                  type="number"
                  placeholder="Grammi"
                  v-model.number="ingredient.grams"
                  step="0.001"
                  required
                  min="0"
                  class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-purple-500 focus:border-purple-500"
                />
                <div
                  class="ingredient-grams-error error-message"
                  v-if="
                    errors && errors.first(`root.ingredients[${idx}].grams`)
                  "
                >
                  ⚠️ Quantità obbligatoria
                </div>
              </div>
              <button
                class="remove-ingredient-btn px-2 py-1 bg-red-400 text-white text-xs rounded hover:bg-red-500 self-center"
                @click="onRemoveIngredient(idx)"
              >
                ✕
              </button>
            </div>
          </div>
          <button
            id="add-ingredient-btn"
            class="mt-2 px-3 py-2 bg-gray-200 text-gray-800 text-sm rounded-lg hover:bg-gray-300 transition duration-150"
            @click="onAddIngredient"
          >
            + Aggiungi Ingrediente
          </button>
        </div>

        <div class="flex gap-3">
          <button
            id="cancel-manage-btn"
            class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
            @click="$emit('close-modal')"
          >
            Annulla
          </button>
          <button
            id="save-recipe-btn"
            class="flex-1 px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-150"
            @click="onSave"
          >
            Salva Ricetta
          </button>
        </div>
      </div>

      <!-- Lista ricette esistenti -->
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">
          Ricette Esistenti
        </h3>
        <div id="existing-recipes-list" class="max-h-64 overflow-y-auto">
          <!-- Ricette caricate dinamicamente -->
          <div
            v-for="recipe of recipes"
            class="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center"
          >
            <div>
              <h4 class="font-semibold text-gray-800">{{ recipe.name }}</h4>
              <p class="text-xs text-gray-500">
                {{ recipe.ingredients.length }} ingredienti
              </p>
            </div>
            <div class="flex gap-2">
              <button
                class="edit-recipe-btn px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                data-recipe="${recipeName}"
              >
                Modifica
              </button>
              <button
                class="delete-recipe-btn px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                data-recipe="${recipeName}"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>
