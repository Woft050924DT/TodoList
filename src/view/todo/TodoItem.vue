<template>
  <div
    @click="store.selectTodo(todo)"
    class="bg-white rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md group"
    :class="[
      isSelected
        ? 'border-violet-300 shadow-md'
        : 'border-gray-100 hover:border-gray-200',
      isOverdue && !todo.completed ? 'border-l-4 border-l-red-400' : '',
      todo.completed ? 'opacity-70' : '',
      todo.priority === 'Cao' && !todo.completed && !isOverdue
        ? 'border-l-4 border-l-red-400'
        : todo.priority === 'Vừa' && !todo.completed && !isOverdue
          ? 'border-l-4 border-l-amber-400'
          : !isOverdue && !todo.completed
            ? 'border-l-4 border-l-green-400'
            : '',
    ]"
  >
    <div class="p-4">
      <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <button
          @click.stop="store.toggleTodo(todo.id)"
          class="mt-0.5 w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all"
          :class="
            todo.completed
              ? 'bg-violet-600 border-violet-600'
              : 'border-gray-300 hover:border-violet-400'
          "
        >
          <svg
            v-if="todo.completed"
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

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4
              class="text-sm font-semibold text-gray-800 leading-snug"
              :class="todo.completed ? 'line-through text-gray-400' : ''"
            >
              {{ todo.title }}
            </h4>
            <button
              @click.stop="store.toggleStar(todo.id)"
              class="shrink-0 transition-colors"
              :class="
                todo.starred
                  ? 'text-amber-400'
                  : 'text-gray-200 hover:text-amber-300'
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                />
              </svg>
            </button>
          </div>

          <p
            v-if="todo.description"
            class="text-xs text-gray-500 mt-0.5 line-clamp-1"
          >
            {{ todo.description }}
          </p>

          <!-- Tags row -->
          <div class="flex flex-wrap gap-1.5 mt-2 items-center">
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="todo.category ? (catColors[todo.category] || 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-600'"
            >
              {{ todo.category }}
            </span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="priorityColors[todo.priority]"
            >
              {{ todo.priority }}
            </span>
            <span
              v-if="todo.deadline"
              class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
              :class="
                isOverdue && !todo.completed
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-500'
              "
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {{ deadlineLabel }}
            </span>
            <span
              v-for="tag in todo.tags"
              :key="tag"
              class="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-medium"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Progress bar -->
          <div
            v-if="todo.subtasks.length"
            class="mt-2.5 flex items-center gap-2"
          >
            <div class="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                class="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
                :style="`width:${subProgress}%`"
              ></div>
            </div>
            <span class="text-[10px] text-gray-400 font-medium shrink-0">
              {{ doneSubs }}/{{ todo.subtasks.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Todo, Subtask } from "@/types";
import { useTodoStore } from "../../store/todoStore";

const props = defineProps<{ todo: Todo }>();
const store = useTodoStore();

const isSelected = computed(
  () => store.selectedTodo?.id === props.todo.id,
);
const isOverdue = computed(() => store.isOverdue(props.todo));
const deadlineLabel = computed(() =>
  store.deadlineLabel(props.todo.deadline, props.todo.completed),
);
const doneSubs = computed(
  () => props.todo.subtasks.filter((s: Subtask) => s.done).length,
);
const subProgress = computed(() =>
  props.todo.subtasks.length
    ? (doneSubs.value / props.todo.subtasks.length) * 100
    : 0,
);

const catColors: Record<string, string> = {
  "Công việc": "bg-blue-100 text-blue-700",
  "Cá nhân": "bg-purple-100 text-purple-700",
  "Học tập": "bg-orange-100 text-orange-700",
  "Mua sắm": "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  Cao: "bg-red-100 text-red-600",
  Vừa: "bg-amber-100 text-amber-600",
  Thấp: "bg-gray-100 text-gray-500",
};
</script>
