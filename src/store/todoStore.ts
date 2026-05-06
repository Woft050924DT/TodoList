// stores/todoStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Todo, Subtask } from "@/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  mapTodoToCreatePayload,
  mapTodoToUpdatePayload,
} from "@/service/taskService";
import {
  createSubTask,
  getSubTasksByTaskId,
  updateSubTask,
} from "@/service/subTaskService";
import { PRIORITY_ORDER } from "@/constants/priority";
import { toDateOnly } from "@/utils/dateUtils";
import { deadlineLabel, isOverdue } from "@/utils/todoHelpers";
import { hydrateTodos } from "@/api/todoApi";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "deadline" | "priority" | "createdAt";
type TabKey = "Tất cả" | "Hôm nay" | "Quá hạn";

// ─── Helpers (pure, module-scoped) ────────────────────────────────────────────

function isToday(date: Date | string): boolean {
  return toDateOnly(date).getTime() === toDateOnly(new Date()).getTime();
}

function isPastDeadline(todo: Todo): boolean {
  if (!todo.deadline || todo.completed) return false;
  return toDateOnly(todo.deadline).getTime() < toDateOnly(new Date()).getTime();
}

function matchesSearch(todo: Todo, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    todo.title.toLowerCase().includes(q) ||
    (todo.description?.toLowerCase().includes(q) ?? false)
  );
}

function matchesTab(todo: Todo, tab: TabKey): boolean {
  if (tab === "Hôm nay") return !!todo.deadline && isToday(todo.deadline);
  if (tab === "Quá hạn") return isPastDeadline(todo);
  return true;
}

