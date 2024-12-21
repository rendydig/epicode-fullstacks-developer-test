import { User } from '../lib/directus'

export function isUserRole(user: User | null | undefined, roles: string[]): boolean {
  const userRole = user?.data?.role?.name?.toLowerCase()
  return !!userRole && roles.includes(userRole)
}

export function isAdmin(user: User | null | undefined): boolean {
  return isUserRole(user, ['admin', 'administrator'])
}

export function isStudent(user: User | null | undefined): boolean {
  return isUserRole(user, ['student'])
}
