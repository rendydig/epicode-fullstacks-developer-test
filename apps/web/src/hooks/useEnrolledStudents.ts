import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
  status: string
}

export function useEnrolledStudents(courseId: string) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['enrolledStudents', courseId],
    queryFn: async () => {
      const { data } = await api.get(`/items/enrollments`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          // filter: {
          //   course_id: { _eq: courseId },
          //   status: { _eq: 'active' }
          // },
          fields: "*.*.*"
        }
      })
      // Transform the data to get just the user information
      return data.data.map((enrollment: any) => ({
        id: enrollment.user_id.id,
        first_name: enrollment.user_id.first_name,
        last_name: enrollment.user_id.last_name,
        email: enrollment.user_id.email,
        status: enrollment.status
      })) as Student[]
    },
    enabled: !!courseId && !!token
  })
}
