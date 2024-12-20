import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

interface Student {
  id: string
  first_name: string
  last_name: string
  email: string
}

export function useSearchStudents(email: string) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ['searchStudents', email],
    queryFn: async () => {
      const { data } = await api.get<{ data: Student[] }>('/users', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          search: email,
          filter: {
            role: {
              name: {
                _eq: 'student'
              }
            }
          },
          fields: ['id', 'first_name', 'last_name', 'email']
        }
      })
      return data.data
    },
    enabled: !!token && email.length > 2, // Only search when email is at least 3 characters
  })
}
