<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import BaseBtn from "./BaseBtn.vue";

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
        <BaseBtn variant="secondary" outline @click="$emit('confirm', false)">
          {{ t('modal.confirmSave.no') }}
        </BaseBtn>
        <BaseBtn variant="primary" @click="$emit('confirm', true)">
          {{ t('modal.confirmSave.yes') }}
        </BaseBtn>
      </div>
    </div>
  </Modal>
</template>
