import { useMemo, useRef } from 'react'
import { buildCompleteStory } from './storyboardLogic'
import { StoryPicture } from './StoryPicture'
import type { StoryCardData } from './storyboardTypes'
import styles from './CompleteStory.module.css'

interface CompleteStoryProps {
  cards: StoryCardData[]
  score: number
  accuracy: number
  stars: number
  onRestart: () => void
  onHome: () => void
  onFinish: () => void
}

export function CompleteStory({ cards, score, accuracy, stars, onRestart, onHome, onFinish }: CompleteStoryProps) {
  const storyRef = useRef<HTMLDivElement>(null)
  const completeStory = useMemo(() => buildCompleteStory(cards), [cards])
  const links = ['First', 'Then', 'Next', 'After that', 'Later', 'Then', 'Next', 'After that', 'Later', 'Finally']

  return (
    <section className={styles.stage} aria-labelledby="complete-story-title">
      <div className={styles.heading}>
        <div><span>Stage 3</span><h2 id="complete-story-title">Complete Story</h2></div>
        <div className={styles.result}><strong>{score}</strong> points · <strong>{accuracy}%</strong> accuracy · <span aria-label={`${stars} stars`}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span></div>
      </div>

      <div className={styles.storyGrid}>
        {cards.map((card, index) => (
          <article key={card.id}>
            <StoryPicture card={card} compact />
            <p><strong>{links[index]},</strong> {card.correctSentence.replace(/^She\s/, 'she ')}</p>
          </article>
        ))}
      </div>

      <div className={styles.fullStory} ref={storyRef} tabIndex={-1}>
        <h3>A Princess's Day in Egypt</h3>
        <p>{completeStory}</p>
      </div>

      <div className={styles.storyAction}>
        <button type="button" onClick={() => {
          storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          storyRef.current?.focus({ preventScroll: true })
        }}>Read Story</button>
      </div>

      <div className={styles.endActions}>
        <button type="button" onClick={onFinish}>Finish Adventure</button>
        <button type="button" onClick={onRestart}>Play Again</button>
        <button type="button" onClick={onHome}>Home</button>
      </div>
    </section>
  )
}
