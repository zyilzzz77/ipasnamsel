export interface QuizRankParticipant {
  id: string
  name: string
  joinedAt: string
  score: number
  answeredCount: number
  lastAnsweredAt?: string
  finishedAt?: string
}

export function sortLeaderboard<T extends QuizRankParticipant>(participants: T[]): T[] {
  return [...participants].sort((left, right) => {
    const scoreDiff = (right.score ?? 0) - (left.score ?? 0)
    if (scoreDiff !== 0) {
      return scoreDiff
    }

    const answeredDiff = (right.answeredCount ?? 0) - (left.answeredCount ?? 0)
    if (answeredDiff !== 0) {
      return answeredDiff
    }

    const leftStamp = left.finishedAt ?? left.lastAnsweredAt ?? left.joinedAt
    const rightStamp = right.finishedAt ?? right.lastAnsweredAt ?? right.joinedAt
    return leftStamp.localeCompare(rightStamp)
  })
}

export function getParticipantRank<T extends QuizRankParticipant>(participants: T[], participantId: string | null | undefined): number | null {
  if (!participantId) {
    return null
  }

  const index = sortLeaderboard(participants).findIndex((participant) => participant.id === participantId)
  return index >= 0 ? index + 1 : null
}

export function formatRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
