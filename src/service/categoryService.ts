import type { Category as CategoryType } from "../types";

const API_URL = "http://localhost:3000/categories";

export interface ApiCategory {
  CategoryId: number;
  Name: string;
  Color: string;
  CreatedAt: string;
}

export interface CategoryMutationResult {
  status: number;
  message: string;
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
    throw new Error(`Category API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function assertOkResponse(result: CategoryMutationResult) {
  if (result.status !== 0) {
    throw new Error(result.message || "Category API request failed");
  }
}

export function mapApiCategoryToCategory(category: ApiCategory): CategoryType {
  return {
    id: String(category.CategoryId),
    name: category.Name,
    color: category.Color,
    createdAt: category.CreatedAt,
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
  const categories = await parseJson<ApiCategory[]>(await fetch(API_URL));
  return categories.map(mapApiCategoryToCategory);
}

export async function getCategoryById(categoryId: string | number): Promise<CategoryType | null> {
  try {
    const category = await parseJson<ApiCategory>(await fetch(`${API_URL}/${categoryId}`));
    return mapApiCategoryToCategory(category);
  } catch (error) {
    console.error("Failed to get category by ID:", error);
    return null;
  }
}

export async function createCategory(category: CreateCategoryPayload): Promise<void> {
  const result = await parseJson<CategoryMutationResult>(
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    }),
  );
  assertOkResponse(result);
}

export async function updateCategory(categoryId: string | number, category: UpdateCategoryPayload): Promise<void> {
  const result = await parseJson<CategoryMutationResult>(
    await fetch(`${API_URL}/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    }),
  );
  assertOkResponse(result);
}

export async function deleteCategory(categoryId: string | number): Promise<void> {
  const result = await parseJson<CategoryMutationResult>(
    await fetch(`${API_URL}/${categoryId}`, { method: "DELETE" }),
  );
  assertOkResponse(result);
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
