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
    subtitle: 'Aim, shoot, and unlock the ancient treasury!',
    illustration: publicAsset('images/optimized/quest-interface-cover.webp'),
    illustrationAlt: 'Verb Treasure Quest cover with an Egyptian archer aiming at three magical targets',
    illustrationPosition: 'center 50%',
    steps: [
      'Read the sentence.',
      'Aim at one of the three magical answer targets.',
      'Click the target to shoot. A missed target is sealed.',
      'Remember: use the base verb after did and didn’t.',
      'Every correct shot lights a symbol on the temple door.',
      'Light all ten symbols to open the treasury.',
    ],
    points: 'Get 20 points on your first try or 10 on your second try. Finish faster for a time bonus.',
    reward: 'Earn up to 3 stars and unlock TEMPLE MARKSMAN.',
  },
  storyboard: {
    gameType: 'storyboard',
    title: 'Adventure Storyboard: Thoth’s Library',
    subtitle: 'Restore the ten ancient sentence scrolls!',
    illustration: publicAsset('images/optimized/thoth-library-platformer.webp'),
    illustrationAlt: 'Thoth in a magical Egyptian library with platforms and glowing word tablets',
    illustrationPosition: 'center 50%',
    steps: [
      'Stage 1: guide the magic scarab through Thoth’s library.',
      'Move with A/D or the Left and Right arrows. Jump with W, Up, or Space.',
      'Press S or the Down Arrow to drop from a platform.',
      'Collect the word tablets in the correct sentence order. No answer hints are shown.',
      'Stage 2: put Nefertiti’s ten event pictures in the correct order.',
      'Stage 3: read Nefertiti’s complete story.',
    ],
    points: 'Get 5 points for every correct tablet and 10 bonus points for each restored scroll.',
    reward: 'Restore all ten scrolls, earn up to 3 stars, and unlock STORY CREATOR.',
  },
}
import { publicAsset } from '../utils/publicAsset'
