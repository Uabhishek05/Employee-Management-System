import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react'
import Header from '../other/Header'
import Sidebar from '../other/Sidebar'
import QuickActions from '../other/QuickActions'
import RecentActivity from '../other/RecentActivity'
import UpcomingDeadlines from '../other/UpcomingDeadlines'
import { useAuth } from '../../context/AuthContext'
import { useTaskActions, useTaskState } from '../../context/TaskContext'
import {
  buildTaskDistributionData,
  filterEmployees,
  filterTasks,
  formatUpcomingDeadlines,
  getTaskCounts,
} from '../../utils/taskUtils'

const TaskList = lazy(() => import('../TaskList/TaskList'))
const AnalyticsSection = lazy(() => import('../other/AnalyticsSection'))

const adminActions = [
  { key: 'createTask', label: 'Create Task', accent: 'from-indigo-500 to-blue-500' },
  { key: 'assignTask', label: 'Assign Task', accent: 'from-cyan-500 to-sky-500' },
  { key: 'addEmployee', label: 'Add Employee', accent: 'from-violet-500 to-fuchsia-500' },
  { key: 'report', label: 'Generate Report', accent: 'from-emerald-500 to-green-500' },
  { key: 'team', label: 'View Team', accent: 'from-orange-500 to-amber-500' },
]

const adminNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'employees', label: 'Employees', icon: '◉' },
  { key: 'tasks', label: 'Tasks', icon: '✓' },
  { key: 'analytics', label: 'Analytics', icon: '◌' },
  { key: 'reports', label: 'Reports', icon: '▣' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

const roles = ['Frontend Developer', 'Backend Developer', 'QA Engineer', 'UI/UX Designer', 'DevOps Engineer']

const productivityData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 5 },
  { day: 'Wed', value: 2 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 6 },
  { day: 'Sat', value: 3 },
  { day: 'Sun', value: 2 },
]

const performanceData = [
  { name: 'Aarav', score: 88 },
  { name: 'Sana', score: 94 },
  { name: 'Vikram', score: 72 },
  { name: 'Neha', score: 81 },
]

const recentActivity = [
  { id: 1, title: 'Task assigned', detail: 'Fix payment bug assigned to an employee.', time: '12 min ago' },
  { id: 2, title: 'Task completed', detail: 'QA smoke test marked as complete.', time: '35 min ago' },
  { id: 3, title: 'New employee added', detail: 'A new employee joined the team.', time: '1 hr ago' },
  { id: 4, title: 'Deadline approaching', detail: 'Prepare report due in less than 1 day.', time: '2 hrs ago' },
]

