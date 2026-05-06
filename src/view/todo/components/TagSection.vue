<template>
  <div>
    <div
      class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3"
    >
      Thẻ nhán
    </div>
    <div class="flex flex-wrap gap-2 mb-3">
      <span
        v-for="tag in tags"
        :key="tag"
        class="flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium"
      >
        {{ tag }}
        <button
          @click="$emit('remove-tag', tag)"
          class="hover:text-red-500 transition-colors"
        >
          Ã—
        </button>
      </span>
    </div>
    <div class="flex items-center gap-2">
      <input
        :value="newTag"
        @input="
          $emit('update:newTag', ($event.target as HTMLInputElement).value)
        "
        @keyup.enter="$emit('add-tag')"
        placeholder="Thêm thẻ nhán..."
        class="flex-1 text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-violet-400 text-gray-600 placeholder-gray-300 transition bg-transparent"
      />
      <button
        @click="$emit('add-tag')"
        class="text-violet-400 hover:text-violet-600 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[];
  newTag: string;
}>();

defineEmits<{
  "remove-tag": [tag: string];
  "update:newTag": [value: string];
  "add-tag": [];
}>();
</script>
