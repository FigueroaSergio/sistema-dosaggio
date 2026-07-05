<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    items: Record<string, any> | any[];
    selectedKey?: string | number | null;
    emptyMessage?: string;
    keyField?: string;
    multiSelect?: boolean;
    modelValue?: string[];
  }>(),
  {
    selectedKey: null,
    emptyMessage: "No items",
    keyField: "name",
    multiSelect: false,
    modelValue: () => [],
  },
);

const emit = defineEmits<{
  (e: "select", key: string): void;
  (e: "update:modelValue", value: string[]): void;
}>();

const toggleCheck = (key: string) => {
  const newValue = [...props.modelValue];
  const idx = newValue.indexOf(key);
  if (idx >= 0) {
    newValue.splice(idx, 1);
  } else {
    newValue.push(key);
  }
  emit("update:modelValue", newValue);
};

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
      @click="multiSelect ? toggleCheck(item.key) : $emit('select', item.key)"
      class="p-2 border-b cursor-pointer transition flex justify-between items-center"
      :class="{
        'bg-teal-50 ring-1 ring-teal-600':
          !multiSelect && selectedKey === item.key,
        'bg-teal-50 ring-1 ring-teal-400':
          multiSelect && modelValue.includes(item.key),
        'hover:bg-gray-200':
          (multiSelect && !modelValue.includes(item.key)) ||
          (!multiSelect && selectedKey !== item.key),
      }"
    >
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <input
          v-if="multiSelect"
          type="checkbox"
          :checked="modelValue.includes(item.key)"
          @click.stop="toggleCheck(item.key)"
          class="h-4 w-4 accent-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer flex-shrink-0"
        />
        <div class="min-w-0">
          <div class="font-bold text-gray-800 truncate">
            <slot name="header" :item="item">
              {{ item.name }}
            </slot>
          </div>
          <div class="text-sm text-gray-500 mt-1">
            <slot name="description" :item="item" />
          </div>
        </div>
      </div>
      <slot name="actions" :item="item" />
    </li>
  </ul>
</template>
