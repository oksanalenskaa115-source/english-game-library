import type { GameType } from '../types'

export interface DefaultTopic {
  id: string
  gameType: GameType
  title: string
  description: string
  coverImage: string
  coverAlt: string
  coverPosition: string
  route: string
  stars: 0 | 1 | 2 | 3
  bestScore: number | null
  completed: boolean
}

export const defaultTopics: DefaultTopic[] = [
  {
    id: 'past-simple-basics',
    gameType: 'memory',
    title: 'Mummy Memory',
    description: 'Match the irregular verbs.',
    coverImage: publicAsset('images/optimized/memory-cover-new.webp'),
    coverAlt: 'Mummy Memory cards with Past Simple verb pairs',
    coverPosition: 'center 30%',
    route: '/games/memory/past-simple-basics',
    stars: 0,
    bestScore: null,
    completed: false,
  },
  {
    id: 'past-simple-treasure',
    gameType: 'quest',
    title: 'Verb Treasure Quest',
    description: 'Choose the correct verb form.',
    coverImage: publicAsset('images/optimized/quest-cover-new.webp'),
    coverAlt: 'Verb Treasure Quest with an Egyptian treasure chest',
    coverPosition: 'center 22%',
    route: '/games/quest/past-simple-treasure',
    stars: 0,
    bestScore: null,
    completed: false,
  },
  {
    id: 'nile-adventure',
    gameType: 'storyboard',
    title: 'Adventure Storyboard',
    description: 'Make a story from pictures.',
    coverImage: publicAsset('images/optimized/storyboard-cover-new.webp'),
    coverAlt: 'Egyptian princess holding story cards beside an adventure route',
    coverPosition: '79% 72%',
    route: '/games/storyboard/nile-adventure',
    stars: 0,
    bestScore: null,
    completed: false,
  },
]
import { publicAsset } from '../utils/publicAsset'
