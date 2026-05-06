<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="store.selectTodo(null)">
    <!-- Modal Content -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-in">
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
      >
        <span class="text-base font-semibold text-gray-800">Chi tiết công việc</span>
        <button
          @click="store.selectTodo(null)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
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

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      <!-- Completed badge -->
      <button
        @click="store.toggleTodo(todo.id)"
        class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all w-fit"
        :class="
          todo.completed
            ? 'bg-violet-100 text-violet-700'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        "
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ todo.completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành" }}
      </button>

      <!-- Title -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
        >
          Tiêu đề
        </div>
        <p
          class="text-base text-gray-800 font-semibold"
          :class="todo.completed ? 'line-through text-gray-400' : ''"
        >
          {{ todo.title }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
        >
          Mô tả
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">
          {{ todo.description || "—" }}
        </p>
      </div>

      <!-- Priority & Category -->
      <div class="flex gap-4">
        <div class="flex-1">
          <div
            class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
          >
            Ưu tiên
          </div>
          <select
            :value="todo.priority"
            @change="updatePriority($event)"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
            :class="priorityColors[todo.priority]"
          >
            <option>Thấp</option>
            <option>Vừa</option>
            <option>Cao</option>
          </select>
        </div>
        <div class="flex-1">
          <div
            class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
          >
            Danh mục
          </div>
          <select
            :value="todo.categoryId"
            @change="updateCategory($event)"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
          >
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ getCategoryIcon(cat.name) }} {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Deadline -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
        >
          Hạn chót
        </div>
        <div
          class="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8b5cf6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <input
            type="date"
            :value="todo.deadline || ''"
            @change="updateDeadline($event)"
            class="text-sm text-gray-600 focus:outline-none flex-1 bg-transparent"
          />
        </div>
        <p
          v-if="deadlineLabel && !todo.completed"
          class="text-xs mt-2 font-semibold flex items-center gap-1"
          :class="isOverdue ? 'text-red-500' : 'text-amber-500'"
        >
          <span>{{ isOverdue ? "⚠" : "⏰" }}</span> {{ deadlineLabel }}
        </p>
      </div>

      <!-- Subtasks -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <div
            class="text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            Công việc con
          </div>
          <span class="text-xs font-bold text-violet-600"
            >{{ doneSubs }}/{{ todo.subtasks.length }}</span
          >
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            class="bg-violet-500 h-2 rounded-full transition-all duration-300"
            :style="`width:${subProgress}%`"
          ></div>
        </div>

        <div class="space-y-2">
          <div
            v-for="sub in todo.subtasks"
            :key="sub.id"
            class="flex items-center gap-3 group"
          >
            <button
              @click="store.toggleSubtask(todo.id, sub.id)"
              class="w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all"
              :class="
                sub.done
                  ? 'bg-violet-500 border-violet-500'
                  : 'border-gray-300 hover:border-violet-400'
              "
            >
              <svg
                v-if="sub.done"
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
            <span
              class="text-sm flex-1"
              :class="sub.done ? 'line-through text-gray-400' : 'text-gray-700'"
              >{{ sub.title }}</span
            >
          </div>
        </div>

        <!-- Add subtask -->
        <div class="flex items-center gap-2 mt-3">
          <input
            v-model="newSubtask"
            @keyup.enter="submitSubtask"
            placeholder="Thêm công việc con..."
            class="flex-1 text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-violet-400 text-gray-600 placeholder-gray-300 transition bg-transparent"
          />
          <button
            @click="submitSubtask"
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

      <!-- Tags -->
      <div>
        <div
          class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3"
        >
          Thẻ nhãn
        </div>
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in todo.tags"
            :key="tag"
            class="flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium"
          >
            {{ tag }}
            <button
              @click="store.removeTag(todo.id, tag)"
              class="hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="newTag"
            @keyup.enter="submitTag"
            placeholder="Thêm thẻ nhãn..."
            class="flex-1 text-sm border-b border-gray-200 py-2 focus:outline-none focus:border-violet-400 text-gray-600 placeholder-gray-300 transition bg-transparent"
          />
          <button
            @click="submitTag"
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

      <!-- Star -->
      <button
        @click="store.toggleStar(todo.id)"
        class="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
        :class="
          todo.starred
            ? 'bg-amber-50 text-amber-500 border border-amber-200'
            : 'bg-gray-50 text-gray-400 border border-gray-200 hover:border-amber-200 hover:text-amber-400'
        "
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
        {{ todo.starred ? "Đã đánh dấu quan trọng" : "Đánh dấu quan trọng" }}
      </button>

      <div class="text-xs text-gray-400 text-center">
        Tạo lúc {{ todo.createdAt }}
      </div>
    </div>

    <!-- Delete -->
    <div class="border-t border-gray-100 p-5 bg-gray-50 rounded-b-2xl">
      <button
        @click="store.deleteTodo(todo.id)"
        class="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
        Xoá công việc
      </button>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from "vue";
import type { Todo } from "@/types";
import { useTodoStore } from "../../store/todoStore";
import { useCategoryStore } from "../../store/categoryStore";

const props = defineProps<{ todo: Todo }>();
const store = useTodoStore();
const categoryStore = useCategoryStore();
const { categories } = toRefs(categoryStore);
const { fetchCategories, initializeDefaultCategories } = categoryStore;
const newSubtask = ref("");
const newTag = ref("");

// Initialize categories
onMounted(async () => {
  await fetchCategories();
  if (categories.value.length === 0) {
    await initializeDefaultCategories();
  }
  await store.fetchSubtasksForTodo(props.todo.id);
});

const isOverdue = computed(() => store.isOverdue(props.todo));
const deadlineLabel = computed(() =>
  store.deadlineLabel(props.todo.deadline, props.todo.completed),
);
const doneSubs = computed(
  () => props.todo.subtasks.filter((s) => s.done).length,
);
const subProgress = computed(() =>
  props.todo.subtasks.length
    ? (doneSubs.value / props.todo.subtasks.length) * 100
    : 0,
);

const priorityColors: Record<string, string> = {
  Cao: "bg-red-50 text-red-600 border-red-200",
  Vừa: "bg-amber-50 text-amber-600 border-amber-200",
  Thấp: "bg-gray-50 text-gray-500",
};

function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    "Công việc": "💼",
    "Cá nhân": "👤",
    "Học tập": "📚",
    "Mua sắm": "🛒",
  };
  return icons[categoryName] || "📁";
}

