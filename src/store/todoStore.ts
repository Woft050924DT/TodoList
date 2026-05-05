import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, Subtask } from '@/types'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  mapTodoToCreatePayload,
  mapTodoToUpdatePayload
} from '../service/taskService'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const sortBy = ref<'deadline' | 'priority' | 'createdAt'>('createdAt')
  const activeTab = ref<'Tất cả' | 'Hôm nay' | 'Quá hạn'>('Tất cả')
  const activeCategory = ref('Tất cả')
  const selectedTodo = ref<Todo | null>(null)

  // Computed properties
  const filteredTodos = computed(() => {
    let filtered = todos.value

    // Filter by search query
    if (searchQuery.value) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    // Filter by category
    if (activeCategory.value !== 'Tất cả') {
      filtered = filtered.filter(todo => todo.category === activeCategory.value)
    }

    // Filter by tab
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (activeTab.value === 'Hôm nay') {
      filtered = filtered.filter(todo => {
        if (!todo.deadline) return false
        const deadline = new Date(todo.deadline)
        deadline.setHours(0, 0, 0, 0)
        return deadline.getTime() === today.getTime()
      })
    } else if (activeTab.value === 'Quá hạn') {
      filtered = filtered.filter(todo => {
        if (!todo.deadline || todo.completed) return false
        const deadline = new Date(todo.deadline)
        deadline.setHours(0, 0, 0, 0)
        return deadline.getTime() < today.getTime()
      })
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy.value === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      } else if (sortBy.value === 'priority') {
        const priorityOrder = { 'Cao': 0, 'Vừa': 1, 'Thấp': 2, 'high': 0, 'medium': 1, 'low': 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  })

  const overdueCount = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return todos.value.filter(todo => {
      if (!todo.deadline || todo.completed) return false
      const deadline = new Date(todo.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline.getTime() < today.getTime()
    }).length
  })

  const todayStats = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayTodos = todos.value.filter(todo => {
      if (!todo.deadline) return false
      const deadline = new Date(todo.deadline)
      deadline.setHours(0, 0, 0, 0)
      return deadline.getTime() === today.getTime()
    })

    return {
      total: todayTodos.length,
      done: todayTodos.filter(todo => todo.completed).length,
      overdue: todayTodos.filter(todo => {
        if (todo.completed) return false
        const deadline = new Date(todo.deadline!)
        return deadline.getTime() < today.getTime()
      }).length,
      get remaining() {
        return this.total - this.done
      },
      get pct() {
        return this.total > 0 ? Math.round((this.done / this.total) * 100) : 0
      }
    }
  })

  const categoryCounts = computed(() => {
    const counts: Record<string, number> = {}
    todos.value.forEach(todo => {
      if (todo.category) {
        counts[todo.category] = (counts[todo.category] || 0) + 1
      }
    })
    return counts
  })

  // Actions
  const fetchTodos = async () => {
    loading.value = true
    error.value = null
    
    try {
      todos.value = await getTasks()
    } catch (err) {
      error.value = 'Không thể tải danh sách công việc'
      console.error('Error fetching todos:', err)
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
      const payload = mapTodoToCreatePayload(todo)
      await createTask(payload)
      
      // Refetch all tasks to get the new one with proper ID
      await fetchTodos()
      
      // Return the added task (will be the first one after refetch)
      return todos.value[0]
    } catch (err) {
      error.value = 'Không thể thêm công việc'
      console.error('Error adding todo:', err)
      throw err
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      // Get the current task
      const currentTask = todos.value.find(todo => todo.id === id)
      if (!currentTask) {
        throw new Error('Task not found')
      }
      
      // Merge current task with updates
      const updatedTask = { ...currentTask, ...updates }
      const payload = mapTodoToUpdatePayload(updatedTask)
      
      await updateTask(id, payload)
      
      // Update local state
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value[index] = {
          ...todos.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return todos.value[index]
      }
      return null
    } catch (err) {
      error.value = 'Không thể cập nhật công việc'
      console.error('Error updating todo:', err)
      throw err
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await deleteTask(id)
      
      // Remove from local state
      const index = todos.value.findIndex(todo => todo.id === id)
      if (index !== -1) {
        todos.value.splice(index, 1)
        return true
      }
      return false
    } catch (err) {
      error.value = 'Không thể xóa công việc'
      console.error('Error deleting todo:', err)
      throw err
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.value.find(t => t.id === id)
      if (!todo) {
        throw new Error('Task not found')
      }
      
      const updatedTodo = { ...todo, completed: !todo.completed }
      const payload = mapTodoToUpdatePayload(updatedTodo)
      
      await updateTask(id, payload)
      
      // Update local state
      todo.completed = !todo.completed
      todo.updatedAt = new Date().toISOString()
      return todo
    } catch (err) {
      error.value = 'Không thể cập nhật trạng thái công việc'
      console.error('Error toggling todo:', err)
      throw err
    }
  }

  const addSubtask = async (todoId: string, title: string) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title,
        done: false
      }
      todo.subtasks.push(newSubtask)
      todo.updatedAt = new Date().toISOString()
      saveTodos()
      return newSubtask
    }
    return null
  }

  const toggleSubtask = async (todoId: string, subtaskId: string) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      const subtask = todo.subtasks.find(s => s.id === subtaskId)
      if (subtask) {
        subtask.done = !subtask.done
        todo.updatedAt = new Date().toISOString()
        saveTodos()
        return subtask
      }
    }
    return null
  }

  const addTag = async (todoId: string, tag: string) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo && !todo.tags.includes(tag)) {
      todo.tags.push(tag)
      todo.updatedAt = new Date().toISOString()
      saveTodos()
      return true
    }
    return false
  }

  const removeTag = async (todoId: string, tag: string) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      const index = todo.tags.indexOf(tag)
      if (index !== -1) {
        todo.tags.splice(index, 1)
        todo.updatedAt = new Date().toISOString()
        saveTodos()
        return true
      }
    }
    return false
  }

  const toggleStar = async (todoId: string) => {
    const todo = todos.value.find(t => t.id === todoId)
    if (todo) {
      todo.starred = !todo.starred
      todo.updatedAt = new Date().toISOString()
      saveTodos()
      return todo
    }
    return null
  }

  const isOverdue = (todo: Todo) => {
    if (!todo.deadline || todo.completed) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadline = new Date(todo.deadline)
    deadline.setHours(0, 0, 0, 0)
    return deadline.getTime() < today.getTime()
  }

  const deadlineLabel = (deadline?: string, completed?: boolean) => {
    if (!deadline) return ''
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const deadlineDate = new Date(deadline)
    deadlineDate.setHours(0, 0, 0, 0)
    
    if (completed) return 'Đã hoàn thành'
    
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Quá hạn'
    if (diffDays === 0) return 'Hôm nay'
    if (diffDays === 1) return 'Ngày mai'
    if (diffDays <= 7) return `${diffDays} ngày nữa`
    return new Date(deadline).toLocaleDateString('vi-VN')
  }

  const saveTodos = () => {
    // No longer needed - data is managed by API
    console.log('Data is now managed by API, localStorage not used')
  }

  const selectTodo = (todo: Todo | null) => {
    selectedTodo.value = todo
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
    
    // Actions
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    addSubtask,
    toggleSubtask,
    addTag,
    removeTag,
    toggleStar,
    isOverdue,
    deadlineLabel,
    selectTodo
  }
})

// Export useTasks as alias for useTodoStore
export const useTasks = useTodoStore
