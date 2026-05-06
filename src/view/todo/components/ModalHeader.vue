<template>
  <div
    class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
  >
    <component :is="titleTag" class="font-semibold text-lg text-gray-800">
      {{ title }}
    </component>
    <button
      @click="$emit('close')"
      class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
      aria-label="Close"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    titleTag?: "h3" | "span";
  }>(),
  {
    titleTag: "h3",
  },
);

defineEmits<{ close: [] }>();
</script>
