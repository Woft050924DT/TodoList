<template>
  <button
    @click="$emit('toggle')"
    class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
    :class="
      completed
        ? 'bg-violet-100 text-violet-700'
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
    "
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    {{ completed ? "Chưa hoàn thành" : "Đánh dấu hoàn thành" }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ completed: boolean }>();
defineEmits<{ toggle: [] }>();
</script>
