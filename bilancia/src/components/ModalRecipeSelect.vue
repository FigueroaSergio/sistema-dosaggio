<script setup lang="ts">
import { ref, computed } from "vue";
import Modal from "./Modal.vue";
import { RecipeRegistry } from "../composables/useRecipes";

const props = defineProps<{ active: boolean; recipes: RecipeRegistry }>();
defineEmits<{
  (e: "close-modal"): void;
  (e: "select", name: string): void;
}>();

const searchQuery = ref("");

const filteredRecipes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return Object.keys(props.recipes).filter((name) =>
    name.toLowerCase().includes(query),
  );
});
</script>

<template>
  <Modal
    :active="active"
    title="🔍 Seleziona Ricetta"
    @close-modal="$emit('close-modal')"
  >
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Cerca ricetta per nome..."
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
        autofocus
      />
    </div>
    <div class="max-h-64 overflow-y-auto">
      <div
        v-if="filteredRecipes.length === 0"
        class="text-center text-gray-500 py-4"
      >
        Nessuna ricetta trovata
      </div>
      <button
        v-for="name in filteredRecipes"
        :key="name"
        @click="$emit('select', name)"
        class="w-full text-left p-3 mb-2 border rounded-lg hover:bg-teal-50 hover:border-teal-300 transition"
      >
        <span class="font-bold text-gray-800">{{ name }}</span>
      </button>
    </div>
  </Modal>
</template>
