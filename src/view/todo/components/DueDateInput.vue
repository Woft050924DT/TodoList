<template>
  <div class="flex items-center gap-2">
    <input
      type="date"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
    />
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="text-gray-400 hover:text-red-500 transition-colors"
      title="Xóa ngày hết hạn"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
