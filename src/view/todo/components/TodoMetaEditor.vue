<template>
  <div class="flex gap-4">
    <div class="flex-1">
      <div
        class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
      >
        Mức độ ưu tiên
      </div>
      <select
        :value="priority"
        @change="
          $emit(
            'update:priority',
            ($event.target as HTMLSelectElement).value as Priority,
          )
        "
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
        :class="prioritySelectColors[priority]"
      >
        <option>Thấp</option>
        <option>Vừa</option>
        <option>Cao</option>
      </select>
    </div>
    <div class="flex-1">
      <div
        class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
      >
        Danh mục
      </div>
      <select
        :value="categoryId"
        @change="
          $emit(
            'update:categoryId',
            Number(($event.target as HTMLSelectElement).value),
          )
        "
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
      >
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Priority } from "@/types";
import { prioritySelectColors } from "./todoDisplay";

defineProps<{
  priority: Priority;
  categoryId?: number | null;
  categories: Category[];
}>();

defineEmits<{
  "update:priority": [value: Priority];
  "update:categoryId": [value: number];
}>();
</script>
