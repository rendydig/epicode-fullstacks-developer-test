import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

interface EnrollmentData {
  course_id: string
  user_id: string
  status?: 'enrolled' | 'completed' | 'dropped' | 'suspended'
  progress?: number
}

export function useManageEnrollment() {
  const queryClient = useQueryClient()
  const { token } = useAuth()

  const enrollMutation = useMutation({
    mutationFn: async (data: EnrollmentData) => {
      const response = await api.post('/items/enrollments', {
        course_id: data.course_id,
        user_id: data.user_id,
        status: data.status || 'enrolled',
        progress: data.progress || 0
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] })
    }
  })

  const removeMutation = useMutation({
    mutationFn: async ({ courseId, userId }: { courseId: string; userId: string }) => {
      // First, find the enrollment record
      const { data } = await api.get('/items/enrollments', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          filter: {
            course_id: { _eq: courseId },
            user_id: { _eq: userId }
          }
        }
      })

      if (data.data && data.data.length > 0) {
        // Delete the enrollment record
        await api.delete(`/items/enrollments/${data.data[0].id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledStudents'] })
    }
  })

  return {
    enrollStudent: enrollMutation.mutateAsync,
    removeStudent: removeMutation.mutateAsync,
    isLoading: enrollMutation.isPending || removeMutation.isPending,
    error: enrollMutation.error || removeMutation.error
  }
}
