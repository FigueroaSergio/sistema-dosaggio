<script setup lang="ts">
import { ref } from "vue";
import NavBar from "./components/NavBar.vue";
import MainWeight from "./components/MainWeight.vue";
import Recipe from "./components/Recipe.vue";
import "./index.css";
import TableRecipe from "./components/TableRecipe.vue";
import ModaHistory from "./components/ModaHistory.vue";
import ModalClean from "./components/ModalClean.vue";
import ModalImport from "./components/ModalImport.vue";
import ModalQuantity from "./components/ModalQuantity.vue";
import ModalManage from "./components/ModalManage.vue";
const openHistory = ref(false);
const openImport = ref(false);
const openExport = ref(false);
const openManage = ref(false);
const openClean = ref(false);
const openQuantity = ref(false);
</script>

<template>
  <body class="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
    <nav-bar
      @click-history="openHistory = true"
      @click-import-csv="openImport = true"
      @click-export-csv="openExport = true"
      @click-manage="openManage = true"
    ></nav-bar>
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-extrabold text-gray-900">
          Sistema di Dosaggio Intelligente
        </h1>
        <p class="text-gray-500">
          Guida passo-passo per le tue ricette.
          <span class="font-bold">Inserimento peso in Kg.</span>
        </p>
      </header>
      <ModaHistory
        :active="openHistory"
        @close-modal="openHistory = false"
      ></ModaHistory>
      <ModalClean :active="openClean"></ModalClean>
      <ModalImport
        :active="openImport"
        @close-modal="openImport = false"
      ></ModalImport>
      <ModalManage
        :active="openManage"
        @close-modal="openManage = false"
      ></ModalManage>
      <ModalQuantity :active="openQuantity"></ModalQuantity>

      <main-weight></main-weight>
      <recipe></recipe>
      <table-recipe></table-recipe>
    </div>
  </body>
</template>

<style scoped></style>
