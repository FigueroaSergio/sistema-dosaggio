<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import { parseCSVToRecipes } from "../utils/csv-parser";
import type { Recipe } from "../composables/useRecipes";

const { t } = useI18n();

const { active } = defineProps<{ active: boolean }>();
const emit = defineEmits<{
  (e: "close-modal"): void;
  (e: "import-recipes", recipes: Recipe[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const importStatus = ref("");

const onImport = () => {
  const file = fileInput.value?.files?.[0];
  if (!file) {
    importStatus.value = t('modal.import.selectFile');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsedRecipes = parseCSVToRecipes(content);
      emit("import-recipes", parsedRecipes);
      importStatus.value = t('modal.import.success', { count: parsedRecipes.length });
      setTimeout(() => {
        emit("close-modal");
        importStatus.value = "";
        if (fileInput.value) fileInput.value.value = "";
      }, 1500);
    } catch (err) {
      importStatus.value = t('modal.import.error');
    }
  };
  reader.readAsText(file);
};
</script>
<template>
  <Modal
    :active="active"
    :title="t('modal.import.title')"
    @close-modal="$emit('close-modal')"
  >
    <div>
      <div class="mb-6">
        <input
          ref="fileInput"
          id="csv-file-input"
          type="file"
          accept=".csv"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150"
        />
      </div>
      <div
        id="csv-import-status"
        class="text-sm mb-4 text-green-600"
        v-if="importStatus"
      >
        {{ importStatus }}
      </div>
      <div class="flex gap-3">
        <button
          id="cancel-import-btn"
          class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
          @click="$emit('close-modal')"
        >
          {{ t('modal.import.cancel') }}
        </button>
        <button
          id="confirm-import-btn"
          class="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
          @click="onImport"
        >
          {{ t('modal.import.import') }}
        </button>
      </div>
    </div>
  </Modal>
</template>
