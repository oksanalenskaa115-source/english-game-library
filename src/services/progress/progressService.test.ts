import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { GameResult, StudentProfile } from '../../types'
import {
  applyResultToProfile,
  calculateLevel,
  calculateStars,
  createAndSaveResult,
  loadGameResults,
} from './progressService'

function createStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() { return values.size },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key) },
    setItem: (key, value) => { values.set(key, value) },
  }
}

function emptyProfile(): StudentProfile {
  return {
    id: 'student-1',
    name: 'Alex',
    avatarId: 'explorer',
    level: 1,
    totalStars: 0,
    starsByTopic: {},
    completedGameTypes: [],
    completedTopicIds: [],
    bestScores: {},
    bestTimes: {},
    accuracyByTopic: {},
    attemptsByTopic: {},
    unlockedAchievementIds: [],
  }
}

function result(overrides: Partial<GameResult> = {}): GameResult {
  return {
    id: 'result-1',
    studentId: 'student-1',
    topicId: 'past-simple',
    topicTitle: 'Past Simple',
    gameType: 'memory',
    score: 100,
    accuracy: 80,
    elapsedSeconds: 90,
    stars: 2,
    attempt: 1,
    completedAt: '2026-08-07T00:00:00.000Z',
    ...overrides,
  }
}

describe('progressService', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage())
  })

  it('uses the specified star and level thresholds', () => {
    expect([calculateStars(69), calculateStars(70), calculateStars(90)]).toEqual([1, 2, 3])
    expect([calculateLevel(9), calculateLevel(10), calculateLevel(20)]).toEqual([1, 2, 3])
  })

  it('keeps best values while counting every attempt', () => {
    const firstProfile = applyResultToProfile(emptyProfile(), result())
    const improvedProfile = applyResultToProfile(firstProfile, result({ score: 130, accuracy: 95, elapsedSeconds: 70, stars: 3, attempt: 2 }))

    expect(improvedProfile.totalStars).toBe(3)
    expect(improvedProfile.bestScores['memory:past-simple']).toBe(130)
    expect(improvedProfile.bestTimes['memory:past-simple']).toBe(70)
    expect(improvedProfile.accuracyByTopic['memory:past-simple']).toBe(95)
    expect(improvedProfile.attemptsByTopic['memory:past-simple']).toBe(2)
    expect(improvedProfile.completedTopicIds).toEqual(['past-simple'])
  })

  it('stores separate attempts for different students', () => {
    const input = {
      topicId: 'past-simple',
      topicTitle: 'Past Simple',
      gameType: 'quest' as const,
      score: 120,
      accuracy: 90,
      elapsedSeconds: 80,
    }

    expect(createAndSaveResult('student-1', input).attempt).toBe(1)
    expect(createAndSaveResult('student-1', input).attempt).toBe(2)
    expect(createAndSaveResult('student-2', input).attempt).toBe(1)
    expect(loadGameResults()).toHaveLength(3)
  })

  it('recovers safely from corrupted saved data', () => {
    localStorage.setItem('egl.gameResults', '{not-json')
    expect(loadGameResults()).toEqual([])
  })
})
