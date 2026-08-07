import type { StoryCardData } from './storyboardTypes'
import styles from './StoryPicture.module.css'
import { publicAsset } from '../../utils/publicAsset'

interface StoryPictureProps {
  card: StoryCardData
  compact?: boolean
}

export function StoryPicture({ card, compact = false }: StoryPictureProps) {
  const imageUrl = card.imageUrl ?? publicAsset('images/optimized/storyboard-cards.webp')

  return (
    <div
      className={`${styles.picture} ${compact ? styles.compact : ''}`}
      style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: card.imageUrl ? 'center' : card.imagePosition, backgroundSize: card.imageUrl ? 'contain' : undefined }}
      role="img"
      aria-label={`Story card ${card.order}: ${card.title}`}
    />
  )
}
