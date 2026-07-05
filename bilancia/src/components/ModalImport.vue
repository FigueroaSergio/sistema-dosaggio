<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import List from "./List.vue";
import BaseBtn from "./BaseBtn.vue";
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
const nameFilter = ref("");
const parsedRecipes = ref<Recipe[]>([]);
const selectedKeys = ref<string[]>([]);

const filteredRecipes = computed(() => {
  if (!nameFilter.value) return parsedRecipes.value;
  return parsedRecipes.value.filter((r) =>
    r.name.toLowerCase().includes(nameFilter.value.toLowerCase()),
  );
});

const allSelected = computed(
  () =>
    parsedRecipes.value.length > 0 &&
    selectedKeys.value.length === parsedRecipes.value.length,
);

const selectedCountLabel = computed(() =>
  t("modal.import.selectedCount", {
    count: selectedKeys.value.length,
    total: parsedRecipes.value.length,
  }),
);

const parseContent = (content: string) => {
  try {
    parsedRecipes.value = parseCSVToRecipes(content);
    selectedKeys.value = parsedRecipes.value.map((r) => r.name);
    importStatus.value = "";
  } catch (err) {
    importStatus.value = t("modal.import.error");
  }
};

const openFilePicker = async () => {
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
        parseContent(content);
      } else {
        emit("close-modal");
      }
    } catch (err) {
      importStatus.value = t("modal.import.error");
    }
  } else {
    fileInput.value?.click();
  }
};

const onFileChanged = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    emit("close-modal");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    parseContent(e.target?.result as string);
  };
  reader.readAsText(file);
};

watch(
  () => active,
  (isActive) => {
    if (isActive) {
      parsedRecipes.value = [];
      selectedKeys.value = [];
      importStatus.value = "";
      nameFilter.value = "";
      if (fileInput.value) fileInput.value.value = "";
      openFilePicker();
    }
  },
);

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedKeys.value = [];
  } else {
    selectedKeys.value = parsedRecipes.value.map((r) => r.name);
  }
};

const onConfirmImport = () => {
  const selected = parsedRecipes.value.filter((r) =>
    selectedKeys.value.includes(r.name),
  );
  if (selected.length === 0) return;

  emit("import-recipes", selected);
  importStatus.value = t("modal.import.success", { count: selected.length });
  setTimeout(() => {
    emit("close-modal");
    resetState();
  }, 1500);
};

const resetState = () => {
  parsedRecipes.value = [];
  selectedKeys.value = [];
  importStatus.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const onClose = () => {
  emit("close-modal");
  resetState();
};
</script>

<template>
  <Modal
    :active="active"
    :title="t('modal.import.title')"
    fullscreen
    @close-modal="onClose"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".csv"
      class="hidden"
      @change="onFileChanged"
    />

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-3">
        <input
          v-model="nameFilter"
          type="text"
          :placeholder="t('modal.import.searchPlaceholder')"
          class="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <span class="text-sm text-gray-600 whitespace-nowrap">{{ selectedCountLabel }}</span>
        <BaseBtn size="xs" variant="ghost" @click="toggleSelectAll">
          {{
            allSelected
              ? t("modal.import.deselectAll")
              : t("modal.import.selectAll")
          }}
        </BaseBtn>
      </div>

      <div
        class="border border-gray-200 rounded-lg overflow-y-auto flex-1"
      >
        <List
          :items="filteredRecipes"
          key-field="name"
          :model-value="selectedKeys"
          :multi-select="true"
          :empty-message="t('modal.import.noRecipes')"
          @update:model-value="selectedKeys = $event"
        >
          <template #description="{ item }">
            {{
              t("modal.import.ingredientsCount", {
                count: item.ingredients.length,
              })
            }}
          </template>
        </List>
      </div>

      <div class="text-sm text-green-600" v-if="importStatus">
        {{ importStatus }}
      </div>
    </div>

    <template #footer>
      <BaseBtn size="lg" variant="secondary" @click="onClose">
        {{ t("modal.import.cancel") }}
      </BaseBtn>
      <BaseBtn
        size="lg"
        :disabled="selectedKeys.length === 0"
        @click="onConfirmImport"
      >
        {{ t("modal.import.import") }} ({{ selectedKeys.length }})
      </BaseBtn>
    </template>
  </Modal>
</template>
