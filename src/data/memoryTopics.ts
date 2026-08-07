import type { MemoryTopicData } from '../games/memory/memoryTypes'

export const memoryTopics: MemoryTopicData[] = [
  {
    id: 'past-simple-basics',
    title: 'Past Simple Basics',
    description: 'Match the irregular verbs.',
    pairs: [
      { id: 'go', base: 'go', past: 'went' },
      { id: 'see', base: 'see', past: 'saw' },
      { id: 'take', base: 'take', past: 'took' },
      { id: 'find', base: 'find', past: 'found' },
      { id: 'eat', base: 'eat', past: 'ate' },
      { id: 'buy', base: 'buy', past: 'bought' },
    ],
  },
]
