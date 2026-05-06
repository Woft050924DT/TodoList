<template>
  <div class="flex flex-wrap gap-1.5 mt-2 items-center">
    <span
      class="px-2 py-0.5 rounded-full text-[10px] font-medium"
      :class="
        category
          ? categoryBadgeColors[category] || 'bg-gray-100 text-gray-600'
          : 'bg-gray-100 text-gray-600'
      "
    >
      {{ category }}
    </span>
    <span
      class="px-2 py-0.5 rounded-full text-[10px] font-medium"
      :class="priorityBadgeColors[priority]"
    >
      {{ priority }}
    </span>
    <span
      v-if="deadline"
      class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      :class="
        isOverdue && !completed
          ? 'bg-red-100 text-red-600'
          : 'bg-gray-100 text-gray-500'
      "
    >
      <svg
        width="9"
        height="9"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {{ deadlineLabel }}
    </span>
    <span
      v-for="tag in tags"
      :key="tag"
      class="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-medium"
    >
      {{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CategoryName, Priority } from "@/types";
import { categoryBadgeColors, priorityBadgeColors } from "./todoDisplay";

defineProps<{
  category?: CategoryName;
  priority: Priority;
  deadline?: string;
  deadlineLabel: string;
  isOverdue: boolean;
  completed: boolean;
  tags: string[];
}>();
</script>
