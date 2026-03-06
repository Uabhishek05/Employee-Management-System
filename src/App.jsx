import React, { Suspense, lazy } from 'react'
import { useAuth } from './context/AuthContext'

const Login = lazy(() => import('./components/Auth/Login'))
const EmployeeDashboard = lazy(() => import('./components/Dashboard/EmployeeDashboard'))
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'))

const App = () => {
  const { user } = useAuth()

  return (
    <Suspense fallback={<div className='p-6 text-white'>Loading EMS...</div>}>
      {!user && <Login />}
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role !== 'admin' && user && <EmployeeDashboard />}
    </Suspense>
  )
}

export default App
