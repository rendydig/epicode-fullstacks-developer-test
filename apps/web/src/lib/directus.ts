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
  id: string
  name: 'admin' | 'student'
}

export interface User {
  data: {
    id: string
    email: string
    role: Role
    organizations?: Organization[]
  }
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
})

// Create a typed Directus client
const directus = createDirectus<Schema>(import.meta.env.VITE_API_URL, {
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
export const isAdminAtom = atom((get) => get(userAtom)?.role?.name?.toLocaleLowerCase() === 'admin')
export const isStudentAtom = atom((get) => get(userAtom)?.role?.name?.toLocaleLowerCase() === 'student')

// Auth actions
export const authActions = {
  async login(email: string, password: string) {
    try {
      const client = directus as AuthenticationClient<Schema>
      const auth = await client.login(email, password)
      
      // Set the token for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.access_token}`
      
      // Fetch user data
      const user = await fetchCurrentUser()
      
      return { auth, user }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async logout() {
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

  async refresh() {
    try {
      const client = directus as AuthenticationClient<Schema>
      const auth = await client.refresh()
      
      // Set the token for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${auth.access_token}`
      
      // Fetch user data
      const user = await fetchCurrentUser()
      
      return { auth, user }
    } catch (error) {
      console.error('Refresh error:', error)
      throw error
    }
  }
}

// Helper function to fetch current user
export async function fetchCurrentUser() {
  const { data } = await api.get<User>('/users/me', {
    params: {
      fields: ['id', 'email', 'role.id', 'role.name', 'organizations.id', 'organizations.name']
    }
  })
  return data
}

// Export the axios instance for use in other parts of the app
export { api }
