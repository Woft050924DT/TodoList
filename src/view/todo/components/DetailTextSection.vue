<template>
  <div>
    <div class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      {{ label }}
    </div>
    <p :class="contentClass">
      {{ value || fallback }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value?: string;
    fallback?: string;
    contentClass?: string | string[] | Record<string, boolean>;
  }>(),
  {
    fallback: "â€”",
    contentClass: "text-sm text-gray-600 leading-relaxed",
  },
);
</script>
