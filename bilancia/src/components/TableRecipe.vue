<template>
  <div class="bg-white shadow-lg rounded-xl p-6">
    <h2 id="prep-title" class="text-2xl font-bold text-gray-800 mb-4">
      Dettaglio della Ricetta
    </h2>

    <div class="overflow-x-auto">
      <table id="recipe-table" class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ingrediente
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Richiesto (g)
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Peso Aggiunto (g)
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
            >
              Progresso
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              % Versato
            </th>
          </tr>
        </thead>
        <tbody id="recipe-table-body" class="bg-white divide-y divide-gray-200">
          <!-- Filas de ingredientes se insertarán aquí -->
        </tbody>
      </table>
    </div>
  </div>
</template>
