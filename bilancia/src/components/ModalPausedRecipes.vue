<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePausedPreparations } from "../composables/usePausedPreparations";
import Modal from "./Modal.vue";
import BaseBtn from "./BaseBtn.vue";

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
  <Modal
    :active="active"
    :title="t('modal.pausedRecipes.title')"
    @close-modal="emit('close-modal')"
  >
    <template>
      <div
        v-if="pausedPreparations.length === 0"
        class="text-center py-10 text-gray-500"
      >
        {{ t("modal.pausedRecipes.noPaused") }}
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
            <BaseBtn
              variant="danger"
              size="xs"
              :title="t('modal.pausedRecipes.deleteTooltip')"
              @click="onRemove(paused.id)"
            >
              <template #icon>
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
              </template>
            </BaseBtn>
          </div>

          <div class="text-sm text-gray-600 mb-4">
            {{ t("modal.pausedRecipes.currentStep") }}
            {{
              paused.step < 0
                ? t("modal.pausedRecipes.tare")
                : paused.preparation.ingredients[paused.step]?.name
            }}
          </div>

          <BaseBtn variant="info" block @click="onSelect(paused.id)">
            {{ t("modal.pausedRecipes.resume") }}
          </BaseBtn>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseBtn variant="secondary" outline @click="emit('close-modal')">
        {{ t("modal.pausedRecipes.close") }}
      </BaseBtn>
    </template>
  </Modal>
</template>
