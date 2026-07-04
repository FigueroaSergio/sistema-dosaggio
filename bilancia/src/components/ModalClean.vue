<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import BaseBtn from "./BaseBtn.vue";
const { t } = useI18n();
defineEmits<{ (e: "close-modal"): void; (e: "confirm"): void }>();
const { active } = defineProps({ active: Boolean });
</script>
<template>
  <Modal
    :active="active"
    :title="t('modal.clean.title')"
    @close-modal="$emit('close-modal')"
  >
    <div>
      <p class="text-gray-600 mb-6">
        {{ t("modal.clean.instruction") }}
      </p>
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6"
      >
        <p class="text-yellow-800 font-medium">
          {{ t("modal.clean.warning") }}
        </p>
      </div>
    </div>
    <template #footer>
      <BaseBtn
        id="clean-scale-confirm-btn"
        variant="primary"
        size="lg"
        block
        @click="$emit('confirm')"
      >
        {{ t("modal.clean.done") }}
      </BaseBtn>
    </template>
  </Modal>
</template>
