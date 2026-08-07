import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'
import type { DefaultTopic } from '../../data/defaultTopics'
import styles from './GameCard.module.css'

interface GameCardProps {
  number: number
  topic: DefaultTopic
  onPlay: () => void
  onHowToPlay: () => void
}

export function GameCard({ number, topic, onPlay, onHowToPlay }: GameCardProps) {
  const stars = Array.from({ length: 3 }, (_, index) => index < topic.stars)

  return (
    <article className={styles.card} data-game={topic.gameType}>
      <span className={styles.number} aria-label={`Game ${number}`}><span>{number}</span></span>

      <div className={styles.cover}>
        <img
          className={styles.coverBackdrop}
          src={topic.coverImage}
          alt=""
          aria-hidden="true"
          style={{ objectPosition: topic.coverPosition }}
        />
        <img
          className={styles.coverImage}
          src={topic.coverImage}
          alt={topic.coverAlt}
          style={{ objectPosition: topic.coverPosition }}
        />
        {topic.completed && <span className={styles.completed}>✓ Completed</span>}
      </div>

      <div className={styles.content}>
        <div>
          <h3>{topic.title}</h3>
          <p className={styles.description}>{topic.description}</p>
        </div>

        <dl className={styles.results}>
          <div>
            <dt>Stars</dt>
            <dd className={styles.stars} aria-label={`${topic.stars} of 3 stars`}>
              {stars.map((isEarned, index) => (
                <span key={index} className={isEarned ? styles.starEarned : styles.starEmpty} aria-hidden="true">★</span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd>{topic.bestScore === null ? '—' : `${topic.bestScore} pts`}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <PrimaryButton fullWidth onClick={onPlay}>Play Now</PrimaryButton>
          <SecondaryButton fullWidth onClick={onHowToPlay}>
            How to Play
          </SecondaryButton>
        </div>
      </div>
    </article>
  )
}
