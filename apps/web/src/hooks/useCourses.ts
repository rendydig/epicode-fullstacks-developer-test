import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import type { Course } from '../lib/directus'

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data } = await api.get('/items/courses', {
        params: {
          fields: ['id', 'name', 'description', 'organization.name']
        }
      })
      return data.data as Course[]
    }
  })
}
