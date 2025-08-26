import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Task, TaskManagerState, TaskType } from '@/types/taskManager'

const TaskManagerContext = createContext<TaskManagerState | undefined>(undefined)

export const useTaskManager = () => {
  const context = useContext(TaskManagerContext)
  if (!context) {
    throw new Error('useTaskManager must be used within a TaskManagerProvider')
  }
  return context
}

interface TaskManagerProviderProps {
  children: ReactNode
}

export const TaskManagerProvider: React.FC<TaskManagerProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task])
  }, [])

  // Auto-cleanup completed tasks after 1 hour
  const cleanupCompletedTasks = useCallback(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    setTasks(prev => prev.filter(task => {
      if (task.status === 'completed' && task.completedAt && new Date(task.completedAt) < oneHourAgo) {
        return false
      }
      return true
    }))
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updates } as Task
          : task
      )
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const getTask = useCallback((id: string) => {
    return tasks.find(task => task.id === id)
  }, [tasks])

  const getTasksByType = useCallback((type: TaskType) => {
    return tasks.filter(task => task.type === type)
  }, [tasks])

  const getActiveTasks = useCallback(() => {
    return tasks.filter(task => 
      task.status === 'processing' || task.status === 'pending'
    )
  }, [tasks])

  const activeTasks = getActiveTasks()

  // Set up periodic cleanup
  useEffect(() => {
    const interval = setInterval(cleanupCompletedTasks, 10 * 60 * 1000) // Every 10 minutes
    return () => clearInterval(interval)
  }, [cleanupCompletedTasks])

  const value: TaskManagerState = {
    tasks,
    activeTasks,
    addTask,
    updateTask,
    removeTask,
    getTask,
    getTasksByType,
    getActiveTasks
  }

  return (
    <TaskManagerContext.Provider value={value}>
      {children}
    </TaskManagerContext.Provider>
  )
}