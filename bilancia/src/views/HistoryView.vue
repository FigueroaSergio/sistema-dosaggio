<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useHistory, type HistoryEntry } from '../composables/useHistory.ts';

const router = useRouter();
const { history } = useHistory();

const selectedEntry = ref<HistoryEntry | null>(null);

const selectEntry = (entry: HistoryEntry) => {
  selectedEntry.value = entry;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    <!-- Top bar -->
    <div class="border-b bg-white p-4 flex justify-between items-center shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800">Historico</h1>
      <button 
        @click="router.push('/')"
        class="px-4 py-2 border border-gray-300 bg-white rounded-lg font-medium hover:bg-gray-100 transition"
      >
        Home
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col md:flex-row p-4 gap-6 max-w-7xl mx-auto w-full">
      <!-- Lista ricette -->
      <div class="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">Lista ricette</div>
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="history.length === 0" class="text-gray-500 text-center py-8">
            Nessuna preparazione in storico.
          </div>
          <div 
            v-for="entry in history" 
            :key="entry.timestamp"
            @click="selectEntry(entry)"
            class="p-4 mb-2 border rounded-lg cursor-pointer transition"
            :class="{'border-green-500 bg-green-50 ring-1 ring-green-500': selectedEntry === entry, 'border-gray-200 hover:bg-gray-50': selectedEntry !== entry}"
          >
            <div class="font-bold text-gray-800">{{ entry.preparation.name }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ new Date(entry.timestamp).toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Dettaglio ricetta -->
      <div class="w-full md:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        <div class="p-4 border-b bg-gray-50 font-semibold text-gray-700">Dettaglio ricetta</div>
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="!selectedEntry" class="h-full flex items-center justify-center text-gray-400 text-lg">
            Seleziona una ricetta dalla lista per vedere i dettagli
          </div>
          <div v-else>
            <h2 class="text-3xl font-bold mb-2 text-gray-900">{{ selectedEntry.preparation.name }}</h2>
            <p class="text-gray-500 mb-8">{{ new Date(selectedEntry.timestamp).toLocaleString() }}</p>
            
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Ingredienti</h3>
            <ul class="space-y-3">
              <li 
                v-for="ing in selectedEntry.preparation.ingredients" 
                :key="ing.name" 
                class="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-gray-50"
              >
                <span class="font-medium text-gray-700 text-lg">{{ ing.name }}</span>
                <span 
                  class="font-mono px-3 py-1.5 rounded-md font-medium"
                  :class="{'text-red-700 bg-red-100': Math.abs(ing.weight - ing.grams) > ing.tolerance, 'text-gray-700 bg-gray-200': Math.abs(ing.weight - ing.grams) <= ing.tolerance}"
                >
                  {{ ing.weight.toFixed(2) }}g / {{ ing.grams.toFixed(2) }}g
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
