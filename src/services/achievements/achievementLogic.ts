import type { AchievementId, StudentProfile } from '../../types'

export function getEligibleAchievementIds(profile: StudentProfile): AchievementId[] {
  const eligible: AchievementId[] = []
  if (profile.completedTopicIds.length > 0) eligible.push('first-adventure')
  if (profile.completedGameTypes.includes('memory')) eligible.push('memory-master')
  if (profile.completedGameTypes.includes('quest')) eligible.push('verb-explorer')
  if (profile.completedGameTypes.includes('storyboard')) eligible.push('story-creator')
  if (Object.values(profile.accuracyByTopic).some((accuracy) => accuracy === 100)) eligible.push('perfect-score')
  if (['memory', 'quest', 'storyboard'].every((gameType) => profile.completedGameTypes.includes(gameType as 'memory' | 'quest' | 'storyboard'))) eligible.push('egyptian-legend')
  return eligible
}
