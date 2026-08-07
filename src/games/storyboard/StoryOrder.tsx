import { useMemo, useRef, useState, type DragEvent, type PointerEvent } from 'react'
import { StoryPicture } from './StoryPicture'
import { shuffleStoryCards } from './storyboardLogic'
import type { StoryCardData } from './storyboardTypes'
import styles from './StoryOrder.module.css'
import { useSound } from '../../hooks/useSound'

type PositionStatus = 'correct' | 'wrong' | undefined

interface StoryOrderProps {
  cards: StoryCardData[]
  hintsRemaining: number
  onUseHint: () => void
  onAddScore: (points: number) => void
  onProgress: (placed: number) => void
  onComplete: (firstCheckCorrect: number) => void
}

export function StoryOrder({ cards, hintsRemaining, onUseHint, onAddScore, onProgress, onComplete }: StoryOrderProps) {
  const { play } = useSound()
  const [bank, setBank] = useState(() => shuffleStoryCards(cards))
  const [timeline, setTimeline] = useState<(StoryCardData | null)[]>(() => cards.map(() => null))
  const [statuses, setStatuses] = useState<PositionStatus[]>(() => cards.map(() => undefined))
  const [awardedIds, setAwardedIds] = useState<Set<string>>(() => new Set())
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [message, setMessage] = useState('Move every picture to a numbered position.')
  const [isComplete, setIsComplete] = useState(false)
  const firstFullCheck = useRef<number | null>(null)

  const allCards = useMemo(() => [...bank, ...timeline.filter((card): card is StoryCardData => card !== null)], [bank, timeline])

  const placeCard = (cardId: string, targetIndex: number) => {
    if (isComplete || targetIndex < 0 || targetIndex >= timeline.length) return
    const card = allCards.find((item) => item.id === cardId)
    if (!card) return

    const sourceIndex = timeline.findIndex((item) => item?.id === cardId)
    const occupant = timeline[targetIndex]
    const nextTimeline = [...timeline]
    const nextBank = bank.filter((item) => item.id !== cardId)

    if (sourceIndex >= 0) nextTimeline[sourceIndex] = occupant
    else if (occupant) nextBank.push(occupant)
    nextTimeline[targetIndex] = card

    setTimeline(nextTimeline)
    setBank(nextBank)
    onProgress(nextTimeline.filter(Boolean).length)
    setStatuses(cards.map(() => undefined))
    setMessage('Good. Continue arranging the story.')
  }

  const handleDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('text/plain') || draggedId
    if (cardId) placeCard(cardId, targetIndex)
    setDraggedId(null)
  }

  const handlePointerDown = (event: PointerEvent<HTMLElement>, cardId: string) => {
    if (event.pointerType === 'mouse' || (event.target as Element).closest('select')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDraggedId(cardId)
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>, cardId: string) => {
    if (event.pointerType === 'mouse' || (event.target as Element).closest('select')) return
    const element = document.elementFromPoint(event.clientX, event.clientY)
    const slot = element?.closest<HTMLElement>('[data-story-position]')
    if (slot) placeCard(cardId, Number(slot.dataset.storyPosition))
    setDraggedId(null)
  }

  const checkOrder = () => {
    const nextStatuses = timeline.map((card, index) => card ? (card.order === index + 1 ? 'correct' : 'wrong') : undefined)
    const correctCards = timeline.filter((card, index) => card?.order === index + 1)

    if (timeline.every(Boolean) && firstFullCheck.current === null) firstFullCheck.current = correctCards.length

    const newCorrectCards = correctCards.filter((card) => !awardedIds.has(card!.id))
    if (newCorrectCards.length > 0) {
      onAddScore(newCorrectCards.length * 10)
      play('correct')
      setAwardedIds((current) => new Set([...current, ...newCorrectCards.map((card) => card!.id)]))
    }
    if (nextStatuses.some((status) => status === 'wrong')) play('wrong')

    setStatuses(nextStatuses)
    if (correctCards.length === cards.length) {
      setIsComplete(true)
      setMessage('Excellent! The whole story is in the correct order.')
      return
    }
    setMessage(`${correctCards.length} of ${cards.length} pictures are in the correct position.`)
  }

  const useHint = () => {
    if (hintsRemaining === 0 || isComplete) return
    const targetIndex = timeline.findIndex((card, index) => card?.order !== index + 1)
    if (targetIndex < 0) return
    const correctCard = allCards.find((card) => card.order === targetIndex + 1)
    if (!correctCard) return
    placeCard(correctCard.id, targetIndex)
    onUseHint()
    play('hint')
    setMessage(`Hint: picture ${correctCard.order} is now in its correct position. -5 points.`)
  }

  const renderCard = (card: StoryCardData) => (
    <article
      className={styles.card}
      key={card.id}
      draggable={!isComplete}
      onDragStart={(event) => { event.dataTransfer.setData('text/plain', card.id); setDraggedId(card.id) }}
      onPointerDown={(event) => handlePointerDown(event, card.id)}
      onPointerUp={(event) => handlePointerUp(event, card.id)}
    >
      <StoryPicture card={card} compact />
      <label>
        <span>Move to position</span>
        <select value="" onChange={(event) => placeCard(card.id, Number(event.target.value))} disabled={isComplete}>
          <option value="">Choose…</option>
          {cards.map((_, index) => <option value={index} key={index}>{index + 1}</option>)}
        </select>
      </label>
    </article>
  )

  return (
    <section className={styles.stage} aria-labelledby="story-order-title">
      <div className={styles.heading}>
        <div><span>Stage 1</span><h2 id="story-order-title">Story Order</h2></div>
        <p>Drag, tap and choose a position, or use the Move menu.</p>
      </div>

      {bank.length > 0 && <div className={styles.bank} aria-label="Pictures waiting to be placed">{bank.map(renderCard)}</div>}

      <div className={styles.timeline} aria-label="Story timeline">
        {timeline.map((card, index) => (
          <div
            className={`${styles.slot} ${statuses[index] ? styles[statuses[index]!] : ''}`}
            key={index}
            data-story-position={index}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, index)}
          >
            <span className={styles.position}>{index + 1}</span>
            {card ? renderCard(card) : <p>Drop picture here</p>}
            {statuses[index] === 'correct' && <strong className={styles.feedback}>✓ Correct position</strong>}
            {statuses[index] === 'wrong' && <strong className={styles.feedback}>↔ Try another position</strong>}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={checkOrder} disabled={timeline.some((card) => !card)}>Check Order</button>
        <button type="button" onClick={useHint} disabled={hintsRemaining === 0 || isComplete}>Hint ({hintsRemaining})</button>
        {isComplete && <button className={styles.continue} type="button" onClick={() => onComplete(firstFullCheck.current ?? cards.length)}>Make Sentences →</button>}
      </div>
      <p className={styles.message} aria-live="polite">{message}</p>
    </section>
  )
}
