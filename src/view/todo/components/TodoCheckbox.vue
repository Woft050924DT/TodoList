<template>
  <button
    @click.stop="$emit('toggle')"
    class="mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all"
    :class="
      completed
        ? 'bg-violet-600 border-violet-600'
        : 'border-gray-300 hover:border-violet-400'
    "
  >
    <svg
      v-if="completed"
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
</template>

<script setup lang="ts">
defineProps<{ completed: boolean }>();
defineEmits<{ toggle: [] }>();
</script>
