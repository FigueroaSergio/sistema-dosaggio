<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Recipe } from "../composables/useRecipes";
import Modal from "./Modal.vue";
const { t } = useI18n();
const model = defineModel<number | null>();
const emits = defineEmits<{ (e: "close-modal"): void; (e: "confirm"): void }>();
const { active, recipe } = defineProps<{
  active: Boolean;
  recipe: Recipe | undefined;
}>();
const showError = ref(false);
const name = computed(() => recipe?.name ?? "");
const total = computed(() => {
  return recipe?.ingredients.reduce((prev, cur) => prev + cur.grams, 0) ?? 0;
});
const error = computed(() => !model.value || model.value <= 0);
const onConfirm = () => {
  if (error.value) {
    showError.value = true;
    return;
  }
  showError.value = false;
  emits("confirm");
};
</script>
<template>
  <Modal
    :active="active"
    :title="t('modal.quantity.title')"
    @close-modal="$emit('close-modal')"
  >
    <p class="text-gray-600 mb-6">
      {{ t('modal.quantity.instruction') }}
    </p>
    <div class="mb-6">
      <label
        for="desired-quantity-input"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        {{ t('modal.quantity.label') }}
      </label>
      <input
        id="desired-quantity-input"
        type="number"
        @input="if (model && model < 1) model = 0;"
        min="1"
        step="0.1"
        v-model.number="model"
        placeholder="es. 500"
        :class="`w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150 ${showError && error ? 'input-error' : ''}`"
        :aria-invalid="error"
      />
      <div class="error-message" v-if="error && showError">
        {{ t('modal.quantity.invalidError') }}
      </div>
    </div>
    <div
      id="recipe-info"
      class="bg-blue-50 p-3 rounded-lg mb-6 text-sm text-blue-900"
    >
      <strong>{{ t('modal.quantity.recipe') }}</strong> {{ name }}
      <br />
      <strong>{{ t('modal.quantity.originalWeight') }} </strong>{{ total.toFixed(2) }} g
    </div>
    <div class="flex gap-3">
      <button
        id="cancel-quantity-btn"
        class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition duration-150"
        @click="$emit('close-modal')"
      >
        {{ t('modal.quantity.cancel') }}
      </button>
      <button
        id="confirm-quantity-btn"
        class="flex-1 px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-150"
        @click="onConfirm"
      >
        {{ t('modal.quantity.confirm') }}
      </button>
    </div>
  </Modal>
</template>
