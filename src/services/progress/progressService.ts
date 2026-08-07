import type { GameResult, GameResultInput, StudentProfile } from '../../types'

const RESULTS_KEY = 'egl.gameResults'

export function calculateStars(accuracy: number): 1 | 2 | 3 {
  if (accuracy >= 90) return 3
  if (accuracy >= 70) return 2
  return 1
}

export function calculateLevel(totalStars: number) {
  return Math.floor(totalStars / 10) + 1
}

export function loadGameResults(): GameResult[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is GameResult => Boolean(item && typeof item === 'object' && 'studentId' in item && 'topicId' in item)) : []
  } catch { return [] }
}

function saveGameResults(results: GameResult[]) {
  try { localStorage.setItem(RESULTS_KEY, JSON.stringify(results)) } catch { /* Storage may be unavailable in private mode. */ }
}

export function createAndSaveResult(studentId: string, input: GameResultInput) {
  const results = loadGameResults()
  const attempt = results.filter((result) => result.studentId === studentId && result.topicId === input.topicId && result.gameType === input.gameType).length + 1
  const result: GameResult = { ...input, id: crypto.randomUUID(), studentId, stars: calculateStars(input.accuracy), attempt, completedAt: new Date().toISOString() }
  saveGameResults([...results, result])
  return result
}

export function applyResultToProfile(profile: StudentProfile, result: GameResult): StudentProfile {
  const key = `${result.gameType}:${result.topicId}`
  const starsByTopic = { ...(profile.starsByTopic ?? {}), [key]: Math.max(profile.starsByTopic?.[key] ?? 0, result.stars) }
  const totalStars = Object.values(starsByTopic).reduce((sum, stars) => sum + stars, 0)
  const previousTime = profile.bestTimes[key]
  return {
    ...profile,
    level: calculateLevel(totalStars),
    totalStars,
    starsByTopic,
    completedGameTypes: profile.completedGameTypes.includes(result.gameType) ? profile.completedGameTypes : [...profile.completedGameTypes, result.gameType],
    completedTopicIds: profile.completedTopicIds.includes(result.topicId) ? profile.completedTopicIds : [...profile.completedTopicIds, result.topicId],
    bestScores: { ...profile.bestScores, [key]: Math.max(profile.bestScores[key] ?? 0, result.score) },
    bestTimes: { ...profile.bestTimes, [key]: previousTime === undefined ? result.elapsedSeconds : Math.min(previousTime, result.elapsedSeconds) },
    accuracyByTopic: { ...profile.accuracyByTopic, [key]: Math.max(profile.accuracyByTopic[key] ?? 0, result.accuracy) },
    attemptsByTopic: { ...profile.attemptsByTopic, [key]: (profile.attemptsByTopic[key] ?? 0) + 1 },
    lastPlayedAt: result.completedAt,
  }
}
