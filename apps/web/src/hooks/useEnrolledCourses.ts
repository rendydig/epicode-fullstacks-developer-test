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
          // filter: {
          //   user_id: {
          //     _eq: user?.data.id
          //   }
          // }
        }
      })
      return data.data
    },
    enabled: !!token && isAuthenticated
  })
}
