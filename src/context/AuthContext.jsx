import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  CURRENT_USER_STORAGE_KEY,
  USERS_STORAGE_KEY,
  getStoredArray,
  initializeAppData,
} from '../utlis/localStorage'

const AuthStateContext = createContext(null)
const AuthActionsContext = createContext(null)

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
  const [user, setUser] = useState(() => {
    initializeAppData()
    return getStoredUser()
  })
  const [authError, setAuthError] = useState('')

  const login = useCallback((email, password) => {
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
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAuthError('')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    }
  }, [])

  const stateValue = useMemo(
    () => ({
      user,
      authError,
    }),
    [authError, user]
  )

  const actionsValue = useMemo(
    () => ({
      login,
      logout,
    }),
    [login, logout]
  )

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>{children}</AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthState = () => {
  const context = useContext(AuthStateContext)
  if (!context) {
    throw new Error('useAuthState must be used inside AuthProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthActions = () => {
  const context = useContext(AuthActionsContext)
  if (!context) {
    throw new Error('useAuthActions must be used inside AuthProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const state = useAuthState()
  const actions = useAuthActions()
  return useMemo(() => ({ ...state, ...actions }), [actions, state])
}
