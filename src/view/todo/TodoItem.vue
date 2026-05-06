<template>
  <div
    @click="store.selectTodo(todo)"
    class="bg-white rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md group"
    :class="cardClasses"
  >
    <div class="p-4">
      <div class="flex items-start gap-3">
        <TodoCheckbox
          :completed="todo.completed"
          @toggle="store.toggleTodo(todo.id)"
        />

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4
              class="text-sm font-semibold text-gray-800 leading-snug"
              :class="todo.completed ? 'line-through text-gray-400' : ''"
            >
              {{ todo.title }}
            </h4>
            <TodoStarButton
              :starred="todo.starred"
              @toggle="store.toggleStar(todo.id)"
            />
          </div>

          <p
            v-if="todo.description"
            class="text-xs text-gray-500 mt-0.5 line-clamp-1"
          >
            {{ todo.description }}
          </p>

          <TodoBadges
            :category="todo.category"
            :priority="todo.priority"
            :deadline="todo.deadline"
            :deadline-label="deadlineLabel"
            :is-overdue="isOverdue"
            :completed="todo.completed"
            :tags="todo.tags"
          />

          <SubtaskProgress
            :done="doneSubs"
            :total="todo.subtasks.length"
            :progress="subProgress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Subtask, Todo } from "@/types";
import { useTodoStore } from "../../store/todoStore";
import SubtaskProgress from "./components/SubtaskProgress.vue";
import TodoBadges from "./components/TodoBadges.vue";
import TodoCheckbox from "./components/TodoCheckbox.vue";
import TodoStarButton from "./components/TodoStarButton.vue";

const props = defineProps<{ todo: Todo }>();
const store = useTodoStore();

const isSelected = computed(() => store.selectedTodo?.id === props.todo.id);
const isOverdue = computed(() => store.isOverdue(props.todo));
const deadlineLabel = computed(() =>
  store.deadlineLabel(props.todo.deadline, props.todo.completed),
);
const doneSubs = computed(
  () => props.todo.subtasks.filter((subtask: Subtask) => subtask.done).length,
);
const subProgress = computed(() =>
  props.todo.subtasks.length
    ? (doneSubs.value / props.todo.subtasks.length) * 100
    : 0,
);

const cardClasses = computed(() => [
  isSelected.value
    ? "border-violet-300 shadow-md"
    : "border-gray-100 hover:border-gray-200",
  isOverdue.value && !props.todo.completed ? "border-l-4 border-l-red-400" : "",
  props.todo.completed ? "opacity-70" : "",
  String(props.todo.priority) === "Cao" &&
  !props.todo.completed &&
  !isOverdue.value
    ? "border-l-4 border-l-red-400"
    : String(props.todo.priority) === "Vừa" &&
        !props.todo.completed &&
        !isOverdue.value
      ? "border-l-4 border-l-amber-400"
      : !isOverdue.value && !props.todo.completed
        ? "border-l-4 border-l-green-400"
        : "",
]);
</script>
