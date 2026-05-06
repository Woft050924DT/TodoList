<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <div
        class="text-xs font-semibold uppercase tracking-widest text-gray-400"
      >
        Công việc con
      </div>
      <span class="text-xs font-bold text-violet-600"
        >{{ done }}/{{ subtasks.length }}</span
      >
    </div>
    <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
      <div
        class="bg-violet-500 h-2 rounded-full transition-all duration-300"
        :style="`width:${progress}%`"
      ></div>
    </div>

    <div class="space-y-2">
      <div
        v-for="subtask in subtasks"
        :key="subtask.id"
        class="flex items-center gap-3 group"
      >
        <button
          @click="$emit('toggle-subtask', subtask.id)"
          class="w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all"
          :class="
            subtask.done
              ? 'bg-violet-500 border-violet-500'
              : 'border-gray-300 hover:border-violet-400'
          "
        >
          <svg
            v-if="subtask.done"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
        <span
          class="text-sm flex-1"
          :class="subtask.done ? 'line-through text-gray-400' : 'text-gray-700'"
        >
          {{ subtask.title }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3">
      <input
        :value="newSubtask"
        @input="
          $emit('update:newSubtask', ($event.target as HTMLInputElement).value)
        "
        @keyup.enter="$emit('add-subtask')"
        placeholder="Thêm công việc con..."
        class="flex-1 text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-violet-400 text-gray-600 placeholder-gray-300 transition bg-transparent"
      />
      <button
        @click="$emit('add-subtask')"
        class="text-violet-400 hover:text-violet-600 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Subtask } from "@/types";

defineProps<{
  subtasks: Subtask[];
  done: number;
  progress: number;
  newSubtask: string;
}>();

defineEmits<{
  "toggle-subtask": [id: string];
  "update:newSubtask": [value: string];
  "add-subtask": [];
}>();
</script>
