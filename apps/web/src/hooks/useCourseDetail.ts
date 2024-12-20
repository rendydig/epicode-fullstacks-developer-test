import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

export interface ContentItem {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  content_url: string | null
  duration: number | null
  order_index: number
  status: string
}

export interface Section {
  id: string
  title: string
  description: string
  order_index: number
  status: string
  content_items: ContentItem[]
}

export interface CourseDetail {
  id: string
  name: string
  description: string
  organization_id: {
    id: string
    name: string
  }
  sections: Section[]
}

export function useCourseDetail(courseId: string) {
  const { isAuthenticated, token } = useAuth()
  // Get auth token from localStorage
  return useQuery({
    queryKey: ['courseDetail', courseId],
    queryFn: async () => {
      const { data } = await api.get<{ data: CourseDetail }>(`/items/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          // fields: [
          //   'id',
          //   'name',
          //   'description',
          //   'organization_id.id',
          //   'organization_id.name',
          //   'sections.id',
          //   'sections.title',
          //   'sections.description',
          //   'sections.order_index',
          //   'sections.status',
          //   'sections.content_items.id',
          //   'sections.content_items.title',
          //   'sections.content_items.description',
          //   'sections.content_items.type',
          //   'sections.content_items.content_url',
          //   'sections.content_items.duration',
          //   'sections.content_items.order_index',
          //   'sections.content_items.status'
          // ]
          fields: "*.*.*"
        }
      })
      return data.data
    },
    enabled: !!courseId && !!token && isAuthenticated
  })
}
