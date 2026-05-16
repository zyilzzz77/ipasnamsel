const DEFAULT_SITE_URL = 'https://ipasnamsel.my.id'

function normalizeSiteUrl(value: string | undefined): string {
  const raw = value?.trim()

  if (!raw) {
    return DEFAULT_SITE_URL
  }

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`

  try {
    return new URL(candidate).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function getSiteUrl(): string {
  return normalizeSiteUrl(
    process.env.APP_BASE_URL
    ?? process.env.SITE_URL
    ?? process.env.NEXT_PUBLIC_SITE_URL,
  )
}
