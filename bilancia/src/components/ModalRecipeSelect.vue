<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import List from "./List.vue";
import { RecipeRegistry } from "../composables/useRecipes";

const { t } = useI18n();

const props = defineProps<{ active: boolean; recipes: RecipeRegistry }>();
defineEmits<{
  (e: "close-modal"): void;
  (e: "select", name: string): void;
}>();

const searchQuery = ref("");

const filteredRecipes = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return Object.keys(props.recipes)
    .filter((name) => name.toLowerCase().includes(query))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name }));
});
</script>

<template>
  <Modal
    :active="active"
    :title="t('modal.recipeSelect.title')"
    fullscreen
    @close-modal="$emit('close-modal')"
  >
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="t('modal.recipeSelect.searchPlaceholder')"
        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
        autofocus
      />
    </div>
    <List
      :items="filteredRecipes"
      empty-message=""
      @select="(key: string) => $emit('select', key)"
    />
  </Modal>
</template>
