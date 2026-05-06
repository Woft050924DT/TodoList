import type { CategoryName, Priority, Todo } from "../types";
import { mapApiSubTaskToSubtask, type ApiSubTask } from "./subTaskService";

const API_URL = "http://localhost:3000/tasks";

export interface ApiTask {
  TaskId?: number;
  CategoryId?: number | null;
  Title?: string;
  Description?: string | null;
  Priority?: number;
  Status?: number;
  DueDate?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string;
  SubTasks?: ApiSubTask[];
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}

export interface TaskMutationResult {
  status: number;
  message: string;
}

export interface CreateTaskPayload {
  CategoryId?: number | null;
  Title: string;
  Description?: string | null;
  Priority?: number;
  Status?: number;
  DueDate?: string | null;
}

export interface UpdateTaskPayload {
  CategoryId?: number | null;
  Title?: string;
  Description?: string | null;
  Priority?: number;
  Status?: number;
  DueDate?: string | null;
}

const priorityByApi: Record<number, Priority> = {
  1: "Thấp",
  2: "Vừa",
  3: "Cao",
};

const apiByPriority: Record<Priority, number> = {
  Thấp: 1,
  Vừa: 2,
  Cao: 3,
  low: 1,
  medium: 2,
  high: 3,
};

const categoryByApi: Record<number, CategoryName> = {
  1: "Công việc",
  2: "Học tập",
  3: "Cá nhân",
  4: "Mua sắm",
};

const apiByCategory: Record<CategoryName, number> = {
  "Công việc": 1,
  "Học tập": 2,
  "Cá nhân": 3,
  "Mua sắm": 4,
};

function toDateInputValue(value: string | null): string | null {
  if (!value) return null;
  return value.split("T")[0] || null;
}

function assertOkResponse(result: TaskMutationResult) {
  if (result.status !== 0) {
    throw new Error(result.message || "Task API request failed");
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Task API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function isApiResponse<T>(result: ApiResponse<T> | T): result is ApiResponse<T> {
  return typeof result === "object" && result !== null && "status" in result;
}

function unwrapTaskResponse<T>(result: ApiResponse<T> | T): T {
  if (!isApiResponse(result)) return result;
  if (result.status !== 0) {
    throw new Error(result.message || "Task API request failed");
  }
  return result.data as T;
}

export function mapApiTaskToTodo(task: ApiTask): Todo {
  const taskId = task.TaskId ?? task.taskId;
  const categoryId = task.CategoryId ?? task.categoryId ?? null;
  const priority = task.Priority ?? task.priority ?? 2;
  const status = task.Status ?? task.status ?? 0;
  const subTasks = task.subTasks ?? task.SubTasks ?? task.subtasks ?? [];

  return {
    id: taskId !== undefined ? String(taskId) : "",
    title: task.Title ?? task.title ?? "",
    description: task.Description ?? task.description ?? "",
    priority: priorityByApi[priority] ?? "Vừa",
    category: categoryId
      ? categoryByApi[categoryId] ?? "Công việc"
      : "Công việc",
    categoryId,
    deadline: toDateInputValue(task.DueDate ?? task.dueDate ?? null) || undefined,
    tags: [],
    subtasks: subTasks.map(mapApiSubTaskToSubtask),
    completed: status === 2,
    starred: false,
    createdAt: toDateInputValue(task.CreatedAt ?? task.createdAt ?? null) ?? "",
    updatedAt: toDateInputValue(task.UpdatedAt ?? task.updatedAt ?? null) ?? "",
  };
}

export function mapTodoToUpdatePayload(todo: Todo): Required<UpdateTaskPayload> {
  return {
    CategoryId: todo.category ? apiByCategory[todo.category] : null,
    Title: todo.title,
    Description: todo.description || null,
    Priority: apiByPriority[todo.priority],
    Status: todo.completed ? 2 : 0,
    DueDate: todo.deadline || null,
  };
}

export function mapTodoToCreatePayload(
  todo: Omit<Todo, "id" | "createdAt" | "subtasks" | "starred" | "tags">,
): Required<CreateTaskPayload> {
  return {
    CategoryId:
      todo.categoryId !== undefined
        ? todo.categoryId
        : todo.category
          ? apiByCategory[todo.category]
          : null,
    Title: todo.title,
    Description: todo.description || null,
    Priority: apiByPriority[todo.priority],
    Status: todo.completed ? 2 : 0,
    DueDate: todo.deadline || null,
  };
}

export async function getTasks(): Promise<Todo[]> {
  const result = await parseJson<ApiResponse<ApiTask[]> | ApiTask[]>(
    await fetch(`${API_URL}?includeRelated=true`),
  );
  return unwrapTaskResponse(result).map(mapApiTaskToTodo);
}

export async function getTaskById(taskId: string | number): Promise<Todo | null> {
  try {
    const result = await parseJson<ApiResponse<ApiTask> | ApiTask>(
      await fetch(`${API_URL}/${taskId}?includeRelated=true`),
    );
    return mapApiTaskToTodo(unwrapTaskResponse(result));
  } catch (error) {
    console.error("Failed to get task by ID:", error);
    return null;
  }
}

export async function createTask(task: CreateTaskPayload): Promise<void> {
  const result = await parseJson<TaskMutationResult>(
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }),
  );
  assertOkResponse(result);
}

export async function updateTask(taskId: string | number, task: UpdateTaskPayload): Promise<void> {
  const result = await parseJson<TaskMutationResult>(
    await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }),
  );
  assertOkResponse(result);
}

export async function deleteTask(taskId: string | number): Promise<void> {
  const result = await parseJson<TaskMutationResult>(
    await fetch(`${API_URL}/${taskId}`, { method: "DELETE" }),
  );
  assertOkResponse(result);
}

export const taskMappers = {
  apiByPriority,
  apiByCategory,
};
