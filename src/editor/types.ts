import type { GameType } from '../types'

export type TopicStatus = 'draft' | 'published'
export type TopicDifficulty = 'easy' | 'medium' | 'hard'

export interface EditorMedia {
  name: string
  type: string
  dataUrl: string
}

interface EditorTopicBase {
  id: string
  schemaVersion: 1
  gameType: GameType
  title: string
  description: string
  difficulty: TopicDifficulty
  coverImage?: EditorMedia
  maxStars: 1 | 2 | 3
  status: TopicStatus
  updatedAt: string
}

export interface EditorMemoryPair {
  id: string
  base: string
  past: string
  image?: EditorMedia
  audio?: EditorMedia
}

export interface EditorMemoryTopic extends EditorTopicBase {
  gameType: 'memory'
  pairs: EditorMemoryPair[]
}

export interface EditorQuestQuestion {
  id: string
  sentence: string
  verb: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2 | null
  hint: string
  explanation: string
  image?: EditorMedia
}

export interface EditorQuestTopic extends EditorTopicBase {
  gameType: 'quest'
  questions: EditorQuestQuestion[]
}

export interface EditorStoryCard {
  id: string
  eventNumber: number
  title: string
  image?: EditorMedia
  correctSentence: string
  wrongSentences: [string, string]
  wordHelp: string
  audio?: EditorMedia
}

export interface EditorStoryboardTopic extends EditorTopicBase {
  gameType: 'storyboard'
  cards: EditorStoryCard[]
}

export type EditorTopic = EditorMemoryTopic | EditorQuestTopic | EditorStoryboardTopic

export function createEmptyTopic(gameType: GameType = 'memory'): EditorTopic {
  const common = {
    id: crypto.randomUUID(),
    schemaVersion: 1 as const,
    title: '',
    description: '',
    difficulty: 'easy' as const,
    maxStars: 3 as const,
    status: 'draft' as const,
    updatedAt: new Date().toISOString(),
  }
  if (gameType === 'quest') return { ...common, gameType, questions: [] }
  if (gameType === 'storyboard') return { ...common, gameType, cards: [] }
  return { ...common, gameType, pairs: [] }
}

export function topicContentCount(topic: EditorTopic) {
  if (topic.gameType === 'memory') return topic.pairs.length
  if (topic.gameType === 'quest') return topic.questions.length
  return topic.cards.length
}
