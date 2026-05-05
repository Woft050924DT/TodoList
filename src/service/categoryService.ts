import type { Category as CategoryType } from "../types";

const API_URL = "http://localhost:3000/categories";

export interface ApiCategory {
  categoryId: number;
  name: string;
  color: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}


export interface CreateCategoryPayload {
  name: string;
  color?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.message || `Category API error ${res.status}`;
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}


export function mapApiCategoryToCategory(category: ApiCategory): CategoryType {
  return {
    id: String(category.categoryId),
    name: category.name,
    color: category.color,
    createdAt: category.createdAt,
  };
}

export function mapCategoryToCreatePayload(category: Omit<CategoryType, "id" | "createdAt">): Required<CreateCategoryPayload> {
  return {
    name: category.name,
    color: category.color || "#6366f1",
  };
}

export function mapCategoryToUpdatePayload(category: Partial<CategoryType>): Required<UpdateCategoryPayload> {
  return {
    name: category.name || "",
    color: category.color || "#6366f1",
  };
}

export async function getCategories(): Promise<CategoryType[]> {
  const response = await parseJson<ApiResponse<ApiCategory[]>>(await fetch(API_URL));
  if (response.status !== 0) {
    throw new Error(response.message || "Failed to retrieve categories");
  }
  return response.data?.map(mapApiCategoryToCategory) || [];
}

export async function getCategoryById(categoryId: string | number): Promise<CategoryType | null> {
  try {
    const response = await parseJson<ApiResponse<ApiCategory>>(await fetch(`${API_URL}/${categoryId}`));
    if (response.status !== 0) {
      throw new Error(response.message || "Failed to retrieve category");
    }
    return response.data ? mapApiCategoryToCategory(response.data) : null;
  } catch (error) {
    console.error("Failed to get category by ID:", error);
    return null;
  }
}

export async function createCategory(category: CreateCategoryPayload): Promise<void> {
  console.log('Creating category with payload:', category);
  const result = await parseJson<ApiResponse<null>>(
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    }),
  );
  if (result.status !== 0) {
    throw new Error(result.message || "Failed to create category");
  }
}

export async function updateCategory(categoryId: string | number, category: UpdateCategoryPayload): Promise<void> {
  const result = await parseJson<ApiResponse<null>>(
    await fetch(`${API_URL}/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    }),
  );
  if (result.status !== 0) {
    throw new Error(result.message || "Failed to update category");
  }
}

export async function deleteCategory(categoryId: string | number): Promise<void> {
  const result = await parseJson<ApiResponse<null>>(
    await fetch(`${API_URL}/${categoryId}`, { method: "DELETE" }),
  );
  if (result.status !== 0) {
    throw new Error(result.message || "Failed to delete category");
  }
}

// Default colors for categories
export const DEFAULT_CATEGORY_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#ef4444", // Red
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
];

export const categoryMappers = {
  mapApiCategoryToCategory,
  mapCategoryToCreatePayload,
  mapCategoryToUpdatePayload,
};
