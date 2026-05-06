<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-modal-in"
    >
      <ModalHeader title="Thêm công việc mới" @close="$emit('close')" />

      <div class="p-5">
        <AddTodoFields
          v-model:title="form.title"
          v-model:description="form.description"
          v-model:new-subtask="form.newSubtask"
          :subtasks="form.subtasks"
          @add-subtask="addDraftSubtask"
          @remove-subtask="removeDraftSubtask"
        />

        <div class="flex items-center gap-2 flex-wrap mb-5">
          <PrioritySelector v-model="form.priority" />
          <CategorySelect v-model="form.categoryId" :categories="categories" />
          <DueDateInput v-model="form.dueDate" />
        </div>
      </div>

      <div
        class="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
      >
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Hủy
        </button>
        <button
          @click="submit"
          class="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-violet-200 disabled:opacity-50"
          :disabled="!form.title.trim() || isSubmitting"
        >
          {{ isSubmitting ? "Đang thêm..." : "Thêm công việc" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, toRefs } from "vue";
import { useTasks } from "../../store/todoStore";
import { useCategoryStore } from "../../store/categoryStore";
import type { CategoryName, Priority } from "@/types";
import AddTodoFields from "./components/AddTodoFields.vue";
import CategorySelect from "./components/CategorySelect.vue";
import DueDateInput from "./components/DueDateInput.vue";
import ModalHeader from "./components/ModalHeader.vue";
import PrioritySelector from "./components/PrioritySelector.vue";

const emit = defineEmits<{ close: [] }>();
const store = useTasks();
const categoryStore = useCategoryStore();
const { categories } = toRefs(categoryStore);
const { fetchCategories, initializeDefaultCategories } = categoryStore;

const form = reactive({
  title: "",
  description: "",
  newSubtask: "",
  subtasks: [] as string[],
  priority: "Vừa" as Priority,
  category: "" as CategoryName,
  categoryId: null as number | null,
  dueDate: "",
  isCompleted: false,
});

onMounted(async () => {
  await fetchCategories();
  if (categories.value.length === 0) {
    await initializeDefaultCategories();
  }
});

const isSubmitting = computed(() => store.loading);

async function submit() {
  if (!form.title.trim() || isSubmitting.value) return;

  try {
    const selectedCategory = form.categoryId
      ? categories.value.find(
          (category) => Number(category.id) === form.categoryId,
        )?.name || "Công việc"
      : "Công việc";

    const createdTodo = await store.addTodo({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      category: selectedCategory,
      categoryId: form.categoryId,
      deadline: form.dueDate || undefined,
      completed: form.isCompleted,
      subtasks: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    addDraftSubtask();

    for (const subtask of form.subtasks) {
      await store.addSubtask(createdTodo.id, subtask);
    }

    resetForm();
    emit("close");
  } catch (error) {
    console.error("Failed to add todo:", error);
  }
}

function resetForm() {
  form.title = "";
  form.description = "";
  form.newSubtask = "";
  form.subtasks = [];
  form.priority = "Vừa" as Priority;
  form.categoryId = null;
  form.dueDate = "";
  form.isCompleted = false;
}

function addDraftSubtask() {
  const title = form.newSubtask.trim();
  if (!title) return;

  form.subtasks.push(title);
  form.newSubtask = "";
}

function removeDraftSubtask(index: number) {
  form.subtasks.splice(index, 1);
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
