/**
 * Todo API utilities
 * Functions to process and enrich todo data from API
 */
import type { Todo } from "@/types";
import { getSubTasksByTaskId } from "@/service/subTaskService";
import { useCategoryStore } from "@/store/categoryStore";


export const hydrateTodos = async (raw: Todo[]): Promise<Todo[]> => {
  const categoryStore = useCategoryStore();
  const categoryMap = Object.fromEntries(
    categoryStore.categories.map((c) => [c.id, c.name]),
  );

  const withCategory = raw.map((todo) => ({
    ...todo,
    category: todo.categoryId
      ? (categoryMap[todo.categoryId] ?? todo.category)
      : todo.category,
  }));

  const subtaskResults = await Promise.allSettled(
    withCategory.map((todo) => getSubTasksByTaskId(todo.id)),
  );

  return withCategory.map((todo, i) => ({
    ...todo,
    subtasks:
      subtaskResults[i].status === "fulfilled"
        ? subtaskResults[i].value
        : (console.warn(`Không thể tải subtask cho task ${todo.id}`),
          todo.subtasks ?? []),
  }));
};
