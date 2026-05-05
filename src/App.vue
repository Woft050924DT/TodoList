<template>
  <div
    class="flex h-screen bg-gray-50 overflow-hidden"
    style="font-family: &quot;Be Vietnam Pro&quot;, sans-serif"
  >
    <Sidebar />
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header
        class="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shrink-0"
      >
        <div class="flex-1">
          <h1 class="text-xl font-bold text-gray-800">
            {{ store.activeCategory }}
          </h1>
          <p class="text-xs text-gray-400">
            {{ store.filteredTodos.length }} công việc
          </p>
        </div>
        <div class="relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="store.searchQuery"
            placeholder="Tìm kiếm..."
            class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 w-52 transition"
          />
        </div>
        <select
          v-model="store.sortBy"
          class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none bg-white"
        >
          <option>Ngày tạo</option>
          <option>Ưu tiên</option>
          <option>Hạn chót</option>
        </select>
        <button
          @click="showForm = true"
          class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-violet-200"
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Thêm mới
        </button>
      </header>
      <!-- Tabs -->
      <div class="bg-white border-b border-gray-100 px-6 flex gap-0 shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="store.activeTab = tab as any"
          class="px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px relative"
          :class="
            store.activeTab === tab
              ? 'border-violet-600 text-violet-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
        >
          {{ tab }}
          <span
            v-if="tab === 'Quá hạn' && store.overdueCount"
            class="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full"
            >{{ store.overdueCount }}</span
          >
        </button>
      </div>
      <!-- List -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <!-- Loading State -->
        <div
          v-if="store.loading"
          class="flex flex-col items-center justify-center h-64 text-gray-300"
        >
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <p class="text-sm mt-3">Đang tải công việc...</p>
        </div>

        <!-- Error State -->
        <div
          v-else-if="store.error"
          class="flex flex-col items-center justify-center h-64 text-red-300"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p class="text-sm mt-3">Đã xảy ra lỗi</p>
          <p class="text-xs mt-1 text-red-400">{{ store.error }}</p>
          <button
            @click="store.fetchTodos()"
            class="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Thử lại
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="store.filteredTodos.length === 0 && !showForm"
          class="flex flex-col items-center justify-center h-64 text-gray-300"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="15" x2="12" y2="15" />
          </svg>
          <p class="text-sm mt-3">Chưa có công việc nào</p>
          <button
            @click="showForm = true"
            class="mt-3 text-xs text-violet-500 hover:text-violet-700 font-medium"
          >
            + Thêm công việc
          </button>
        </div>

        <!-- Todo List -->
        <template v-else>
          <AddTodoForm v-if="showForm" @close="showForm = false" class="mb-2" />
          <div class="flex flex-col gap-2">
            <TodoItem
              v-for="todo in store.filteredTodos"
              :key="todo.id"
              :todo="todo"
            />
          </div>
        </template>
      </div>
      <!-- Footer -->
      <div
        class="bg-white border-t border-gray-100 px-6 py-2.5 flex items-center gap-2 shrink-0"
      >
        <span class="text-xs text-gray-400"
          >{{ store.todayStats.total }} công việc tổng cộng</span
        >
        <span class="text-gray-200">·</span>
        <span class="text-xs text-violet-500 font-medium"
          >{{ store.todayStats.done }} hoàn thành</span
        >
        <span class="text-gray-200">·</span>
        <span class="text-xs text-red-400 font-medium"
          >{{ store.todayStats.overdue }} quá hạn</span
        >
        <div
          class="ml-auto w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center cursor-pointer hover:bg-violet-700 transition-colors"
        >
          <span class="text-white text-xs font-bold">?</span>
        </div>
      </div>
    </main>
    <Transition name="slide">
      <DetailPanel
        v-if="store.selectedTodo"
        :todo="store.selectedTodo"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Sidebar from "./view/layout/Sidebar.vue";
import TodoItem from "./view/todo/TodoItem.vue";
import AddTodoForm from "./view/todo/Addtodoform.vue";
import DetailPanel from "./view/todo/DetailPanel.vue";
import { useTodoStore } from "./store/todoStore";
import { useCategoryStore } from "./store/categoryStore";

const showForm = ref(false);
const tabs = ["Tất cả", "Đang làm", "Đã xong", "Quá hạn"];
const store = useTodoStore();
const categoryStore = useCategoryStore();

// Initialize data on mount
onMounted(async () => {
  try {
    // Initialize categories first
    await categoryStore.fetchCategories();
    if (categoryStore.categories.length === 0) {
      await categoryStore.initializeDefaultCategories();
    }
    
    // Then fetch todos
    await store.fetchTodos();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});
</script>
