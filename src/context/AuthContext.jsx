import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  CURRENT_USER_STORAGE_KEY,
  USERS_STORAGE_KEY,
  getStoredArray,
  initializeAppData,
} from '../utlis/localStorage'

const AuthContext = createContext(null)

const getStoredUser = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  initializeAppData()

  const [user, setUser] = useState(() => getStoredUser())
  const [authError, setAuthError] = useState('')

  const login = (email, password) => {
    const users = getStoredArray(USERS_STORAGE_KEY, [])
    const matchedUser = users.find(
      (entry) =>
        entry.email.toLowerCase() === email.toLowerCase().trim() &&
        entry.password === password
    )

    if (!matchedUser) {
      setAuthError('Invalid email or password.')
      return false
    }

    const safeUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
    }
    setUser(safeUser)
    setAuthError('')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(safeUser))
    }
    return true
  }

  const logout = () => {
    setUser(null)
    setAuthError('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    }
  }

  const value = useMemo(
    () => ({
      user,
      authError,
      login,
      logout,
    }),
    [user, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
