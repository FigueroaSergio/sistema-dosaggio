<script setup lang="ts">
import Modal from "./Modal.vue";
import { HistoryEntry } from "../composables/useHistory";
const { active, history } = defineProps<{ active: boolean; history: HistoryEntry[] }>();
</script>
<template>
  <Modal :active="active" title="📋 Storico Preparazioni">
    <div>
      <div id="history-list" class="max-h-96 overflow-y-auto">
        <div v-for="entry in history" :key="entry.timestamp" class="p-4 border-b">
          <div class="font-bold">{{ entry.preparation.name }}</div>
          <div class="text-sm text-gray-500">{{ new Date(entry.timestamp).toLocaleString() }}</div>
          <ul class="mt-2 space-y-1">
            <li v-for="ing in entry.preparation.ingredients" :key="ing.name" class="text-sm flex justify-between">
              <span>{{ ing.name }}</span>
              <span :class="{'text-red-500': Math.abs(ing.weight - ing.grams) > ing.tolerance}">
                {{ ing.weight.toFixed(2) }}g / {{ ing.grams.toFixed(2) }}g
              </span>
            </li>
          </ul>
        </div>
        <div v-if="!history || history.length === 0" class="text-center text-gray-500 py-4">
          Nessuna preparazione in storico.
        </div>
      </div>

      <div class="mt-6">
        <button
          id="close-history-btn"
          class="w-full px-4 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition duration-150"
          @click="$emit('close-modal')"
        >
          Chiudi
        </button>
      </div>
    </div>
  </Modal>
</template>
