export type AchievementId = 'first-adventure' | 'memory-master' | 'verb-explorer' | 'story-creator' | 'perfect-score' | 'egyptian-legend'

export interface AchievementDefinition {
  id: AchievementId
  title: string
  description: string
  symbol: string
}

export interface AchievementRecord {
  id: string
  studentId: string
  achievementId: AchievementId
  unlockedAt: string
}
