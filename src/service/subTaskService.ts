import type { Subtask } from "../types";

const API_URL = "http://localhost:3000/subtasks";

export interface ApiSubTask {
  subTaskId?: number;
  SubTaskId?: number;
  taskId?: number;
  TaskId?: number;
  title?: string;
  Title?: string;
  isCompleted?: boolean;
  IsCompleted?: boolean;
  sortOrder?: number;
  SortOrder?: number;
}

export interface ApiResponse<T> {
  status: number;
  message?: string;
  data?: T;
}

type SubTaskListResponse = ApiResponse<ApiSubTask[]> | ApiSubTask[];

export interface CreateSubTaskPayload {
  taskId: number;
  title: string;
  isCompleted?: boolean;
  sortOrder?: number;
}

export interface UpdateSubTaskPayload {
  title: string;
  isCompleted: boolean;
  sortOrder: number;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `SubTask API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function isApiResponse<T>(result: ApiResponse<T> | T): result is ApiResponse<T> {
  return typeof result === "object" && result !== null && "status" in result;
}

function assertOkResponse<T>(result: ApiResponse<T>): T | undefined {
  if (result.status !== 0) {
    throw new Error(result.message || "SubTask API request failed");
  }
  return result.data;
}

export function mapApiSubTaskToSubtask(subTask: ApiSubTask): Subtask {
  const id = subTask.subTaskId ?? subTask.SubTaskId;
  const title = subTask.title ?? subTask.Title;

  return {
    id: id !== undefined ? String(id) : "",
    taskId: subTask.taskId ?? subTask.TaskId,
    title: title ?? "",
    done: subTask.isCompleted ?? subTask.IsCompleted ?? false,
    sortOrder: subTask.sortOrder ?? subTask.SortOrder ?? 0,
  };
}

export async function getSubTasksByTaskId(taskId: string | number): Promise<Subtask[]> {
  const result = await parseJson<SubTaskListResponse>(
    await fetch(`${API_URL}/task/${taskId}`),
  );
  const subTasks = isApiResponse(result) ? assertOkResponse(result) || [] : result;
  return subTasks.map(mapApiSubTaskToSubtask);
}

export async function createSubTask(subTask: CreateSubTaskPayload): Promise<void> {
  const result = await parseJson<ApiResponse<{ subTaskId: number }>>(
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subTask),
    }),
  );
  assertOkResponse(result);
}

export async function updateSubTask(subTaskId: string | number, subTask: UpdateSubTaskPayload): Promise<void> {
  const result = await parseJson<ApiResponse<null>>(
    await fetch(`${API_URL}/${subTaskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subTask),
    }),
  );
  assertOkResponse(result);
}

export async function deleteSubTask(subTaskId: string | number): Promise<void> {
  const result = await parseJson<ApiResponse<null>>(
    await fetch(`${API_URL}/${subTaskId}`, { method: "DELETE" }),
  );
  assertOkResponse(result);
}
