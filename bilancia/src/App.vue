<script setup lang="ts">
import { onMounted } from 'vue';
import { initRecipes } from './composables/useRecipes';
import { initHistory } from './composables/useHistory';
import "./index.css";

onMounted(async () => {
  await initRecipes();
  await initHistory();
});
</script>

<template>
  <router-view></router-view>
</template>

<style>
.input-error {
  border-color: #ef4444 !important;
  background: #ff000011;
}

.input-error::placeholder {
  color: #dc2626;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
