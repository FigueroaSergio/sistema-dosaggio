<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "./Modal.vue";
import BaseBtn from "./BaseBtn.vue";

const { t } = useI18n();

const props = defineProps<{
  active: boolean;
  defaultName: string;
}>();

const emit = defineEmits<{
  (e: "close-modal"): void;
  (e: "confirm", name: string): void;
}>();

const recipeName = ref("");

watch(
  () => props.active,
  (newActive) => {
    if (newActive) {
      recipeName.value = props.defaultName;
    }
  },
);

const onConfirm = () => {
  if (recipeName.value.trim()) {
    emit("confirm", recipeName.value.trim());
    emit("close-modal");
  }
};
</script>

<template>
  <Modal
    :active="active"
    :title="t('modal.saveRecipeName.title')"
    @close-modal="$emit('close-modal')"
  >
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        {{ t("modal.saveRecipeName.instruction") }}
      </label>
      <input
        v-model="recipeName"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition mb-6"
        :placeholder="t('modal.saveRecipeName.placeholder')"
        @keyup.enter="onConfirm"
      />
    </div>
    <template #footer>
      <BaseBtn variant="secondary" size="lg" @click="$emit('close-modal')">
        {{ t("modal.saveRecipeName.cancel") }}
      </BaseBtn>
      <BaseBtn
        variant="primary"
        size="lg"
        :disabled="!recipeName.trim()"
        @click="onConfirm"
      >
        {{ t("modal.saveRecipeName.save") }}
      </BaseBtn>
    </template>
  </Modal>
</template>
