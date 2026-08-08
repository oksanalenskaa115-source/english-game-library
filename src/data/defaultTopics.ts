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
    description: 'Temple Door Challenge: shoot the correct verb.',
    coverImage: publicAsset('images/optimized/quest-interface-cover.webp'),
    coverAlt: 'Verb Treasure Quest cover with an Egyptian archer and three magical targets',
    coverPosition: 'center 50%',
    route: '/games/quest/past-simple-treasure',
    stars: 0,
    bestScore: null,
    completed: false,
  },
  {
    id: 'nile-adventure',
    gameType: 'storyboard',
    title: 'Adventure Storyboard',
    description: 'Restore Thoth’s scrolls and build Nefertiti’s story from pictures.',
    coverImage: publicAsset('images/optimized/adventure-storyboard-nefertiti-cover.webp'),
    coverAlt: 'Nefertiti holding story cards beside the Nile and an Adventure Storyboard title',
    coverPosition: 'center 50%',
    route: '/games/storyboard/nile-adventure',
    stars: 0,
    bestScore: null,
    completed: false,
  },
]
import { publicAsset } from '../utils/publicAsset'
