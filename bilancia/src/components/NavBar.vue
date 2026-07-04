<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

defineProps<{
  title: string;
}>();

const { locale } = useI18n();

const isMenuOpen = ref(false);
const isLangOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleLang = () => {
  isLangOpen.value = !isLangOpen.value;
};

const setLocale = (lang: string) => {
  locale.value = lang;
  localStorage.setItem("bilancia-locale", lang);
  isLangOpen.value = false;
};

const languages = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];
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

      <!-- Language Selector (Desktop) -->
      <div class="relative hidden lg:block">
        <button
          @click="toggleLang"
          class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0 flex items-center gap-1"
          aria-label="Change language"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          <span class="text-sm font-medium">{{ locale.toUpperCase() }}</span>
        </button>
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isLangOpen"
            class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]"
          >
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="setLocale(lang.code)"
              class="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
              :class="{ 'bg-teal-50 text-teal-700 font-medium': locale === lang.code }"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </Transition>
      </div>

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
        style="
          padding-top: calc(1.5rem + env(safe-area-inset-top));
          padding-right: calc(1.5rem + env(safe-area-inset-right));
          padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
        "
      >
        <div class="flex items-center justify-between mb-8">
          <span class="font-bold text-gray-800">{{ $t('nav.menu') }}</span>
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

        <!-- Language Selector (Mobile) -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
            <span class="text-xs font-medium text-gray-500 uppercase">Idioma</span>
          </div>
          <div class="flex flex-col gap-1">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="setLocale(lang.code)"
              class="w-full px-3 py-2 text-left text-sm flex items-center gap-2 rounded-lg transition-colors"
              :class="locale === lang.code ? 'bg-teal-50 text-teal-700 font-medium border border-teal-200' : 'text-gray-700 hover:bg-gray-100'"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
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
