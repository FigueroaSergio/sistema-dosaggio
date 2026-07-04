<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";

const { t } = useI18n();

defineProps<{ active: boolean }>();
defineEmits<{
  (e: "close-modal"): void;
  (e: "confirm", save: boolean): void;
}>();
</script>

<template>
  <Modal
    :active="active"
    :title="t('modal.confirmSave.title')"
    @close-modal="$emit('close-modal')"
  >
    <div class="p-4 text-center">
      <p class="text-lg text-gray-700 mb-6">
        {{ t('modal.confirmSave.question') }}
      </p>
      <div class="flex justify-center flex-wrap gap-4">
        <button
          @click="$emit('confirm', false)"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          {{ t('modal.confirmSave.no') }}
        </button>
        <button
          @click="$emit('confirm', true)"
          class="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm"
        >
          {{ t('modal.confirmSave.yes') }}
        </button>
      </div>
    </div>
  </Modal>
</template>
