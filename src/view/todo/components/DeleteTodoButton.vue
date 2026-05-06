<template>
  <button
    @click="$emit('delete')"
    class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
    Xóa công việc
  </button>
</template>

<script setup lang="ts">
defineEmits<{ delete: [] }>();
</script>
