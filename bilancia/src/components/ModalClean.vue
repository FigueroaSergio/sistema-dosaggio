<script setup lang="ts">
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
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
        {{ t('modal.clean.instruction') }}
      </p>
      <div
        class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6"
      >
        <p class="text-yellow-800 font-medium">
          {{ t('modal.clean.warning') }}
        </p>
      </div>
      <button
        id="clean-scale-confirm-btn"
        class="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-150"
        @click="$emit('confirm')"
      >
        {{ t('modal.clean.done') }}
      </button>
    </div>
  </Modal>
</template>
