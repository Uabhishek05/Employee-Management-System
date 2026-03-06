export const TASK_STATUS = {
  ALL: 'all',
  NEW: 'new',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

export const STATUS_LABELS = {
  [TASK_STATUS.NEW]: 'New',
  [TASK_STATUS.ACCEPTED]: 'Accepted',
  [TASK_STATUS.COMPLETED]: 'Completed',
  [TASK_STATUS.FAILED]: 'Failed',
}

export const STATUS_CARD_CLASSES = {
  [TASK_STATUS.NEW]: 'bg-red-400',
  [TASK_STATUS.ACCEPTED]: 'bg-blue-400',
  [TASK_STATUS.COMPLETED]: 'bg-green-400',
  [TASK_STATUS.FAILED]: 'bg-yellow-400',
}

export const PRIORITY_BADGE_CLASSES = {
  High: 'bg-red-700 text-white',
  Medium: 'bg-amber-500 text-black',
  Low: 'bg-emerald-600 text-white',
}

export const getTaskCounts = (tasks) =>
  tasks.reduce(
    (acc, task) => {
      if (task.status === TASK_STATUS.NEW) acc.new += 1
      if (task.status === TASK_STATUS.ACCEPTED) acc.accepted += 1
      if (task.status === TASK_STATUS.COMPLETED) acc.completed += 1
      if (task.status === TASK_STATUS.FAILED) acc.failed += 1
      return acc
    },
    { new: 0, accepted: 0, completed: 0, failed: 0 }
  )

export const filterTasks = (tasks, { status = TASK_STATUS.ALL, searchTerm = '' } = {}) => {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const useStatus = status && status !== TASK_STATUS.ALL

  return tasks.filter((task) => {
    if (useStatus && task.status !== status) return false
    if (!normalizedSearch) return true
    const searchable = `${task.title} ${task.description} ${task.priority}`.toLowerCase()
    return searchable.includes(normalizedSearch)
  })
}

export const filterEmployees = (employees, searchTerm = '') => {
  const keyword = searchTerm.trim().toLowerCase()
  if (!keyword) return employees
  return employees.filter((employee) =>
    `${employee.name} ${employee.role} ${employee.email}`.toLowerCase().includes(keyword)
  )
}

export const buildTaskDistributionData = (tasks, counts) => {
  const total = tasks.length || 1
  return [
    { name: STATUS_LABELS[TASK_STATUS.NEW], value: counts.new, color: '#f87171', percentage: (counts.new / total) * 100 },
    { name: STATUS_LABELS[TASK_STATUS.ACCEPTED], value: counts.accepted, color: '#60a5fa', percentage: (counts.accepted / total) * 100 },
    { name: STATUS_LABELS[TASK_STATUS.COMPLETED], value: counts.completed, color: '#4ade80', percentage: (counts.completed / total) * 100 },
    { name: STATUS_LABELS[TASK_STATUS.FAILED], value: counts.failed, color: '#facc15', percentage: (counts.failed / total) * 100 },
  ]
}

export const formatUpcomingDeadlines = (tasks, limit = 4) =>
  [...tasks]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
    .map((task) => ({
      ...task,
      date: new Date(task.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }))
