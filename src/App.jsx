import React from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { useAuth } from './context/AuthContext'

const App = () => {
  const { user } = useAuth()

  if (!user) return <Login />
  if (user.role === 'admin') return <AdminDashboard />
  return <EmployeeDashboard />
}

export default App
