import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User } from '../lib/directus'

interface AuthData {
 auth: {
  access_token: string
  expires: number
  expires_at: string
 }
 user: any
}

// Auth data atom with local storage persistence
export const authDataAtom = atomWithStorage<AuthData | null>('authData', null)

// User atom - stores the current user's data
export const userAtom = atom<User | null>(null)

// Loading state atom
export const isLoadingAtom = atom<boolean>(false)

// Error state atom
export const errorAtom = atom<string | null>(null)
