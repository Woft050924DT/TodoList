<template>
  <!-- Modal Backdrop -->
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <!-- Modal Content -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-modal-in">
      <div class="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 class="font-semibold text-lg text-gray-800">Thêm công việc mới</h3>
        <button
          @click="$emit('close')"
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

      <div class="p-5">

    <input
          v-model="form.title"
          placeholder="Tiêu đề công việc..."
          class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 mb-3 transition"
        />
        <textarea
          v-model="form.description"
          placeholder="Mô tả (tùy chọn)..."
          rows="3"
          class="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 mb-4 transition resize-none"
        ></textarea>

        <div class="flex items-center gap-2 flex-wrap mb-5">
          <!-- Priority -->
          <div class="flex gap-1">
            <button
              v-for="p in priorities"
              :key="p.value"
              @click="form.priority = p.value"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              :class="
                form.priority === p.value
                  ? p.activeClass
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              "
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                />
              </svg>
              {{ p.label }}
            </button>
          </div>

          <!-- Category Dropdown -->
          <select
            v-model="form.categoryId"
            class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
          >
            <option value="null">Chọn danh mục</option>
            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ getCategoryIcon(cat.name) }} {{ cat.name }}
            </option>
          </select>

          <!-- Due Date -->
          <div class="flex items-center gap-2">
            <input
              type="date"
              v-model="form.dueDate"
              class="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
            />
            <button
              v-if="form.dueDate"
              @click="form.dueDate = ''"
              class="text-gray-400 hover:text-red-500 transition-colors"
              title="Xóa ngày"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Huỷ
        </button>
        <button
          @click="submit"
          class="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-violet-200 disabled:opacity-50"
          :disabled="!form.title.trim() || isSubmitting"
        >
          {{ isSubmitting ? 'Đang thêm...' : 'Thêm công việc' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, toRefs } from "vue";
import { useTasks } from "../../store/todoStore";
import { useCategoryStore } from "../../store/categoryStore";
import type { Priority, CategoryName } from "@/types";

const emit = defineEmits<{ close: [] }>();
const { addTodo, loading } = useTasks();
const categoryStore = useCategoryStore();
const { categories } = toRefs(categoryStore);
const { fetchCategories, initializeDefaultCategories } = categoryStore;

const form = reactive({
  title: "",
  description: "",
  priority: "Vừa" as Priority,
  category: "" as CategoryName,
  categoryId: null as number | null,
  dueDate: "",
  isCompleted: false,
});

const priorities: Array<{ value: Priority; label: string; activeClass: string }> = [
  { value: "Thấp", label: "Thấp", activeClass: "border-green-400 bg-green-50 text-green-700" },
  { value: "Vừa", label: "Vừa", activeClass: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "Cao", label: "Cao", activeClass: "border-red-400 bg-red-50 text-red-700" },
];

function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    "Công việc": "💼",
    "Cá nhân": "👤",
    "Học tập": "📚",
    "Mua sắm": "🛒",
  };
  return icons[categoryName] || "📁";
}

// Initialize categories
onMounted(async () => {
  await fetchCategories();
  console.log('Categories loaded:', categories.value);
  if (categories.value.length === 0) {
    console.log('No categories found, initializing defaults...');
    await initializeDefaultCategories();
    console.log('Categories after initialization:', categories.value);
  }
});

const isSubmitting = computed(() => loading);

async function submit() {
  if (!form.title.trim() || isSubmitting.value) return;
  
  try {
    // Convert categoryId to category name for Todo interface
    const selectedCategory = form.categoryId 
      ? categories.value.find((c: any) => Number(c.id) === form.categoryId)?.name || "Công việc"
      : "Công việc";
    
    const todoData = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: selectedCategory,
      categoryId: form.categoryId, // Add categoryId to preserve the ID
      deadline: form.dueDate || undefined,
      completed: form.isCompleted,
      subtasks: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Sending todo data:', todoData);
    console.log('Form categoryId:', form.categoryId);
    console.log('Selected category:', selectedCategory);
    
    await addTodo(todoData);
    
    // Reset form
    form.title = "";
    form.description = "";
    form.priority = "Vừa" as Priority;
    form.categoryId = null;
    form.dueDate = "";
    form.isCompleted = false;
    
    emit("close");
  } catch (error) {
    console.error("Failed to add todo:", error);
    // Error is handled by the composable, could show toast here
  }
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
