<template>
  <div class="flex gap-1">
    <button
      v-for="priority in priorityOptions"
      :key="priority.value"
      @click="$emit('update:modelValue', priority.value)"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
      :class="
        modelValue === priority.value
          ? priority.activeClass
          : 'border-gray-200 text-gray-500 hover:border-gray-300'
      "
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        />
      </svg>
      {{ priority.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Priority } from "@/types";
import { priorityOptions } from "./todoDisplay";

defineProps<{ modelValue: Priority }>();

defineEmits<{
  "update:modelValue": [value: Priority];
}>();
</script>
