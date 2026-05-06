<template>
  <div v-if="total" class="mt-3">
    <div class="mb-1.5 flex items-center justify-between gap-2">
      <span class="text-[10px] text-violet-600 font-bold shrink-0">
        {{ done }}/{{ total }}
      </span>
    </div>
    <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        class="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  done: number;
  total: number;
  progress: number;
}>();
</script>
