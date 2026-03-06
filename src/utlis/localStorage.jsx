export const USERS_STORAGE_KEY = 'ems_users'
export const CURRENT_USER_STORAGE_KEY = 'ems_current_user'
export const TASKS_STORAGE_KEY = 'ems_tasks'
export const EMPLOYEES_STORAGE_KEY = 'ems_employees'

export const defaultUsers = [
  {
    id: 'admin-1',
    name: 'Abhishek Upadhyay',
    email: 'abhishek.admin@ems.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 1,
    name: 'Aarav Mehta',
    email: 'aarav@ems.com',
    password: 'Aarav@123',
    role: 'employee',
  },
  {
    id: 2,
    name: 'Sana Khan',
    email: 'sana@ems.com',
    password: 'Sana@123',
    role: 'employee',
  },
  {
    id: 3,
    name: 'Vikram Rao',
    email: 'vikram@ems.com',
    password: 'Vikram@123',
    role: 'employee',
  },
  {
    id: 4,
    name: 'Neha Sharma',
    email: 'neha@ems.com',
    password: 'Neha@123',
    role: 'employee',
  },
  {
    id: 5,
    name: 'Rohan Singh',
    email: 'rohan@ems.com',
    password: 'Rohan@123',
    role: 'employee',
  },
]

export const defaultEmployees = [
  { id: 1, name: 'Aarav Mehta', email: 'aarav@ems.com', role: 'Frontend Developer', assigned: 5, completed: 3, status: 'Active' },
  { id: 2, name: 'Sana Khan', email: 'sana@ems.com', role: 'QA Engineer', assigned: 4, completed: 4, status: 'Active' },
  { id: 3, name: 'Vikram Rao', email: 'vikram@ems.com', role: 'Backend Developer', assigned: 6, completed: 2, status: 'Busy' },
  { id: 4, name: 'Neha Sharma', email: 'neha@ems.com', role: 'UI/UX Designer', assigned: 3, completed: 2, status: 'Active' },
  { id: 5, name: 'Rohan Singh', email: 'rohan@ems.com', role: 'DevOps Engineer', assigned: 2, completed: 1, status: 'On Leave' },
]

export const defaultTasks = [
  { id: 1, title: 'Prepare report', date: '2026-03-06', priority: 'High', status: 'new', description: 'Compile weekly status report and share it with the team.', assignedTo: 1 },
  { id: 2, title: 'Client follow-up', date: '2026-03-06', priority: 'Medium', status: 'accepted', description: 'Reach out to client for feedback on latest delivery.', assignedTo: 2 },
  { id: 3, title: 'Update onboarding', date: '2026-03-06', priority: 'Low', status: 'completed', description: 'Finalize onboarding documentation updates.', assignedTo: 2 },
  { id: 4, title: 'Fix payment bug', date: '2026-03-06', priority: 'High', status: 'failed', description: 'Resolve payment mismatch issue in checkout flow.', assignedTo: 3 },
  { id: 5, title: 'Review PR #241', date: '2026-03-07', priority: 'Medium', status: 'accepted', description: 'Review pending pull request and provide comments.', assignedTo: 1 },
  { id: 6, title: 'Design homepage', date: '2026-03-07', priority: 'High', status: 'new', description: 'Draft homepage wireframe and hand off to dev team.', assignedTo: 4 },
  { id: 7, title: 'Deploy hotfix', date: '2026-03-08', priority: 'High', status: 'accepted', description: 'Deploy hotfix for login timeout regression.', assignedTo: 5 },
  { id: 8, title: 'QA smoke test', date: '2026-03-09', priority: 'High', status: 'completed', description: 'Execute smoke tests for release candidate.', assignedTo: 2 },
]

const seedIfMissing = (key, value) => {
  if (typeof window === 'undefined') return
  if (!window.localStorage.getItem(key)) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export const initializeAppData = () => {
  seedIfMissing(USERS_STORAGE_KEY, defaultUsers)
  seedIfMissing(EMPLOYEES_STORAGE_KEY, defaultEmployees)
  seedIfMissing(TASKS_STORAGE_KEY, defaultTasks)
}

export const getStoredArray = (key, fallback) => {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}
