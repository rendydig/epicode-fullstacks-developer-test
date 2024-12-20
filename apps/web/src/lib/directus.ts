import { createDirectus, rest, authentication, AuthenticationClient } from '@directus/sdk'
import axios from 'axios'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Define your collection types
export interface Organization {
  id: string
  name: string
}

export interface Role {
  name: 'admin' | 'student'
}

export interface User {
  id: string
  email: string
  role: Role
  organizations?: Organization[]
}

export interface Course {
  id: string
  name: string
  description: string
  organization: Organization
}

// Define the schema for your collections
export interface Schema {
  organizations: Organization
  users: User
  courses: Course
}

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Create a typed Directus client
export const directus = createDirectus<Schema>(import.meta.env.VITE_API_URL, {
  credentials: 'include',
  mode: 'cors'
})
  .with(authentication())
  .with(rest())

// Store auth data in localStorage to persist sessions
export const authDataAtom = atomWithStorage<{
  access_token: string
  refresh_token: string
} | null>('auth', null)

// User atom derived from auth data
export const userAtom = atom<User | null>(null)

// Loading state atom
export const isLoadingAtom = atom<boolean>(false)

// Error state atom
export const errorAtom = atom<string | null>(null)

// Helper atoms for role checks
export const isAdminAtom = atom((get) => get(userAtom)?.role?.name === 'admin')
export const isStudentAtom = atom((get) => get(userAtom)?.role?.name === 'student')

// Auth actions
export const authActions = {
  login: async (email: string, password: string) => {
    try {
      const client = directus as AuthenticationClient<Schema>
      const auth = await client.login(email, password)
      
      // Set the token for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.access_token}`
      
      // Fetch user data with axios
      const { data } = await api.get('/users/me', {
        params: {
          fields: ['id', 'email', 'role.name', 'organizations.id', 'organizations.name']
        }
      })
      
      return { auth, user: data.data }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      const client = directus as AuthenticationClient<Schema>
      await client.logout()
      // Clear the authorization header
      delete api.defaults.headers.common['Authorization']
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  refresh: async () => {
    try {
      const client = directus as AuthenticationClient<Schema>
      const auth = await client.refresh()
      
      // Set the token for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.access_token}`
      
      // Fetch user data with axios
      const { data } = await api.get('/users/me', {
        params: {
          fields: ['id', 'email', 'role.name', 'organizations.id', 'organizations.name']
        }
      })
      
      return { auth, user: data.data }
    } catch (error) {
      console.error('Refresh error:', error)
      throw error
    }
  }
}

// Export the axios instance for use in other parts of the app
export { api }
