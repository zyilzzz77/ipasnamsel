'use client'

export function getBrowserCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const parts = document.cookie.split(';').map((part) => part.trim())
  const match = parts.find((part) => part.startsWith(`${name}=`))
  if (!match) {
    return null
  }

  return match.slice(name.length + 1)
}

export function setBrowserCookie(name: string, value: string, maxAgeSeconds = 60 * 60 * 24 * 30): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`
}

export function deleteBrowserCookie(name: string): void {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}
