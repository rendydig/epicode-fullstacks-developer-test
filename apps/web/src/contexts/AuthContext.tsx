import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react'
import { useAtom } from 'jotai'
import { authDataAtom, userAtom, isLoadingAtom, errorAtom } from '../atoms/auth'
import { authActions, fetchCurrentUser, UserData, type User } from '../lib/directus'
import { isTokenExpired } from '../lib/auth'

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  token: string | null
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authData, setAuthData] = useAtom(authDataAtom)
  const [isLoading, setLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)

  // Check token expiration periodically
  useEffect(() => {
    if (!authData) return

    // Check immediately
    if (isTokenExpired(authData)) {
      setAuthData(null)
      return
    }

    // Calculate time until expiration
    const expiresAt = new Date(authData.auth.expires_at).getTime()
    const timeUntilExpiry = expiresAt - Date.now()
    

    // Set up timer to check again just before expiration
    const timer = setTimeout(() => {
      if (isTokenExpired(authData)) {
        setAuthData(null)
      }
    }, Math.max(0, timeUntilExpiry - 5000)) // Check 5 seconds before expiration

    return () => clearTimeout(timer)
  }, [authData, setAuthData])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const authData = await authActions.login(email, password)
      if(authData) {
        const user = await fetchCurrentUser()
        authData.user = user
        setAuthData(authData)
      }
     
    } catch (err) {
      console.error('Error during login:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authActions.logout()
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      setAuthData(null)
      setError(null)
      setLoading(false)
    }
  }

  const isAuthenticated = !!authData?.auth?.access_token && !isTokenExpired(authData)
  
  const isAdmin = authData?.user?.data?.role?.name?.toLowerCase() === 'admin' || 
                 authData?.user?.data?.role?.name?.toLowerCase() === 'administrator'
  const value = {
    user: authData?.user,
    isAuthenticated,
    isLoading,
    token: isAuthenticated ? authData?.auth?.access_token : null,
    error,
    login,
    logout,
    isAdmin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
