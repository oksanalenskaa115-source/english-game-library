import type { GameType } from '../types'

export interface HowToPlayInstructions {
  gameType: GameType
  title: string
  subtitle: string
  illustration: string
  illustrationAlt: string
  illustrationPosition: string
  steps: string[]
  points: string
  reward: string
}

export const howToPlayInstructions: Record<GameType, HowToPlayInstructions> = {
  memory: {
    gameType: 'memory',
    title: 'Mummy Memory',
    subtitle: 'Find the matching verb cards!',
    illustration: publicAsset('images/optimized/memory-cover-new.webp'),
    illustrationAlt: 'Mummy Memory cards with matching Past Simple verbs',
    illustrationPosition: 'center 58%',
    steps: [
      'Turn over two cards.',
      'Match the base verb with its Past Simple form.',
      'A correct pair stays open.',
      'Find all pairs and finish as fast as you can.',
    ],
    points: 'Get 20 points for each pair. Match three pairs in a row for 10 bonus points. Finish faster for a time bonus.',
    reward: 'Earn up to 3 stars and unlock MEMORY MASTER.',
  },
  quest: {
    gameType: 'quest',
    title: 'Verb Treasure Quest',
    subtitle: 'Choose the correct verb and reach the treasure!',
    illustration: publicAsset('images/optimized/quest-cover-new.webp'),
    illustrationAlt: 'A glowing treasure chest in Verb Treasure Quest',
    illustrationPosition: 'center 74%',
    steps: [
      'Read the sentence.',
      'Choose A, B, or C.',
      'Use the hint if your first answer is wrong.',
      'Remember: use the base verb after did and didn’t.',
      'Answer all questions to open the chest.',
    ],
    points: 'Get 20 points on your first try or 10 on your second try. Finish faster for a time bonus.',
    reward: 'Earn up to 3 stars and unlock VERB EXPLORER.',
  },
  storyboard: {
    gameType: 'storyboard',
    title: 'Adventure Storyboard',
    subtitle: 'Put the pictures in order and make a story!',
    illustration: publicAsset('images/optimized/storyboard-cover-new.webp'),
    illustrationAlt: 'An Egyptian princess holding story cards beside an adventure route',
    illustrationPosition: '79% 72%',
    steps: [
      'Drag the pictures onto the timeline.',
      'Check the order. Use a hint if you need help.',
      'Choose or write a Past Simple sentence for each picture.',
      'Read your complete story.',
    ],
    points: 'Get points for correct positions and sentences. A hint costs 5 points. Challenge Mode gives more points.',
    reward: 'Earn up to 3 stars and unlock STORY CREATOR.',
  },
}
import { publicAsset } from '../utils/publicAsset'
