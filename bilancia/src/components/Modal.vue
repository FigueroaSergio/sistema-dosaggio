<script setup>
import { reactive, computed } from "vue";
defineEmits(["close-modal"]);
const { active = false, title = "Modal" } = defineProps({
  active: Boolean,
  title: String,
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
        class="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 my-8"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
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
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