function submitSubtask() {
  if (!newSubtask.value.trim()) return;
  store.addSubtask(props.todo.id, newSubtask.value.trim());
  newSubtask.value = "";
}

function submitTag() {
  if (!newTag.value.trim()) return;
  const tag = newTag.value.trim().startsWith("#")
    ? newTag.value.trim()
    : "#" + newTag.value.trim();
  store.addTag(props.todo.id, tag);
  newTag.value = "";
}

function updatePriority(e: Event) {
  const t = store.todos.find((t) => t.id === props.todo.id);
  if (t) t.priority = (e.target as HTMLSelectElement).value as any;
}

function updateCategory(e: Event) {
  const t = store.todos.find((t) => t.id === props.todo.id);
  if (t) {
    const categoryId = Number((e.target as HTMLSelectElement).value);
    const selectedCategory = categories.value.find((c: any) => Number(c.id) === categoryId);
    if (selectedCategory) {
      t.category = selectedCategory.name;
      t.categoryId = categoryId;
    }
  }
}

function updateDeadline(e: Event) {
  const t = store.todos.find((t) => t.id === props.todo.id);
  if (t) t.deadline = (e.target as HTMLInputElement).value || undefined;
}
</script>

<style>
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modalIn 0.2s ease-out;
}
</style>
