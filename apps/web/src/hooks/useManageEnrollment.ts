import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

interface EnrollmentData {
  user_id: string
  course_id: string
  status: 'active' | 'inactive'
}

export function useManageEnrollment() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const enrollMutation = useMutation({
    mutationFn: async (data: EnrollmentData) => {
      const response = await api.post('/items/enrollments', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
    }
  })

  const unenrollMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const response = await api.delete(`/items/enrollments/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
    }
  })

  const updateEnrollmentStatus = useMutation({
    mutationFn: async ({ enrollmentId, status }: { enrollmentId: string, status: 'active' | 'inactive' }) => {
      const response = await api.patch(`/items/enrollments/${enrollmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { status }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
    }
  })

  return {
    enrollStudent: enrollMutation.mutate,
    unenrollStudent: unenrollMutation.mutate,
    updateStatus: updateEnrollmentStatus.mutate,
    isLoading: enrollMutation.isPending || unenrollMutation.isPending || updateEnrollmentStatus.isPending,
    error: enrollMutation.error || unenrollMutation.error || updateEnrollmentStatus.error
  }
}
