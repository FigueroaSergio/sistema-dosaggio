<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>
<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <button
        @click="router.push('/preparation')"
        class="bg-teal-500 border-2 border-teal-600 hover:bg-teal-600 hover:shadow-lg rounded-xl p-12 text-center transition duration-300 flex flex-col items-center justify-center min-h-[200px]"
      >
        <span class="text-2xl md:text-3xl font-bold text-white"
          >{{ $t('home.startRecipe') }}</span
        >
      </button>

      <button
        @click="router.push('/manage')"
        class="bg-blue-500 border-2 border-blue-600 hover:bg-blue-600 hover:shadow-lg rounded-xl p-12 text-center transition duration-300 flex flex-col items-center justify-center min-h-[200px]"
      >
        <span class="text-2xl md:text-3xl font-bold text-white"
          >{{ $t('home.manageRecipes') }}</span
        >
      </button>

      <button
        @click="router.push('/history')"
        class="bg-purple-500 border-2 border-purple-600 hover:bg-purple-600 hover:shadow-lg rounded-xl p-12 text-center transition duration-300 flex flex-col items-center justify-center min-h-[200px]"
      >
        <span class="text-2xl md:text-3xl font-bold text-white"
          >{{ $t('home.recipeHistory') }}</span
        >
      </button>
    </div>
  </div>
</template>
