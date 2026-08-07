import { achievements } from '../../data/achievements'
import type { AchievementDefinition, AchievementRecord, StudentProfile } from '../../types'
import { getEligibleAchievementIds } from './achievementLogic'

const STORAGE_KEY = 'egl.achievements'

export function loadAchievementRecords(): AchievementRecord[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is AchievementRecord => Boolean(item && typeof item === 'object' && 'studentId' in item && 'achievementId' in item)) : []
  } catch { return [] }
}

function saveAchievementRecords(records: AchievementRecord[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)) } catch { /* The profile remains usable if storage is unavailable. */ }
}

export function unlockEligibleAchievements(profile: StudentProfile) {
  const eligibleIds = getEligibleAchievementIds(profile)
  const newIds = eligibleIds.filter((id) => !profile.unlockedAchievementIds.includes(id))
  if (newIds.length === 0) return { profile, unlocked: [] as AchievementDefinition[] }

  const now = new Date().toISOString()
  const existingRecords = loadAchievementRecords()
  const records = newIds.map((achievementId) => ({ id: crypto.randomUUID(), studentId: profile.id, achievementId, unlockedAt: now }))
  saveAchievementRecords([...existingRecords, ...records])
  return {
    profile: { ...profile, unlockedAchievementIds: [...profile.unlockedAchievementIds, ...newIds] },
    unlocked: achievements.filter((achievement) => newIds.includes(achievement.id)),
  }
}
