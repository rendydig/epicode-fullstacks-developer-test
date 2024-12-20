import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/directus'
import { useAuth } from '../contexts/AuthContext'

interface Organization {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface UserOrganization {
  id: string
  user_id: string
  organization_id: Organization
  role: string
  created_at: string
  updated_at: string
}

export function useUserOrganizations() {
  const { isAuthenticated, token, user } = useAuth()

  return useQuery({
    queryKey: ['userOrganizations', user?.data.id],
    queryFn: async () => {
      const { data } = await api.get<{ data: UserOrganization[] }>('/items/user_organizations', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          fields: [
            'id',
            'user_id',
            'organization_id.id',
            'organization_id.name',
            'organization_id.description',
          ],
        
        }
      })
      return data.data
    },
    enabled: !!token && isAuthenticated && !!user?.data?.id,
  })
}
