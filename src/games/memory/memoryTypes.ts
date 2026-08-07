export interface VerbPair {
  id: string
  base: string
  past: string
}

export interface MemoryTopicData {
  id: string
  title: string
  description: string
  pairs: VerbPair[]
}

export interface MemoryCardData {
  id: string
  pairId: string
  value: string
  form: 'base' | 'past'
  isMatched: boolean
}