function sortTodos(todos: Todo[], sortKey: SortKey): Todo[] {
  return [...todos].sort((a, b) => {
    switch (sortKey) {
      case "deadline":
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();

      case "priority":
        return (
          (PRIORITY_ORDER[a.priority] ?? 99) -
          (PRIORITY_ORDER[b.priority] ?? 99)
        );

      case "createdAt":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useTodoStore = defineStore("todo", () => {
  // ── State ──────────────────────────────────────────────────────────────────

  const todos = ref<Todo[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const sortBy = ref<SortKey>("createdAt");
  const activeTab = ref<TabKey>("Tất cả");
  const activeCategory = ref("Tất cả");
  const selectedTodo = ref<Todo | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────

  const filteredTodos = computed(() => {
    const q = searchQuery.value.trim();
    const tab = activeTab.value;
    const category = activeCategory.value;

    const filtered = todos.value.filter(
      (todo) =>
        matchesSearch(todo, q) &&
        matchesTab(todo, tab) &&
        (category === "Tất cả" || todo.category === category),
    );

    return sortTodos(filtered, sortBy.value);
  });

  const overdueCount = computed(
    () => todos.value.filter(isPastDeadline).length,
  );

  const todayStats = computed(() => {
    const total = todos.value.length;
    const done = todos.value.filter((t) => t.completed).length;
    const overdue = todos.value.filter(isPastDeadline).length;

    return {
      total,
      done,
      overdue,
      remaining: total - done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });

  const categoryCounts = computed(() =>
    todos.value.reduce<Record<string, number>>((acc, todo) => {
      if (todo.category) acc[todo.category] = (acc[todo.category] ?? 0) + 1;
      return acc;
    }, {}),
  );

  // ── Private helpers ────────────────────────────────────────────────────────

  function findTodoOrThrow(id: string): Todo {
    const todo = todos.value.find((t) => t.id === id);
    if (!todo) throw new Error(`Task ${id} không tìm thấy`);
    return todo;
  }

  function syncSelectedTodo(updated: Todo): void {
    if (selectedTodo.value?.id === updated.id) {
      selectedTodo.value = updated;
    }
  }

  function touchTodo(todo: Todo): void {
    todo.updatedAt = new Date().toISOString();
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async function fetchTodos(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      todos.value = await hydrateTodos(await getTasks());
    } catch (err) {
      error.value = "Không thể tải danh sách công việc";
      console.error("[fetchTodos]", err);
    } finally {
      loading.value = false;
    }
  }

  async function addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    await createTask(mapTodoToCreatePayload(todo));
    await fetchTodos();

    const createdTodo = todos.value[0];
    if (!createdTodo) {
      throw new Error("Khong the tai lai cong viec sau khi tao");
    }

    return createdTodo;
  }

  async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Task ${id} không tìm thấy`);

    const merged: Todo = {
      ...todos.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateTask(id, mapTodoToUpdatePayload(merged));
    todos.value[index] = merged;
    syncSelectedTodo(merged);
    return merged;
  }

  async function deleteTodo(id: string): Promise<void> {
    await deleteTask(id);
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) todos.value.splice(index, 1);
    if (selectedTodo.value?.id === id) selectedTodo.value = null;
  }

  async function toggleTodo(id: string): Promise<Todo> {
    const todo = findTodoOrThrow(id);
    return updateTodo(id, { completed: !todo.completed });
  }

  async function fetchSubtasksForTodo(todoId: string): Promise<Subtask[]> {
    const subtasks = await getSubTasksByTaskId(todoId);
    const todo = todos.value.find((t) => t.id === todoId);
    if (todo) {
      todo.subtasks = subtasks;
      if (selectedTodo.value?.id === todoId) {
        selectedTodo.value = { ...todo };
      }
    }
    return subtasks;
  }

  async function addSubtask(todoId: string, title: string): Promise<Subtask> {
    const todo = findTodoOrThrow(todoId);

    await createSubTask({
      taskId: Number(todoId),
      title,
      isCompleted: false,
      sortOrder: (todo.subtasks?.length ?? 0) + 1,
    });

    const subtasks = await fetchSubtasksForTodo(todoId);
    touchTodo(todo);

    const added = subtasks.at(-1);
    if (!added) throw new Error("Subtask vừa tạo không tìm thấy");
    return added;
  }

  async function toggleSubtask(
    todoId: string,
    subtaskId: string,
  ): Promise<Subtask> {
    const todo = findTodoOrThrow(todoId);
    const subtask = todo.subtasks?.find((s) => s.id === subtaskId);
    if (!subtask) throw new Error(`Subtask ${subtaskId} không tìm thấy`);

    const updated: Subtask = { ...subtask, done: !subtask.done };

    await updateSubTask(subtaskId, {
      title: updated.title,
      isCompleted: updated.done,
      sortOrder:
        updated.sortOrder ??
        (todo.subtasks?.findIndex((s) => s.id === subtaskId) ?? 0) + 1,
    });

    Object.assign(subtask, updated);
    touchTodo(todo);
    return subtask;
  }

  async function addTag(todoId: string, tag: string): Promise<void> {
    const todo = findTodoOrThrow(todoId);
    if (todo.tags.includes(tag)) return;
    todo.tags.push(tag);
    touchTodo(todo);
    // TODO: persist via updateTask when API ready
  }

  async function removeTag(todoId: string, tag: string): Promise<void> {
    const todo = findTodoOrThrow(todoId);
    const index = todo.tags.indexOf(tag);
    if (index === -1) return;
    todo.tags.splice(index, 1);
    touchTodo(todo);
    // TODO: persist via updateTask when API ready
  }

  async function toggleStar(todoId: string): Promise<Todo> {
    const todo = findTodoOrThrow(todoId);
    todo.starred = !todo.starred;
    touchTodo(todo);
    // TODO: await updateTask(todoId, mapTodoToUpdatePayload(todo))
    return todo;
  }

  async function selectTodo(todo: Todo | null): Promise<void> {
    selectedTodo.value = todo;
    if (todo) await fetchSubtasksForTodo(todo.id);
  }


  return {
    // State
    todos,
    loading,
    error,
    searchQuery,
    sortBy,
    activeTab,
    activeCategory,
    selectedTodo,
    // Computed
    filteredTodos,
    overdueCount,
    todayStats,
    categoryCounts,
    isOverdue,
    deadlineLabel,
    // Actions
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    fetchSubtasksForTodo,
    addSubtask,
    toggleSubtask,
    addTag,
    removeTag,
    toggleStar,
    selectTodo,
  };
});

// Alias giữ backward compat
export const useTasks = useTodoStore;
