<template>
  <input
    :value="title"
    @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
    placeholder="Tiêu đề công việc..."
    class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 mb-3 transition"
  />
  <textarea
    :value="description"
    @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
    placeholder="Mô tả (tùy chọn)..."
    rows="3"
    class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 mb-4 transition resize-none"
  ></textarea>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();

defineEmits<{
  "update:title": [value: string];
  "update:description": [value: string];
}>();
</script>
