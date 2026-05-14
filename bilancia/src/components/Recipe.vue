<script setup lang="ts">
import { computed, ref } from "vue";
import Modal from "./Modal.vue";
import { Preparation } from "../composables/usePreparation.ts";

const props = defineProps<{
  preparation: Preparation;
  total: number;
}>();

const showFullNote = ref(false);

const truncatedNote = computed(() => {
  const note = props?.preparation?.note ?? "";
  if (note.length > 100) {
    return note.substring(0, 100) + "...";
  }
  return note;
});
</script>
<template>
  <div class="space-y-4 mb-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Peso Lordo
        </p>
        <span id="raw-weight" class="text-4xl font-extrabold text-gray-800"
          >{{ total.toFixed(2) }} g</span
        >
      </div>

      <div
        v-if="preparation?.note"
        @click="showFullNote = true"
        class="bg-teal-50 p-4 rounded-lg border border-teal-100 shadow-sm cursor-pointer hover:bg-teal-100 transition"
      >
        <p
          class="text-sm font-semibold text-teal-800 mb-1 flex items-center uppercase tracking-wider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Note Ricetta
        </p>
        <p class="text-sm text-teal-700 leading-tight">
          {{ truncatedNote }}
          <span
            v-if="preparation.note.length > 100"
            class="text-xs font-bold text-teal-600 underline block mt-1"
            >Leggi tutto</span
          >
        </p>
      </div>
      <div
        v-else
        class="bg-gray-50 p-4 rounded-lg border border-gray-200 border-dashed flex items-center justify-center"
      >
        <p class="text-gray-400 text-sm italic">
          Nessuna nota per questa ricetta
        </p>
      </div>
    </div>

    <Modal
      :active="showFullNote"
      title="Note Ricetta"
      @close-modal="showFullNote = false"
    >
      <div class="prose prose-sm max-w-none">
        <p class="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {{ preparation?.note }}
        </p>
      </div>
      <div class="mt-8 flex justify-end">
        <button
          @click="showFullNote = false"
          class="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          Chiudi
        </button>
      </div>
    </Modal>
  </div>
</template>
