<template>
  <select
    :value="modelValue"
    @change="onChange"
    class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
  >
    <option value="">{{ placeholder }}</option>
    <option v-for="category in categories" :key="category.id" :value="category.id">
      {{ getCategoryIcon(category.name) }} {{ category.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { Category } from "@/types";
import { getCategoryIcon } from "./todoDisplay";

withDefaults(
  defineProps<{
    modelValue: number | null | undefined;
    categories: Category[];
    placeholder?: string;
  }>(),
  {
    placeholder: "Chá»n danh má»¥c",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
}>();

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  emit("update:modelValue", value ? Number(value) : null);
}
</script>
