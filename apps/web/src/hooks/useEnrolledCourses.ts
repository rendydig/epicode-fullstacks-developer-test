import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

export interface EnrolledCourse {
  id: string
  status: string
  enrollment_date: string
  course_id: {
    id: string
    name: string
    description: string
    organization: {
      id: string
      name: string
    }
  }
}

export function useEnrolledCourses() {
  const { isAuthenticated, token } = useAuth()
 
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const { data } = await api.get<{ data: EnrolledCourse[] }>('/items/enrollments', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          fields: "*.*.*",
        }
      })
      return data.data
    },
    gcTime: 0, // Disable caching (previously cacheTime)
    staleTime: 0, // Mark data as immediately stale
    enabled: isAuthenticated,
  })
}
