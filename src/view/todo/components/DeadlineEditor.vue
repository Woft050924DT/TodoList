<template>
  <div>
    <div class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      Háº¡n chÃ³t
    </div>
    <div class="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8b5cf6"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <input
        type="date"
        :value="deadline || ''"
        @change="$emit('update:deadline', ($event.target as HTMLInputElement).value || undefined)"
        class="text-sm text-gray-600 focus:outline-none flex-1 bg-transparent"
      />
    </div>
    <p
      v-if="deadlineLabel && !completed"
      class="text-xs mt-2 font-semibold flex items-center gap-1"
      :class="isOverdue ? 'text-red-500' : 'text-amber-500'"
    >
      <span>{{ isOverdue ? "âš " : "â°" }}</span> {{ deadlineLabel }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  deadline?: string;
  deadlineLabel: string;
  completed: boolean;
  isOverdue: boolean;
}>();

defineEmits<{
  "update:deadline": [value: string | undefined];
}>();
</script>
