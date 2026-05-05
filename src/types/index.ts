export interface Subtask {
  id: string
  title: string
  done: boolean
}

export type Priority = 'Cao' | 'Vừa' | 'Thấp' | 'low' | 'medium' | 'high'

export interface Category {
  id: string
  name: string
  color: string
  createdAt: string
}

export type CategoryName = 'Công việc' | 'Cá nhân' | 'Học tập' | 'Mua sắm' | string

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  deadline?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  category?: CategoryName
  categoryId?: number | null
  subtasks: Subtask[]
  tags: string[]
  starred?: boolean
}
