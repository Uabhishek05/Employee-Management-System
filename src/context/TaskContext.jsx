import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  EMPLOYEES_STORAGE_KEY,
  TASKS_STORAGE_KEY,
  defaultEmployees,
  defaultTasks,
  getStoredArray,
  initializeAppData,
} from '../utlis/localStorage'

const TaskStateContext = createContext(null)
const TaskActionsContext = createContext(null)
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
  const [tasks, setTasks] = useState(() => {
    initializeAppData()
    return getStoredArray(TASKS_STORAGE_KEY, defaultTasks)
  })
  const [employees, setEmployees] = useState(() => getStoredArray(EMPLOYEES_STORAGE_KEY, defaultEmployees))
  const [notifications, setNotifications] = useState(() =>
    getStoredArray(NOTIFICATIONS_STORAGE_KEY, defaultNotifications)
  )

  const pushNotification = useCallback((message, type = 'info') => {
    setNotifications((prev) => {
      const next = [createNotification(message, type), ...prev].slice(0, 30)
      persist(NOTIFICATIONS_STORAGE_KEY, next)
      return next
    })
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
    persist(NOTIFICATIONS_STORAGE_KEY, [])
  }, [])

  const saveTasks = useCallback((updater) => {
    setTasks((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      persist(TASKS_STORAGE_KEY, next)
      return next
    })
  }, [])

  const saveEmployees = useCallback((updater) => {
    setEmployees((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater
      persist(EMPLOYEES_STORAGE_KEY, next)
      return next
    })
  }, [])

  const addTask = useCallback((taskData) => {
    const task = { id: Date.now(), status: 'new', ...taskData }
    saveTasks((prev) => [task, ...prev])
    saveEmployees((prev) =>
      prev.map((employee) =>
        employee.id === Number(taskData.assignedTo)
          ? { ...employee, assigned: employee.assigned + 1 }
          : employee
      )
    )
  }, [saveEmployees, saveTasks])

  const updateTaskStatus = useCallback((taskId, nextStatus) => {
    saveTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
    )
  }, [saveTasks])

  const assignTask = useCallback((taskId, employeeId) => {
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
  }, [saveEmployees, saveTasks])

  const deleteTask = useCallback((taskId) => {
    const id = Number(taskId)
    let target = null
    saveTasks((prev) => {
      target = prev.find((task) => task.id === id)
      if (!target) return prev
      return prev.filter((task) => task.id !== id)
    })
    if (!target) return
    saveEmployees((prev) =>
      prev.map((employee) =>
        employee.id === target.assignedTo
          ? { ...employee, assigned: Math.max(employee.assigned - 1, 0) }
          : employee
      )
    )
  }, [saveEmployees, saveTasks])

  const addEmployee = useCallback((employeeData) => {
    const employee = {
      id: Date.now(),
      assigned: 0,
      completed: 0,
      status: 'Active',
      ...employeeData,
    }
    saveEmployees((prev) => [employee, ...prev])
  }, [saveEmployees])

  const removeEmployee = useCallback((employeeId) => {
    const id = Number(employeeId)
    let fallback = null
    let hasEnoughEmployees = false
    saveEmployees((prev) => {
      if (prev.length <= 1) return prev
      hasEnoughEmployees = true
      fallback = prev.find((entry) => entry.id !== id)
      if (!fallback) return prev
      return prev.filter((employee) => employee.id !== id)
    })
    if (!hasEnoughEmployees || !fallback) return
    saveTasks((prev) =>
      prev.map((task) =>
        task.assignedTo === id ? { ...task, assignedTo: fallback.id } : task
      )
    )
  }, [saveEmployees, saveTasks])

  const toggleEmployeeStatus = useCallback((employeeId) => {
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
  }, [saveEmployees])

  const stateValue = useMemo(
    () => ({
      tasks,
      employees,
      notifications,
    }),
    [employees, notifications, tasks]
  )

  const actionsValue = useMemo(
    () => ({
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
    [
      addEmployee,
      addTask,
      assignTask,
      clearNotifications,
      deleteTask,
      pushNotification,
      removeEmployee,
      toggleEmployeeStatus,
      updateTaskStatus,
    ]
  )

  return (
    <TaskStateContext.Provider value={stateValue}>
      <TaskActionsContext.Provider value={actionsValue}>{children}</TaskActionsContext.Provider>
    </TaskStateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskState = () => {
  const context = useContext(TaskStateContext)
  if (!context) {
    throw new Error('useTaskState must be used inside TaskProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskActions = () => {
  const context = useContext(TaskActionsContext)
  if (!context) {
    throw new Error('useTaskActions must be used inside TaskProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTaskData = () => {
  const state = useTaskState()
  const actions = useTaskActions()
  return useMemo(() => ({ ...state, ...actions }), [actions, state])
}
