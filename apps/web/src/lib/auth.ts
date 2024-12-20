export interface AuthData {
  auth: {
    access_token: string
    expires_at: string  // ISO date string
  }
  user: any
}

export function isTokenExpired(authData: AuthData | null): boolean {
  if (!authData?.auth?.expires_at) return true
  
  const expiresAt = new Date(authData.auth.expires_at).getTime()
  
  // Add a 5-second buffer to account for network latency
  return Date.now() >= (expiresAt - 5000)
}

export function clearAuthData() {
  localStorage.removeItem('authData')
}
