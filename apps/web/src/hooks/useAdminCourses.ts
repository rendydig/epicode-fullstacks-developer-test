import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import type { Course } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

export const useAdminCourses = () => {
  const { isAuthenticated, token } = useAuth()
  // Get auth token from localStorage
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get('/items/epicode_courses', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          fields: "*.*.*"
        }
      })
      return data.data as Course[]
    },
    enabled: !!token && isAuthenticated
  })
}
