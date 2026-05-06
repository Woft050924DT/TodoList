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

  <div class="mb-5">
    <div class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
      Công việc con
    </div>

    <div v-if="subtasks.length" class="space-y-2 mb-2">
      <div
        v-for="(item, index) in subtasks"
        :key="`${item}-${index}`"
        class="flex items-center gap-3 group"
      >
        <span
          class="w-5 h-5 shrink-0 rounded border border-gray-300 flex items-center justify-center"
        ></span>
        <span class="text-sm flex-1 text-gray-700">
          {{ item }}
        </span>
        <button
          type="button"
          @click="$emit('remove-subtask', index)"
          class="text-gray-300 hover:text-red-500 transition-colors"
          title="Xóa công việc con"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input
        :value="newSubtask"
        @input="
          $emit('update:newSubtask', ($event.target as HTMLInputElement).value)
        "
        @keyup.enter="$emit('add-subtask')"
        placeholder="Thêm công việc con..."
        class="flex-1 text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-violet-400 text-gray-600 placeholder-gray-300 transition bg-transparent"
      />
      <button
        type="button"
        @click="$emit('add-subtask')"
        class="text-violet-400 hover:text-violet-600 transition-colors"
        title="Thêm công việc con"
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
  title: string;
  description: string;
  newSubtask: string;
  subtasks: string[];
}>();

defineEmits<{
  "update:title": [value: string];
  "update:description": [value: string];
  "update:newSubtask": [value: string];
  "add-subtask": [];
  "remove-subtask": [index: number];
}>();
</script>
