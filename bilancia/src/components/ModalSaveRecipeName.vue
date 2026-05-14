<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "./Modal.vue";

const props = defineProps<{ 
  active: boolean;
  defaultName: string;
}>();

const emit = defineEmits<{
  (e: "close-modal"): void;
  (e: "confirm", name: string): void;
}>();

const recipeName = ref("");

watch(() => props.active, (newActive) => {
  if (newActive) {
    recipeName.value = props.defaultName;
  }
});

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
    title="Nome Nuova Ricetta"
    @close-modal="$emit('close-modal')"
  >
    <div class="p-4">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Inserisci il nome per la nuova ricetta:
      </label>
      <input
        v-model="recipeName"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition mb-6"
        placeholder="Nome della ricetta..."
        @keyup.enter="onConfirm"
      />
      <div class="flex justify-end gap-4">
        <button
          @click="$emit('close-modal')"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Annulla
        </button>
        <button
          @click="onConfirm"
          class="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition shadow-sm"
          :disabled="!recipeName.trim()"
        >
          Salva
        </button>
      </div>
    </div>
  </Modal>
</template>
