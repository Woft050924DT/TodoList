<template>
  <button
    @click.stop="$emit('toggle')"
    class="shrink-0 transition-colors"
    :class="starred ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{ starred?: boolean }>();
defineEmits<{ toggle: [] }>();
</script>
