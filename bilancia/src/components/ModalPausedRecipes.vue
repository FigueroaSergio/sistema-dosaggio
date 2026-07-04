<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePausedPreparations } from "../composables/usePausedPreparations";
import Modal from "./Modal.vue";

const { t } = useI18n();

defineProps<{
  active: boolean;
}>();

const emit = defineEmits<{
  (e: "close-modal"): void;
  (e: "select", id: string): void;
  (e: "remove", id: string): void;
}>();

const { pausedPreparations } = usePausedPreparations();

const onSelect = (id: string) => {
  emit("select", id);
};

const onRemove = (id: string) => {
  emit("remove", id);
};
</script>

<template>
  <Modal :active="active" :title="t('modal.pausedRecipes.title')" @close-modal="emit('close-modal')">
    <div>
      <div
        v-if="pausedPreparations.length === 0"
        class="text-center py-10 text-gray-500"
      >
        {{ t('modal.pausedRecipes.noPaused') }}
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="paused in pausedPreparations"
          :key="paused.id"
          class="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition group"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-bold text-gray-800">
                {{ paused.preparation.name }}
              </h4>
              <p class="text-xs text-gray-500">
                {{ new Date(paused.timestamp).toLocaleString() }}
              </p>
            </div>
            <button
              @click="onRemove(paused.id)"
              class="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
              :title="t('modal.pausedRecipes.deleteTooltip')"
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

          <div class="text-sm text-gray-600 mb-4">
            {{ t('modal.pausedRecipes.currentStep') }}
            {{
              paused.step < 0
                ? t('modal.pausedRecipes.tare')
                : paused.preparation.ingredients[paused.step]?.name
            }}
          </div>

          <button
            @click="onSelect(paused.id)"
            class="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            {{ t('modal.pausedRecipes.resume') }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-4">
      <button
        @click="emit('close-modal')"
        class="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition"
      >
        {{ t('modal.pausedRecipes.close') }}
      </button>
    </div>
  </Modal>
</template>
