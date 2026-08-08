import type { AchievementDefinition } from '../types'

export const achievements: AchievementDefinition[] = [
  { id: 'first-adventure', title: 'FIRST ADVENTURE', description: 'Complete any game.', symbol: '◆' },
  { id: 'memory-master', title: 'MEMORY MASTER', description: 'Complete Mummy Memory.', symbol: '▦' },
  { id: 'verb-explorer', title: 'TEMPLE MARKSMAN', description: 'Complete Temple Door Challenge.', symbol: '♢' },
  { id: 'story-creator', title: 'STORY CREATOR', description: 'Complete Adventure Storyboard.', symbol: '✦' },
  { id: 'perfect-score', title: 'PERFECT SCORE', description: 'Complete a topic with 100% accuracy.', symbol: '★' },
  { id: 'egyptian-legend', title: 'EGYPTIAN LEGEND', description: 'Complete all three types of games.', symbol: '☥' },
]
