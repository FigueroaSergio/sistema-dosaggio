<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    items: Record<string, any> | any[];
    selectedKey?: string | number | null;
    emptyMessage?: string;
    keyField?: string;
  }>(),
  {
    selectedKey: null,
    emptyMessage: "No items",
    keyField: "name",
  },
);

defineEmits<{
  (e: "select", key: string): void;
}>();

const normalizedItems = computed(() => {
  if (Array.isArray(props.items)) {
    return props.items.map((item, idx) => ({
      key: item[props.keyField] ?? String(idx),
      ...item,
    }));
  }
  return Object.entries(props.items).map(([key, recipe]) => ({
    key,
    ...recipe,
  }));
});
</script>

<template>
  <ul class="flex-1 overflow-y-auto">
    <li
      v-if="normalizedItems.length === 0"
      class="text-gray-500 text-center py-8"
    >
      {{ emptyMessage }}
    </li>
    <li
      v-for="item in normalizedItems"
      :key="item.key"
      @click="$emit('select', item.key)"
      class="p-2 border-b cursor-pointer transition flex justify-between items-center"
      :class="{
        'bg-teal-50 ring-1 ring-teal-600': selectedKey === item.key,
        'hover:bg-gray-200': selectedKey !== item.key,
      }"
    >
      <div>
        <div class="font-bold text-gray-800">
          <slot name="header" :item="item">
            {{ item.name }}
          </slot>
        </div>
        <div class="text-sm text-gray-500 mt-1">
          <slot name="description" :item="item" />
        </div>
      </div>
      <slot name="actions" :item="item" />
    </li>
  </ul>
</template>
