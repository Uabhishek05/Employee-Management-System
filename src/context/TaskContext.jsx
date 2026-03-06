import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  EMPLOYEES_STORAGE_KEY,
  TASKS_STORAGE_KEY,
  defaultEmployees,
  defaultTasks,
  getStoredArray,
  initializeAppData,
} from '../utlis/localStorage'

const TaskContext = createContext(null)
const NOTIFICATIONS_STORAGE_KEY = 'ems_notifications'
const defaultNotifications = [
  {
    id: 'welcome-1',
    message: 'Welcome to EMS notifications center.',
    type: 'info',
    time: 'Just now',
    createdAt: Date.now(),
  },
]

const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const createNotification = (message, type = 'info') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  message,
  type,
  time: formatTime(),
  createdAt: Date.now(),
})

const persist = (key, value) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const TaskProvider = ({ children }) => {
  initializeAppData()

  const [tasks, setTasks] = useState(() => getStoredArray(TASKS_STORAGE_KEY, defaultTasks))
  const [employees, setEmployees] = useState(() => getStoredArray(EMPLOYEES_STORAGE_KEY, defaultEmployees))
  const [notifications, setNotifications] = useState(() =>
    getStoredArray(NOTIFICATIONS_STORAGE_KEY, defaultNotifications)
  )

  const pushNotification = (message, type = 'info') => {
    setNotifications((prev) => {
      const next = [createNotification(message, type), ...prev].slice(0, 30)
      persist(NOTIFICATIONS_STORAGE_KEY, next)
      return next
    })
  }

  const clearNotifications = () => {
    setNotifications([])
    persist(NOTIFICATIONS_STORAGE_KEY, [])
  }

  const saveTasks = (updater) => {
    setTasks((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      persist(TASKS_STORAGE_KEY, next)
      return next
    })
  }

  const saveEmployees = (updater) => {
    setEmployees((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      persist(EMPLOYEES_STORAGE_KEY, next)
      return next
    })
  }

  const addTask = (taskData) => {
    const task = { id: Date.now(), status: 'new', ...taskData }
    saveTasks((prev) => [task, ...prev])
    saveEmployees((prev) =>
      prev.map((employee) =>
        employee.id === Number(taskData.assignedTo)
          ? { ...employee, assigned: employee.assigned + 1 }
          : employee
      )
    )
  }

  const updateTaskStatus = (taskId, nextStatus) => {
    saveTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
    )
  }

  const assignTask = (taskId, employeeId) => {
    const assignedTo = Number(employeeId)
    saveTasks((prev) =>
      prev.map((task) =>
        task.id === Number(taskId)
          ? { ...task, assignedTo, status: 'accepted' }
          : task
      )
    )
    saveEmployees((prev) =>
      prev.map((employee) =>
        employee.id === assignedTo
          ? { ...employee, assigned: employee.assigned + 1 }
          : employee
      )
    )
  }

  const deleteTask = (taskId) => {
    const id = Number(taskId)
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    saveTasks((prev) => prev.filter((task) => task.id !== id))
    saveEmployees((prev) =>
      prev.map((employee) =>
        employee.id === target.assignedTo
          ? { ...employee, assigned: Math.max(employee.assigned - 1, 0) }
          : employee
      )
    )
  }

  const addEmployee = (employeeData) => {
    const employee = {
      id: Date.now(),
      assigned: 0,
      completed: 0,
      status: 'Active',
      ...employeeData,
    }
    saveEmployees((prev) => [employee, ...prev])
  }

  const removeEmployee = (employeeId) => {
    const id = Number(employeeId)
    if (employees.length <= 1) return
    const fallback = employees.find((entry) => entry.id !== id)
    if (!fallback) return
    saveEmployees((prev) => prev.filter((employee) => employee.id !== id))
    saveTasks((prev) =>
      prev.map((task) =>
        task.assignedTo === id ? { ...task, assignedTo: fallback.id } : task
      )
    )
  }

  const toggleEmployeeStatus = (employeeId) => {
    const id = Number(employeeId)
    saveEmployees((prev) =>
      prev.map((employee) => {
        if (employee.id !== id) return employee
        return {
          ...employee,
          status: employee.status === 'On Leave' ? 'Active' : 'On Leave',
        }
      })
    )
  }

  const value = useMemo(
    () => ({
      tasks,
      employees,
      notifications,
      addTask,
      updateTaskStatus,
      assignTask,
      deleteTask,
      addEmployee,
      removeEmployee,
      toggleEmployeeStatus,
      pushNotification,
      clearNotifications,
    }),
    [tasks, employees, notifications]
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTaskData = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskData must be used inside TaskProvider')
  }
  return context
}
