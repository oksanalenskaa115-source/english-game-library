import type { CSSProperties } from 'react'
import type { MemoryCardData } from './memoryTypes'
import { publicAsset } from '../../utils/publicAsset'
import styles from './MemoryCard.module.css'

interface MemoryCardProps {
  card: MemoryCardData
  isFaceUp: boolean
  isDisabled: boolean
  onSelect: () => void
}

export function MemoryCard({ card, isFaceUp, isDisabled, onSelect }: MemoryCardProps) {
  const formLabel = card.form === 'base' ? 'Base verb' : 'Past Simple'

  return (
    <button
      className={`${styles.card} ${isFaceUp ? styles.faceUp : ''} ${card.isMatched ? styles.matched : ''}`}
      type="button"
      onClick={onSelect}
      disabled={isDisabled}
      aria-label={isFaceUp ? `${formLabel}: ${card.value}` : 'Closed memory card'}
      aria-pressed={isFaceUp}
    >
      <span className={styles.inner}>
        <span className={styles.back} aria-hidden="true">
          <span
            className={styles.backArtwork}
            style={{ '--memory-card-image': `url(${publicAsset('images/optimized/back-card.webp')})` } as CSSProperties}
          />
        </span>
        <span className={styles.front}>
          <span className={styles.formLabel}>{formLabel}</span>
          <strong>{card.value}</strong>
          {card.isMatched && <span className={styles.matchLabel}>✓ Match!</span>}
        </span>
      </span>
    </button>
  )
}
