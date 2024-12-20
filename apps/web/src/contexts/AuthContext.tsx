import { ReactNode, useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  authDataAtom,
  userAtom,
  isLoadingAtom,
  errorAtom,
  authActions,
  type User
} from '../lib/directus'

interface AuthContextProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthContextProps) {
  const [authData, setAuthData] = useAtom(authDataAtom)
  const [, setUser] = useAtom(userAtom)
  const [, setLoading] = useAtom(isLoadingAtom)
  const [, setError] = useAtom(errorAtom)

  useEffect(() => {
    const initAuth = async () => {
      // Don't try to refresh if we don't have a refresh token
      if (!authData?.refresh_token) {
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const { auth, user } = await authActions.refresh()
        setAuthData({
          access_token: auth.access_token,
          refresh_token: auth.refresh_token
        })
        setUser(user)
        setError(null)
      } catch (error) {
        setAuthData(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [authData?.refresh_token, setAuthData, setUser, setLoading, setError])

  return <>{children}</>
}

export function useAuth() {
  const [authData, setAuthData] = useAtom(authDataAtom)
  const [user, setUser] = useAtom(userAtom)
  const [isLoading, setLoading] = useAtom(isLoadingAtom)
  const [error, setError] = useAtom(errorAtom)

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { auth, user } = await authActions.login(email, password)
      setAuthData({
        access_token: auth.access_token,
        refresh_token: auth.refresh_token
      })
      setUser(user)
    } catch (error) {
      setError('Invalid email or password')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authActions.logout()
    } finally {
      setAuthData(null)
      setUser(null)
      setLoading(false)
      setError(null)
    }
  }

  return {
    isAuthenticated: !!authData?.access_token,
    user,
    isLoading,
    error,
    login,
    logout
  }
}
