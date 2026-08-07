export type SentenceMode = 'support' | 'challenge'

export interface StoryCardData {
  id: string
  order: number
  title: string
  imagePosition: string
  imageUrl?: string
  correctSentence: string
  acceptedSentences: string[]
  wrongSentences: [string, string]
  wordHelp: string
}

export interface StoryboardTopicData {
  id: string
  title: string
  description: string
  cards: StoryCardData[]
}
