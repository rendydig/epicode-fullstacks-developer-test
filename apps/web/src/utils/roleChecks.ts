import {  UserData } from '../lib/directus'

export function isUserRole(user: UserData | null | undefined, roles: string[]): boolean {
  const userRole = user?.data?.role?.name?.toLowerCase()
  return !!userRole && roles.includes(userRole)
}

export function isAdmin(user: UserData | null | undefined): boolean {
  return isUserRole(user, ['admin', 'administrator'])
}

export function isStudent(user: UserData | null | undefined): boolean {
  return isUserRole(user, ['student'])
}
