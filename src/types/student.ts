import type { GameType } from './game'

export type StudentAvatarId = 'explorer' | 'cat' | 'scarab' | 'falcon' | 'ankh' | 'pyramid'

export interface StudentProfile {
  id: string
  name: string
  avatarId: StudentAvatarId
  level: number
  totalStars: number
  starsByTopic: Record<string, number>
  completedGameTypes: GameType[]
  completedTopicIds: string[]
  bestScores: Record<string, number>
  bestTimes: Record<string, number>
  accuracyByTopic: Record<string, number>
  attemptsByTopic: Record<string, number>
  unlockedAchievementIds: string[]
  lastPlayedAt?: string
}
