import type { GameType } from './game'

export interface GameResultInput {
  topicId: string
  topicTitle: string
  gameType: GameType
  score: number
  accuracy: number
  elapsedSeconds: number
}

export interface GameResult extends GameResultInput {
  id: string
  studentId: string
  stars: 1 | 2 | 3
  attempt: number
  completedAt: string
}
