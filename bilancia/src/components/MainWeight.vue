<template>
  <div
    id="main-status-card"
    class="bg-white shadow-xl rounded-xl p-6 mb-8 border border-teal-200"
  >
    <h2 class="text-lg font-semibold text-gray-700 mb-3">
      Peso Netto Aggiunto
    </h2>

    <!-- DISPLAY PRINCIPAL -->
    <div class="flex flex-col items-center justify-center py-4">
      <!-- Main Weight Display -->
      <div class="flex items-end">
        <span
          id="added-weight-display"
          class="weight-main-display text-gray-800 transition-colors duration-300 text-3xl"
          >0.00</span
        >
        <span class="text-3xl text-gray-500 ml-2 mb-2">g</span>
      </div>

      <!-- Small Instruction/Target Text -->
      <p
        id="target-weight-display"
        class="text-center text-sm text-gray-400 font-semibold mt-[-10px]"
      >
        Peso netto (Peso lordo - Tara precedente)
      </p>

      <!-- Current Ingredient Progress Bar -->
      <div
        id="main-progress-bar-container"
        class="w-full mt-4"
        style="display: none"
      >
        <progress
          id="main-progress-bar"
          value="0"
          max="100"
          class="w-full bar-color-black"
        ></progress>
        <p
          id="main-progress-percent"
          class="text-sm font-medium text-gray-500 text-center mt-1 progress-color-black"
        >
          0% Versato
        </p>
      </div>
    </div>

    <!-- INSTRUCCIÓN ACTUAL -->
    <div class="bg-teal-50 border-l-4 border-teal-500 p-4 mt-4 rounded-md">
      <p id="current-instruction" class="text-teal-800 font-medium">
        👋 Seleziona una ricetta per iniziare la preparazione.
      </p>
    </div>

    <!-- ACCIONES DE PREPARACIÓN -->
    <div id="prep-actions" class="flex gap-4 mt-6 justify-center">
      <button
        id="zero-btn"
        class="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-150 w-full max-w-xs sm:max-w-[150px]"
      >
        Azzerare
      </button>
      <button
        id="next-ingredient-btn"
        class="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
        style="display: none"
      >
        Ingrediente Successivo
      </button>
      <button
        id="recalc-btn"
        class="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg shadow-md hover:bg-amber-600 transition duration-150 w-full max-w-xs sm:max-w-[200px]"
        style="display: none"
        title="Ricalcola le quantità degli ingredienti rimanenti per assorbire l'eccesso"
      >
        Ricalcola Quantità
      </button>
    </div>
  </div>
</template>
