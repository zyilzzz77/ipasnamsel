export const PARTICIPANT_COOKIE_PREFIX = 'ipas-quiz-participant'

export interface ParticipantSessionCookie {
  id: string
  name: string
}

export function participantCookieName(quizId: string): string {
  return `${PARTICIPANT_COOKIE_PREFIX}-${quizId}`
}

export function encodeCookieValue<T>(value: T): string {
  return encodeURIComponent(JSON.stringify(value))
}

export function decodeCookieValue<T>(value: string | undefined): T | null {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(decodeURIComponent(value)) as T
  } catch {
    return null
  }
}
