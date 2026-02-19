<script setup>
defineEmits([
  "click-history",
  "click-import-csv",
  "click-export-csv",
  "click-manage",
]);
</script>
<template>
  <nav class="bg-teal-700 text-white shadow-lg mb-8 rounded-lg">
    <div class="max-w-6xl mx-auto px-4 py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="text-xl font-bold">Gestione Ricette</div>
        <div class="flex flex-wrap gap-2">
          <button
            id="view-history-navbar-btn"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition duration-150"
            title="Visualizza storico preparazioni"
            @click="$emit('click-history')"
          >
            📋 Storico
          </button>
          <button
            id="import-csv-btn"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition duration-150"
            title="Carica ricette da CSV"
            @click="$emit('click-import-csv')"
          >
            📥 Importa CSV
          </button>
          <button
            id="export-csv-btn"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-150"
            title="Esporta ricette in CSV"
            @click="$emit('click-export-csv')"
          >
            📤 Esporta CSV
          </button>
          <button
            id="manage-recipes-btn"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition duration-150"
            title="Crea o modifica ricette"
            @click="$emit('click-manage')"
          >
            ✏️ Gestisci Ricette
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
