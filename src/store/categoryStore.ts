import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category } from '@/types'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
  mapCategoryToCreatePayload,
  mapCategoryToUpdatePayload,
  DEFAULT_CATEGORY_COLORS,
  categoryMappers
} from '../service/categoryService'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const categoryOptions = computed(() => [
    { id: 'all', name: 'Tất cả', color: '#6b7280' },
    ...categories.value
  ])

  const categoryById = computed(() => {
    const map: Record<number, Category> = {}
    categories.value.forEach((cat: Category) => {
      map[cat.id] = cat
    })
    return map
  })

  // Actions
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      categories.value = await getCategories()
    } catch (err) {
      error.value = 'Không thể tải danh sách danh mục'
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const payload = mapCategoryToCreatePayload(category)
      await createCategory(payload)
      
      // Refetch all categories to get the new one with proper ID
      await fetchCategories()
      
      // Return the added category (will be the last one after refetch)
      return categories.value[categories.value.length - 1]
    } catch (err) {
      error.value = 'Không thể thêm danh mục'
      console.error('Error adding category:', err)
      throw err
    }
  }

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const payload = mapCategoryToUpdatePayload(updates)
      await updateCategoryApi(id, payload)

      // Update local state
      const index = categories.value.findIndex((cat: Category) => cat.id === id)
      if (index !== -1) {
        const currentCat = categories.value[index] as Category
        categories.value[index] = {
          ...currentCat,
          ...updates
        } as Category
        return categories.value[index]
      }
      return null
    } catch (err) {
      error.value = 'Không thể cập nhật danh mục'
      console.error('Error updating category:', err)
      throw err
    }
  }

  const deleteCategory = async (id: number) => {
    try {
      await deleteCategoryApi(id)

      // Remove from local state
      const index = categories.value.findIndex((cat: Category) => cat.id === id)
      if (index !== -1) {
        categories.value.splice(index, 1)
        return true
      }
      return false
    } catch (err) {
      error.value = 'Không thể xóa danh mục'
      console.error('Error deleting category:', err)
      throw err
    }
  }

  // Initialize with default categories if none exist
  const initializeDefaultCategories = async () => {
    if (categories.value.length === 0) {
      const defaultCategories: Array<{name: string, color: string}> = [
        { name: 'Công việc', color: DEFAULT_CATEGORY_COLORS[0] },
        { name: 'Học tập', color: DEFAULT_CATEGORY_COLORS[1] },
        { name: 'Cá nhân', color: DEFAULT_CATEGORY_COLORS[2] },
        { name: 'Mua sắm', color: DEFAULT_CATEGORY_COLORS[3] }
      ]

      try {
        for (const category of defaultCategories) {
          await addCategory(category)
        }
      } catch (err) {
        console.error('Failed to initialize default categories:', err)
      }
    }
  }

  return {
    // State
    categories,
    loading,
    error,
    
    // Computed
    categoryOptions,
    categoryById,
    
    // Actions
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    initializeDefaultCategories,
    
    // Mappers
    categoryMappers
  }
})
