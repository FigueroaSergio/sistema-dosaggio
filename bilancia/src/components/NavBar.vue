<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  title: string;
}>();

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
      <!-- Title -->
      <h1 class="text-xl lg:text-2xl font-bold text-gray-800 truncate flex-1">
        {{ title }}
      </h1>

      <!-- Desktop Actions -->
      <div class="hidden lg:flex items-center gap-2">
        <slot name="actions"></slot>
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMenu"
        class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Toggle menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Sidebar/Drawer Overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen"
        @click="toggleMenu"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
      ></div>
    </Transition>

    <!-- Mobile Sidebar/Drawer -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isMenuOpen"
        class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 lg:hidden flex flex-col p-6"
      >
        <div class="flex items-center justify-between mb-8">
          <span class="font-bold text-gray-800">Menu</span>
          <button
            @click="toggleMenu"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="flex flex-col gap-3 sidebar-actions" @click="toggleMenu">
          <slot name="actions"></slot>
        </div>
      </aside>
    </Transition>
  </header>
</template>

<style scoped>
/* Ensure actions look good in both desktop and mobile */
.sidebar-actions :deep(button) {
  @apply w-full flex items-center justify-center;
}

.lg\:flex :deep(button) {
  @apply lg:w-auto flex items-center justify-center;
}
</style>