const lazyFallback = <div className='mt-8 rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-white/80'>Loading section...</div>

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, employees, notifications } = useTaskState()
  const {
    addTask,
    assignTask,
    deleteTask,
    addEmployee,
    removeEmployee,
    toggleEmployeeStatus,
    pushNotification,
    clearNotifications,
  } = useTaskActions()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [activePanel, setActivePanel] = useState('')
  const [taskActionType, setTaskActionType] = useState('create')
  const [employeeActionType, setEmployeeActionType] = useState('add')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showMyProfileModal, setShowMyProfileModal] = useState(false)
  const [reportMessage, setReportMessage] = useState('')

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    date: '',
    employeeId: '',
  })

  const [assignForm, setAssignForm] = useState({
    taskId: '',
    employeeId: '',
  })

  const [deleteTaskId, setDeleteTaskId] = useState('')

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    role: roles[0],
  })

  const [removeEmployeeId, setRemoveEmployeeId] = useState('')

  const filteredTasks = useMemo(
    () => filterTasks(tasks, { searchTerm }),
    [searchTerm, tasks]
  )

  const filteredEmployees = useMemo(
    () => filterEmployees(employees, searchTerm),
    [employees, searchTerm]
  )

  const taskCounts = useMemo(() => getTaskCounts(tasks), [tasks])

  const overviewCards = useMemo(
    () => [
      { label: 'Total Employees', value: employees.length, color: 'bg-violet-400' },
      { label: 'Active Tasks', value: taskCounts.new + taskCounts.accepted, color: 'bg-blue-400' },
      { label: 'Completed Tasks', value: taskCounts.completed, color: 'bg-green-400' },
      { label: 'Pending Tasks', value: taskCounts.new, color: 'bg-amber-400' },
      { label: 'Overdue Tasks', value: taskCounts.failed, color: 'bg-red-400' },
    ],
    [employees.length, taskCounts]
  )

  const distributionData = useMemo(
    () => buildTaskDistributionData(tasks, taskCounts),
    [taskCounts, tasks]
  )

  const upcomingDeadlines = useMemo(() => formatUpcomingDeadlines(tasks), [tasks])

  const handleToggleEmployeeStatus = useCallback(
    (employeeId) => {
      toggleEmployeeStatus(employeeId)
      const target = employees.find((employee) => employee.id === Number(employeeId))
      if (target) {
        const next = target.status === 'On Leave' ? 'Active' : 'On Leave'
        pushNotification(`Admin changed ${target.name} status to ${next}.`, 'warning')
      }
    },
    [employees, pushNotification, toggleEmployeeStatus]
  )

  const handleAssignTaskFromEmployee = useCallback(
    (employeeId) => {
      const firstTaskId = tasks[0]?.id ? String(tasks[0].id) : ''
      setAssignForm((prev) => ({
        taskId: prev.taskId || firstTaskId,
        employeeId: String(employeeId),
      }))
      setActivePanel('assignTask')
    },
    [tasks]
  )

  const handleOpenProfile = useCallback((employee) => {
    setSelectedProfile(employee)
  }, [])

  const closeProfile = useCallback(() => setSelectedProfile(null), [])
  const openMyProfile = useCallback(() => setShowMyProfileModal(true), [])
  const closeMyProfile = useCallback(() => setShowMyProfileModal(false), [])

  const handleCreateTask = useCallback(
    (event) => {
      event.preventDefault()
      if (!newTaskForm.title || !newTaskForm.description || !newTaskForm.date || !newTaskForm.employeeId) return

      addTask({
        title: newTaskForm.title,
        description: newTaskForm.description,
        priority: newTaskForm.priority,
        date: newTaskForm.date,
        assignedTo: Number(newTaskForm.employeeId),
      })

      const target = employees.find((employee) => employee.id === Number(newTaskForm.employeeId))
      if (target) {
        pushNotification(`Admin created task "${newTaskForm.title}" for ${target.name}.`, 'success')
      }

      setNewTaskForm({ title: '', description: '', priority: 'Medium', date: '', employeeId: newTaskForm.employeeId })
      setActivePanel('')
    },
    [addTask, employees, newTaskForm, pushNotification]
  )

  const handleAssignTask = useCallback(
    (event) => {
      event.preventDefault()
      if (!assignForm.taskId || !assignForm.employeeId) return

      assignTask(assignForm.taskId, assignForm.employeeId)
      const task = tasks.find((entry) => entry.id === Number(assignForm.taskId))
      const employee = employees.find((entry) => entry.id === Number(assignForm.employeeId))
      if (task && employee) {
        pushNotification(`Admin assigned "${task.title}" to ${employee.name}.`, 'info')
      }
      setActivePanel('')
    },
    [assignForm, assignTask, employees, pushNotification, tasks]
  )

  const handleDeleteTask = useCallback(
    (event) => {
      event.preventDefault()
      if (!deleteTaskId) return
      const task = tasks.find((entry) => entry.id === Number(deleteTaskId))
      deleteTask(deleteTaskId)
      if (task) {
        pushNotification(`Admin deleted task "${task.title}".`, 'warning')
      }
      setActivePanel('')
    },
    [deleteTask, deleteTaskId, pushNotification, tasks]
  )

  const handleAddEmployee = useCallback(
    (event) => {
      event.preventDefault()
      if (!employeeForm.name || !employeeForm.email || !employeeForm.role) return
      addEmployee(employeeForm)
      pushNotification(`Admin added employee ${employeeForm.name}.`, 'success')
      setEmployeeForm({ name: '', email: '', role: roles[0] })
      setActivePanel('')
    },
    [addEmployee, employeeForm, pushNotification]
  )

  const handleRemoveEmployee = useCallback(
    (event) => {
      event.preventDefault()
      if (!removeEmployeeId) return
      const target = employees.find((entry) => entry.id === Number(removeEmployeeId))
      removeEmployee(removeEmployeeId)
      if (target) {
        pushNotification(`Admin removed employee ${target.name}.`, 'warning')
      }
      setActivePanel('')
    },
    [employees, pushNotification, removeEmployee, removeEmployeeId]
  )

  const downloadReport = useCallback(
    (format, type) => {
      const reportLines = [
        `Report Type: ${type}`,
        `Generated On: ${new Date().toLocaleString('en-IN')}`,
        `Total Employees: ${employees.length}`,
        `Total Tasks: ${tasks.length}`,
        `Completed Tasks: ${taskCounts.completed}`,
      ]
      const content = reportLines.join('\n')
      const blob = new Blob([content], { type: format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${type.toLowerCase().replace(/\s+/g, '-')}-report.${format}`
      anchor.click()
      URL.revokeObjectURL(url)
      setReportMessage(`${type} downloaded as ${format.toUpperCase()}.`)
      pushNotification(`Admin generated ${type} in ${format.toUpperCase()} format.`, 'info')
    },
    [employees.length, pushNotification, taskCounts.completed, tasks.length]
  )

  const handleActionClick = useCallback((panelKey) => {
    setReportMessage('')
    setActivePanel((previous) => (previous === panelKey ? '' : panelKey))
  }, [])

  const onTaskFormChange = useCallback((field, value) => {
    setNewTaskForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const onAssignFormChange = useCallback((field, value) => {
    setAssignForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const onEmployeeFormChange = useCallback((field, value) => {
    setEmployeeForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const renderTeamTable = useCallback(
    () => (
      <div className='overflow-x-auto'>
        <table className='min-w-full text-left text-sm text-white'>
          <thead>
            <tr className='border-b border-white/15 text-white/75'>
              <th className='px-3 py-2 font-medium'>Name</th>
              <th className='px-3 py-2 font-medium'>Role</th>
              <th className='px-3 py-2 font-medium'>Tasks Assigned</th>
              <th className='px-3 py-2 font-medium'>Tasks Completed</th>
              <th className='px-3 py-2 font-medium'>Status</th>
              <th className='px-3 py-2 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className='border-b border-white/10 transition-colors duration-300 hover:bg-white/5'>
                <td className='px-3 py-3 font-medium'>{employee.name}</td>
                <td className='px-3 py-3 text-white/80'>{employee.role}</td>
                <td className='px-3 py-3'>{employee.assigned}</td>
                <td className='px-3 py-3'>{employee.completed}</td>
                <td className='px-3 py-3'>
                  <span className={`rounded-full px-2 py-1 text-xs ${employee.status === 'Active' ? 'bg-emerald-500/20 text-emerald-200' : employee.status === 'Busy' ? 'bg-amber-500/20 text-amber-200' : 'bg-red-500/20 text-red-200'}`}>
                    {employee.status}
                  </span>
                </td>
                <td className='px-3 py-3'>
                  <div className='flex flex-wrap gap-2'>
                    <button type='button' onClick={() => handleOpenProfile(employee)} className='rounded-md bg-cyan-500/20 px-2 py-1 text-xs text-cyan-200 transition-colors duration-300 hover:bg-cyan-500/35'>View Profile</button>
                    <button type='button' onClick={() => handleAssignTaskFromEmployee(employee.id)} className='rounded-md bg-blue-500/20 px-2 py-1 text-xs text-blue-200 transition-colors duration-300 hover:bg-blue-500/35'>Assign Task</button>
                    <button
                      type='button'
                      onClick={() => handleToggleEmployeeStatus(employee.id)}
                      className={`rounded-md px-2 py-1 text-xs transition-colors duration-300 ${
                        employee.status === 'On Leave'
                          ? 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/35'
                          : 'bg-red-500/20 text-red-200 hover:bg-red-500/35'
                      }`}
                    >
                      {employee.status === 'On Leave' ? 'Activate' : 'Deactivate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
    [filteredEmployees, handleAssignTaskFromEmployee, handleOpenProfile, handleToggleEmployeeStatus]
  )

  const renderActivePanel = () => {
    if (activePanel === 'createTask') {
      return (
        <div className='space-y-4'>
          <div className='inline-flex rounded-xl border border-white/20 bg-black/20 p-1'>
            <button type='button' onClick={() => setTaskActionType('create')} className={`rounded-lg px-3 py-1.5 text-sm transition-all ${taskActionType === 'create' ? 'bg-emerald-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>Create Task</button>
            <button type='button' onClick={() => setTaskActionType('delete')} className={`rounded-lg px-3 py-1.5 text-sm transition-all ${taskActionType === 'delete' ? 'bg-red-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>Delete Task</button>
          </div>

          {taskActionType === 'create' ? (
            <form onSubmit={handleCreateTask} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Task Title</label>
                <input value={newTaskForm.title} onChange={(event) => onTaskFormChange('title', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300' placeholder='Enter task title' />
              </div>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Assign Employee</label>
                <select value={newTaskForm.employeeId} onChange={(event) => onTaskFormChange('employeeId', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300'>
                  <option value='' className='bg-slate-900'>Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id} className='bg-slate-900'>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='md:col-span-2'>
                <label className='mb-1 block text-sm text-white/85'>Description</label>
                <textarea value={newTaskForm.description} onChange={(event) => onTaskFormChange('description', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300' rows={3} placeholder='Enter task description' />
              </div>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Priority</label>
                <select value={newTaskForm.priority} onChange={(event) => onTaskFormChange('priority', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300'>
                  <option className='bg-slate-900'>High</option>
                  <option className='bg-slate-900'>Medium</option>
                  <option className='bg-slate-900'>Low</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Due Date</label>
                <input type='date' value={newTaskForm.date} onChange={(event) => onTaskFormChange('date', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300' />
              </div>
              <div className='md:col-span-2'>
                <button type='submit' className='rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-emerald-400'>Submit Task</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleDeleteTask} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Select Task</label>
                <select value={deleteTaskId} onChange={(event) => setDeleteTaskId(event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-red-300'>
                  <option value='' className='bg-slate-900'>Select task</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id} className='bg-slate-900'>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-end'>
                <button type='submit' className='w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-red-400'>Delete Task</button>
              </div>
            </form>
          )}
        </div>
      )
    }

    if (activePanel === 'assignTask') {
      return (
        <div className='space-y-4'>
          <form onSubmit={handleAssignTask} className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='mb-1 block text-sm text-white/85'>Task List</label>
              <select value={assignForm.taskId} onChange={(event) => onAssignFormChange('taskId', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300'>
                <option value='' className='bg-slate-900'>Select task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id} className='bg-slate-900'>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='mb-1 block text-sm text-white/85'>Employee</label>
              <select value={assignForm.employeeId} onChange={(event) => onAssignFormChange('employeeId', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300'>
                <option value='' className='bg-slate-900'>Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id} className='bg-slate-900'>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-end'>
              <button type='submit' className='w-full rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-cyan-400'>Assign Task</button>
            </div>
          </form>
        </div>
      )
    }

    if (activePanel === 'addEmployee') {
      return (
        <div className='space-y-4'>
          <div className='inline-flex rounded-xl border border-white/20 bg-black/20 p-1'>
            <button type='button' onClick={() => setEmployeeActionType('add')} className={`rounded-lg px-3 py-1.5 text-sm transition-all ${employeeActionType === 'add' ? 'bg-violet-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>Add Employee</button>
            <button type='button' onClick={() => setEmployeeActionType('remove')} className={`rounded-lg px-3 py-1.5 text-sm transition-all ${employeeActionType === 'remove' ? 'bg-red-500 text-white' : 'text-white/80 hover:bg-white/10'}`}>Remove Employee</button>
          </div>

          {employeeActionType === 'add' ? (
            <form onSubmit={handleAddEmployee} className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Employee Name</label>
                <input value={employeeForm.name} onChange={(event) => onEmployeeFormChange('name', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300' placeholder='Enter employee name' />
              </div>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Email</label>
                <input type='email' value={employeeForm.email} onChange={(event) => onEmployeeFormChange('email', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300' placeholder='employee@ems.com' />
              </div>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Role</label>
                <select value={employeeForm.role} onChange={(event) => onEmployeeFormChange('role', event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-cyan-300'>
                  {roles.map((role) => (
                    <option key={role} className='bg-slate-900'>{role}</option>
                  ))}
                </select>
              </div>
              <div className='md:col-span-3'>
                <button type='submit' className='rounded-lg bg-violet-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-violet-400'>Add Employee</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRemoveEmployee} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm text-white/85'>Select Employee</label>
                <select value={removeEmployeeId} onChange={(event) => setRemoveEmployeeId(event.target.value)} className='w-full rounded-lg border border-white/20 bg-black/25 px-3 py-2 text-white outline-none focus:border-red-300'>
                  <option value='' className='bg-slate-900'>Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id} className='bg-slate-900'>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-end'>
                <button type='submit' className='w-full rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-red-400'>Remove Employee</button>
              </div>
            </form>
          )}
        </div>
      )
    }

    if (activePanel === 'report') {
      const reportTypes = ['Daily Report', 'Weekly Report', 'Task Performance Report']
      return (
        <div className='space-y-4'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            {reportTypes.map((type) => (
              <div key={type} className='rounded-xl border border-white/20 bg-black/25 p-3'>
                <p className='mb-3 font-medium text-white'>{type}</p>
                <div className='flex gap-2'>
                  <button type='button' onClick={() => downloadReport('csv', type)} className='rounded-md bg-emerald-500/80 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-emerald-400'>
                    Download CSV
                  </button>
                  <button type='button' onClick={() => downloadReport('pdf', type)} className='rounded-md bg-blue-500/80 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-300 hover:bg-blue-400'>
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className='text-sm text-emerald-200'>{reportMessage}</p>
        </div>
      )
    }

    return renderTeamTable()
  }

  return (
    <div className='dashboard-page-bg'>
      <div className='dashboard-bg-noise' />
      <div className='dashboard-bg-glow-left' />
      <div className='dashboard-bg-glow-right' />
      <Sidebar
        navItems={adminNavItems}
        panelLabel='EMS ADMIN'
        panelTitle='Employer Workspace'
        activeKey={activeNav}
        onNavChange={setActiveNav}
      />

      <main className='relative lg:pl-[250px]'>
        <div className='p-4 md:p-6 xl:p-8'>
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLogout={logout}
            onViewProfile={openMyProfile}
            notifications={notifications}
            onClearNotifications={clearNotifications}
            panelLabel='Admin Panel'
            title='Welcome Admin'
            profileName={user.name}
            profileInitial='AD'
            notificationCount={5}
          />

          {(activeNav === 'dashboard' || activeNav === 'tasks' || activeNav === 'employees' || activeNav === 'reports') && (
            <QuickActions actions={adminActions} activeAction={activePanel} onActionClick={handleActionClick} />
          )}

          {activePanel && (
            <section className='mt-4 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <div className='mb-3 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-white'>Dynamic Panel Area</h2>
                <span className='rounded-full bg-white/10 px-3 py-1 text-xs text-white/80'>
                  {adminActions.find((item) => item.key === activePanel)?.label || 'Panel'}
                </span>
              </div>
              <div key={activePanel} className='task-card transition-all duration-300'>
                {renderActivePanel()}
              </div>
            </section>
          )}

          {activeNav === 'dashboard' && (
            <>
              <section className='mt-8'>
                <h2 className='mb-4 text-lg font-semibold text-white'>Company Overview</h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5'>
                  {overviewCards.map((card) => (
                    <div key={card.label} className={`summary-card rounded-xl px-6 py-5 text-black shadow-lg ${card.color}`}>
                      <p className='text-sm font-medium'>{card.label}</p>
                      <p className='mt-2 text-3xl font-semibold'>{card.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className='mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                <RecentActivity events={recentActivity} />
                <UpcomingDeadlines tasks={upcomingDeadlines} />
              </section>
            </>
          )}

          {activeNav === 'employees' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-white'>Employee Management</h2>
                <span className='rounded-full bg-white/10 px-3 py-1 text-xs text-white/85'>{filteredEmployees.length} Employees</span>
              </div>
              {renderTeamTable()}
            </section>
          )}

          {activeNav === 'tasks' && (
            <Suspense fallback={lazyFallback}>
              <TaskList tasks={filteredTasks} />
            </Suspense>
          )}

          {activeNav === 'analytics' && (
            <Suspense fallback={lazyFallback}>
              <AnalyticsSection
                distributionData={distributionData}
                productivityData={productivityData}
                performanceData={performanceData}
                totalTasks={tasks.length}
              />
            </Suspense>
          )}

          {activeNav === 'reports' && (
            <section className='mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2'>
              <Suspense fallback={lazyFallback}>
                <AnalyticsSection
                  distributionData={distributionData}
                  productivityData={productivityData}
                  performanceData={performanceData}
                  totalTasks={tasks.length}
                />
              </Suspense>
              <UpcomingDeadlines tasks={upcomingDeadlines} />
            </section>
          )}

          {activeNav === 'settings' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <h2 className='mb-3 text-lg font-semibold text-white'>Settings</h2>
              <div className='space-y-3 text-sm text-white/85'>
                <p>Logged in as: {user.name}</p>
                <p>Email: {user.email}</p>
                <button type='button' onClick={logout} className='rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-400'>
                  Logout
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {selectedProfile && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-white/20 bg-[#0f172a]/95 p-5 shadow-2xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-white'>Employee Profile</h3>
              <button type='button' onClick={closeProfile} className='rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20'>
                Close
              </button>
            </div>
            <div className='space-y-2 text-sm text-white/90'>
              <p><span className='text-white/60'>Name:</span> {selectedProfile.name}</p>
              <p><span className='text-white/60'>Email:</span> {selectedProfile.email}</p>
              <p><span className='text-white/60'>Role:</span> {selectedProfile.role}</p>
              <p><span className='text-white/60'>Tasks Assigned:</span> {selectedProfile.assigned}</p>
              <p><span className='text-white/60'>Tasks Completed:</span> {selectedProfile.completed}</p>
              <p><span className='text-white/60'>Status:</span> {selectedProfile.status}</p>
            </div>
          </div>
        </div>
      )}

      {showMyProfileModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-white/20 bg-[#0f172a]/95 p-5 shadow-2xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-white'>Admin Profile</h3>
              <button type='button' onClick={closeMyProfile} className='rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20'>
                Close
              </button>
            </div>
            <div className='space-y-2 text-sm text-white/90'>
              <p><span className='text-white/60'>Name:</span> {user.name}</p>
              <p><span className='text-white/60'>Email:</span> {user.email}</p>
              <p><span className='text-white/60'>Role:</span> Admin</p>
              <p><span className='text-white/60'>Total Employees:</span> {employees.length}</p>
              <p><span className='text-white/60'>Total Tasks:</span> {tasks.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
