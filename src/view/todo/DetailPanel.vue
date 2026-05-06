<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="store.selectTodo(null)"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-in"
    >
      <ModalHeader
        title="Chi tiết công việc "
        title-tag="span"
        @close="store.selectTodo(null)"
      />

      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        <CompletionButton
          :completed="todo.completed"
          @toggle="store.toggleTodo(todo.id)"
        />

        <DetailTextSection
          label="Tiêu đề"
          :value="todo.title"
          :content-class="[
            'text-base text-gray-800 font-semibold',
            todo.completed ? 'line-through text-gray-400' : '',
          ]"
        />

        <DetailTextSection label="Mô tả" :value="todo.description" />

        <TodoMetaEditor
          :priority="todo.priority"
          :category-id="todo.categoryId"
          :categories="categories"
          @update:priority="updatePriority"
          @update:category-id="updateCategory"
        />

        <DeadlineEditor
          :deadline="todo.deadline"
          :deadline-label="deadlineLabel"
          :completed="todo.completed"
          :is-overdue="isOverdue"
          @update:deadline="updateDeadline"
        />

        <SubtaskSection
          v-model:new-subtask="newSubtask"
          :subtasks="todo.subtasks"
          :done="doneSubs"
          :progress="subProgress"
          @toggle-subtask="toggleSubtask"
          @add-subtask="submitSubtask"
        />

        <TagSection
          v-model:new-tag="newTag"
          :tags="todo.tags"
          @remove-tag="removeTag"
          @add-tag="submitTag"
        />

        <ImportantButton
          :starred="todo.starred"
          @toggle="store.toggleStar(todo.id)"
        />

        <div class="text-xs text-gray-400 text-center">
          Tạo lúc {{ todo.createdAt }}
        </div>
      </div>

      <div class="border-t border-gray-100 p-5 bg-gray-50 rounded-b-2xl">
        <DeleteTodoButton @delete="store.deleteTodo(todo.id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue";
import type { Priority, Todo } from "@/types";
import { useTodoStore } from "../../store/todoStore";
import { useCategoryStore } from "../../store/categoryStore";
import CompletionButton from "./components/CompletionButton.vue";
import DeadlineEditor from "./components/DeadlineEditor.vue";
import DeleteTodoButton from "./components/DeleteTodoButton.vue";
import DetailTextSection from "./components/DetailTextSection.vue";
import ImportantButton from "./components/ImportantButton.vue";
import ModalHeader from "./components/ModalHeader.vue";
import SubtaskSection from "./components/SubtaskSection.vue";
import TagSection from "./components/TagSection.vue";
import TodoMetaEditor from "./components/TodoMetaEditor.vue";

const props = defineProps<{ todo: Todo }>();
const store = useTodoStore();
const categoryStore = useCategoryStore();
const { categories } = toRefs(categoryStore);
const { fetchCategories, initializeDefaultCategories } = categoryStore;
const newSubtask = ref("");
const newTag = ref("");

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
  () => props.todo.subtasks.filter((subtask) => subtask.done).length,
);
const subProgress = computed(() =>
  props.todo.subtasks.length
    ? (doneSubs.value / props.todo.subtasks.length) * 100
    : 0,
);

async function submitSubtask() {
  if (!newSubtask.value.trim()) return;
  await store.addSubtask(props.todo.id, newSubtask.value.trim());
  newSubtask.value = "";
}

async function toggleSubtask(subtaskId: string) {
  await store.toggleSubtask(props.todo.id, subtaskId);
}

async function submitTag() {
  if (!newTag.value.trim()) return;
  const tag = newTag.value.trim().startsWith("#")
    ? newTag.value.trim()
    : "#" + newTag.value.trim();
  await store.addTag(props.todo.id, tag);
  newTag.value = "";
}

async function removeTag(tag: string) {
  await store.removeTag(props.todo.id, tag);
}

async function updatePriority(priority: Priority) {
  await store.updateTodo(props.todo.id, { priority });
}

async function updateCategory(categoryId: number) {
  const selectedCategory = categories.value.find(
    (category) => Number(category.id) === categoryId,
  );
  if (!selectedCategory) return;

  await store.updateTodo(props.todo.id, {
    category: selectedCategory.name,
    categoryId,
  });
}

async function updateDeadline(deadline: string | undefined) {
  await store.updateTodo(props.todo.id, { deadline });
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
