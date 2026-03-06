import React, { useMemo, useState } from 'react'
import Header from '../other/Header'
import TaskListNumbers from '../other/TaskListNumbers'
import TaskList from '../TaskList/TaskList'
import AnalyticsSection from '../other/AnalyticsSection'
import RecentActivity from '../other/RecentActivity'
import UpcomingDeadlines from '../other/UpcomingDeadlines'
import Sidebar from '../other/Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useTaskData } from '../../context/TaskContext'

const EmployeeDashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, employees, notifications, clearNotifications, updateTaskStatus, toggleEmployeeStatus, pushNotification } = useTaskData()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeNav, setActiveNav] = useState('dashboard')
  const [showProfileModal, setShowProfileModal] = useState(false)

  const employeeNavItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '▦' },
    { key: 'tasks', label: 'Tasks', icon: '✓' },
    { key: 'team', label: 'Team', icon: '◉' },
    { key: 'calendar', label: 'Calendar', icon: '▣' },
    { key: 'reports', label: 'Reports', icon: '◌' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
  ]

  const myTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === Number(user.id)),
    [tasks, user.id]
  )

  const taskCounts = myTasks.reduce(
    (acc, task) => {
      if (task.status === 'new') acc.new += 1
      if (task.status === 'accepted') acc.accepted += 1
      if (task.status === 'completed') acc.completed += 1
      if (task.status === 'failed') acc.failed += 1
      return acc
    },
    { new: 0, accepted: 0, completed: 0, failed: 0 }
  )

  const filteredTasks = myTasks.filter((task) => {
    const statusMatch = activeFilter === 'all' || task.status === activeFilter
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return statusMatch
    const searchableText = `${task.title} ${task.description} ${task.priority}`.toLowerCase()
    return statusMatch && searchableText.includes(keyword)
  })

  const distributionData = [
    { name: 'New', value: taskCounts.new, color: '#f87171', percentage: myTasks.length ? (taskCounts.new / myTasks.length) * 100 : 0 },
    { name: 'Accepted', value: taskCounts.accepted, color: '#60a5fa', percentage: myTasks.length ? (taskCounts.accepted / myTasks.length) * 100 : 0 },
    { name: 'Completed', value: taskCounts.completed, color: '#4ade80', percentage: myTasks.length ? (taskCounts.completed / myTasks.length) * 100 : 0 },
    { name: 'Failed', value: taskCounts.failed, color: '#facc15', percentage: myTasks.length ? (taskCounts.failed / myTasks.length) * 100 : 0 },
  ]

  const productivityData = [
    { day: 'Mon', value: 2 },
    { day: 'Tue', value: 4 },
    { day: 'Wed', value: 1 },
    { day: 'Thu', value: 3 },
    { day: 'Fri', value: 5 },
    { day: 'Sat', value: 2 },
    { day: 'Sun', value: 3 },
  ]

  const recentActivity = [
    { id: 1, title: 'Task completed', detail: 'Recent task was marked as completed.', time: '10 min ago' },
    { id: 2, title: 'New task assigned', detail: 'A new task was assigned to your queue.', time: '28 min ago' },
    { id: 3, title: 'Status updated', detail: 'One task was moved to accepted.', time: '1 hr ago' },
    { id: 4, title: 'Task updated', detail: 'Task details were updated for follow-up.', time: '2 hrs ago' },
  ]

  const upcomingDeadlines = [...myTasks]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)
    .map((task) => ({
      ...task,
      date: new Date(task.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }))

  const teamMembers = employees.filter((employee) => employee.id !== Number(user.id))
  const currentEmployee = employees.find((employee) => employee.id === Number(user.id))

  const handleEmployeeTaskStatus = (taskId, nextStatus) => {
    updateTaskStatus(taskId, nextStatus)
    const changedTask = myTasks.find((task) => task.id === taskId)
    if (changedTask) {
      pushNotification(`${user.name} updated "${changedTask.title}" to ${nextStatus}.`, 'info')
    }
  }

  const handleLeaveToggle = () => {
    toggleEmployeeStatus(user.id)
    const next = currentEmployee?.status === 'On Leave' ? 'Active' : 'On Leave'
    pushNotification(`${user.name} marked status as ${next}.`, 'warning')
  }

  return (
    <div className='dashboard-page-bg'>
      <div className='dashboard-bg-noise' />
      <div className='dashboard-bg-glow-left' />
      <div className='dashboard-bg-glow-right' />
      <Sidebar
        panelLabel='EMS'
        panelTitle='Employee Workspace'
        navItems={employeeNavItems}
        activeKey={activeNav}
        onNavChange={setActiveNav}
      />
      <main className='relative lg:pl-[250px]'>
        <div className='p-4 md:p-6 xl:p-8'>
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLogout={logout}
            onViewProfile={() => setShowProfileModal(true)}
            notifications={notifications}
            onClearNotifications={clearNotifications}
            panelLabel='Employee Panel'
            title={`Hello, ${user.name}`}
            profileName={user.name}
            profileInitial={user.name.slice(0, 1).toUpperCase()}
            notificationCount={2}
          />

          {activeNav === 'dashboard' && (
            <>
              <TaskListNumbers counts={taskCounts} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
              <TaskList tasks={filteredTasks} />
              <AnalyticsSection distributionData={distributionData} productivityData={productivityData} totalTasks={myTasks.length} />
              <section className='mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2'>
                <RecentActivity events={recentActivity} />
                <UpcomingDeadlines tasks={upcomingDeadlines} />
              </section>
            </>
          )}

          {activeNav === 'tasks' && (
            <>
              <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
                <h2 className='mb-3 text-lg font-semibold text-white'>Assigned Tasks</h2>
                <TaskList tasks={filteredTasks} />
                <div className='mt-4 grid grid-cols-1 gap-3 md:grid-cols-2'>
                  {filteredTasks.map((task) => (
                    <div key={task.id} className='rounded-xl border border-white/15 bg-black/20 p-3'>
                      <p className='font-medium text-white'>{task.title}</p>
                      <div className='mt-2 flex flex-wrap gap-2'>
                        <button type='button' onClick={() => handleEmployeeTaskStatus(task.id, 'accepted')} className='rounded-md bg-blue-500/25 px-2 py-1 text-xs text-blue-200 hover:bg-blue-500/35'>Accept</button>
                        <button type='button' onClick={() => handleEmployeeTaskStatus(task.id, 'completed')} className='rounded-md bg-emerald-500/25 px-2 py-1 text-xs text-emerald-200 hover:bg-emerald-500/35'>Complete</button>
                        <button type='button' onClick={() => handleEmployeeTaskStatus(task.id, 'failed')} className='rounded-md bg-red-500/25 px-2 py-1 text-xs text-red-200 hover:bg-red-500/35'>Fail</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeNav === 'team' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <h2 className='mb-3 text-lg font-semibold text-white'>Team Members</h2>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-sm text-white'>
                  <thead>
                    <tr className='border-b border-white/15 text-white/75'>
                      <th className='px-3 py-2 font-medium'>Name</th>
                      <th className='px-3 py-2 font-medium'>Role</th>
                      <th className='px-3 py-2 font-medium'>Assigned</th>
                      <th className='px-3 py-2 font-medium'>Completed</th>
                      <th className='px-3 py-2 font-medium'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className='border-b border-white/10 hover:bg-white/5'>
                        <td className='px-3 py-3 font-medium'>{member.name}</td>
                        <td className='px-3 py-3 text-white/80'>{member.role}</td>
                        <td className='px-3 py-3'>{member.assigned}</td>
                        <td className='px-3 py-3'>{member.completed}</td>
                        <td className='px-3 py-3'>
                          <span className='rounded-full bg-white/10 px-2 py-1 text-xs'>{member.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeNav === 'calendar' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <h2 className='mb-3 text-lg font-semibold text-white'>Calendar / Deadlines</h2>
              <UpcomingDeadlines tasks={upcomingDeadlines} />
            </section>
          )}

          {activeNav === 'reports' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <h2 className='mb-3 text-lg font-semibold text-white'>Performance Reports</h2>
              <AnalyticsSection distributionData={distributionData} productivityData={productivityData} totalTasks={myTasks.length} />
            </section>
          )}

          {activeNav === 'settings' && (
            <section className='mt-8 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md'>
              <h2 className='mb-3 text-lg font-semibold text-white'>Settings</h2>
              <div className='space-y-3 text-sm text-white/85'>
                <p>Profile Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Status: {currentEmployee?.status || 'Active'}</p>
                <button type='button' onClick={handleLeaveToggle} className='rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-400'>
                  {currentEmployee?.status === 'On Leave' ? 'Return to Work' : 'Take Leave'}
                </button>
                <button type='button' onClick={logout} className='rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-400'>
                  Logout
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {showProfileModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-md rounded-2xl border border-white/20 bg-[#0f172a]/95 p-5 shadow-2xl'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-white'>My Profile</h3>
              <button type='button' onClick={() => setShowProfileModal(false)} className='rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20'>
                Close
              </button>
            </div>
            <div className='space-y-2 text-sm text-white/90'>
              <p><span className='text-white/60'>Name:</span> {user.name}</p>
              <p><span className='text-white/60'>Email:</span> {user.email}</p>
              <p><span className='text-white/60'>Role:</span> Employee</p>
              <p><span className='text-white/60'>Assigned Tasks:</span> {myTasks.length}</p>
              <p><span className='text-white/60'>Completed Tasks:</span> {taskCounts.completed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDashboard
