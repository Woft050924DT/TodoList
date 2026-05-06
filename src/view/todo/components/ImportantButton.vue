<template>
  <button
    @click="$emit('toggle')"
    class="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
    :class="
      starred
        ? 'bg-amber-50 text-amber-500 border border-amber-200'
        : 'bg-gray-50 text-gray-400 border border-gray-200 hover:border-amber-200 hover:text-amber-400'
    "
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
    {{ starred ? "Đã đánh dấu quan trọng" : "Đánh dấu quan trọng" }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ starred?: boolean }>();
defineEmits<{ toggle: [] }>();
</script>
