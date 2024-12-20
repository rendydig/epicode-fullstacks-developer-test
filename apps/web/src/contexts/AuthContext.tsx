import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createDirectus, authentication, rest } from '@directus/sdk'

interface AuthContextType {
  isAuthenticated: boolean
  user: any | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const client = createDirectus(import.meta.env.VITE_API_URL)
  .with(authentication())
  .with(rest())

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await client.request(authentication.refresh())
        setIsAuthenticated(true)
        setUser(response.user)
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await client.request(
        authentication.login(email, password)
      )
      setIsAuthenticated(true)
      setUser(response.user)
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const logout = async () => {
    try {
      await client.request(authentication.logout())
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
