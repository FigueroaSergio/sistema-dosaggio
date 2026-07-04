<script setup>
import { reactive, computed } from "vue";
defineEmits(["close-modal"]);
const {
  active = false,
  title = "Modal",
  fullscreen = false,
} = defineProps({
  active: Boolean,
  title: String,
  fullscreen: Boolean,
});
const style = computed(() => ({ display: active ? "flex" : "none" }));
</script>
<template>
  <Teleport to="#modals">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      :style="style"
    >
      <div
        :class="
          fullscreen
            ? 'bg-white rounded-xl shadow-2xl p-4 w-full h-full max-w-none mx-0 my-0 min-h-0 flex flex-col'
            : 'bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full mx-4 my-8 max-h-[80vh] flex flex-col overflow-hidden'
        "
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">
            {{ title }}
          </h2>
          <button
            id="close-history-modal"
            class="text-gray-500 hover:text-gray-800 font-bold text-2xl"
            @click="$emit('close-modal')"
          >
            ✕
          </button>
        </div>
        <div class="overflow-y-auto min-h-0 flex-1">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
