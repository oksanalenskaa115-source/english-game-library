import { useMemo, useState } from 'react'
import { StoryPicture } from './StoryPicture'
import { isAcceptedSentence } from './storyboardLogic'
import type { SentenceMode, StoryCardData } from './storyboardTypes'
import styles from './SentenceStage.module.css'
import { useSound } from '../../hooks/useSound'

interface SentenceStageProps {
  cards: StoryCardData[]
  mode: SentenceMode
  onAddScore: (points: number) => void
  onProgress: (completed: number) => void
  onComplete: (successfulSentences: number) => void
}

export function SentenceStage({ cards, mode, onAddScore, onProgress, onComplete }: SentenceStageProps) {
  const { play } = useSound()
  const [cardIndex, setCardIndex] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [selectedSentence, setSelectedSentence] = useState<string | null>(null)
  const [typedSentence, setTypedSentence] = useState('')
  const [isResolved, setIsResolved] = useState(false)
  const [wasRevealed, setWasRevealed] = useState(false)
  const [successfulSentences, setSuccessfulSentences] = useState(0)
  const [message, setMessage] = useState(mode === 'support' ? 'Choose the correct Past Simple sentence.' : 'Write a Past Simple sentence.')

  const card = cards[cardIndex]
  const options = useMemo(() => {
    const allOptions = [card.wrongSentences[0], card.correctSentence, card.wrongSentences[1]]
    const shift = cardIndex % allOptions.length
    return [...allOptions.slice(shift), ...allOptions.slice(0, shift)]
  }, [card, cardIndex])

  const resolveCorrect = (currentAttempts: number) => {
    const points = mode === 'support'
      ? (currentAttempts === 0 ? 10 : 5)
      : (currentAttempts === 0 ? 15 : 8)
    onAddScore(points)
    setSuccessfulSentences((current) => current + 1)
    setIsResolved(true)
    setMessage(`Correct! ${card.correctSentence} +${points} points.`)
    play('correct')
  }

  const resolveWrong = () => {
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    play('wrong')
    if (nextAttempts >= 2) {
      setIsResolved(true)
      setWasRevealed(true)
      setMessage(`The answer is: ${card.correctSentence} No points this time.`)
    } else {
      setMessage(`Try again. Base verb help: ${card.wordHelp}`)
    }
  }

  const chooseSentence = (sentence: string) => {
    if (isResolved || selectedSentence === sentence) return
    setSelectedSentence(sentence)
    if (sentence === card.correctSentence) resolveCorrect(attempts)
    else resolveWrong()
  }

  const checkTypedSentence = () => {
    if (isResolved || !typedSentence.trim()) return
    if (isAcceptedSentence(typedSentence, card.acceptedSentences)) resolveCorrect(attempts)
    else resolveWrong()
  }

  const nextCard = () => {
    const completed = cardIndex + 1
    onProgress(completed)
    if (completed === cards.length) {
      onComplete(successfulSentences)
      return
    }
    setCardIndex(completed)
    setAttempts(0)
    setSelectedSentence(null)
    setTypedSentence('')
    setIsResolved(false)
    setWasRevealed(false)
    setMessage(mode === 'support' ? 'Choose the correct Past Simple sentence.' : 'Write a Past Simple sentence.')
  }

  return (
    <section className={styles.stage} aria-labelledby="sentence-stage-title">
      <div className={styles.heading}>
        <div><span>Stage 2</span><h2 id="sentence-stage-title">Make Sentences</h2></div>
        <strong>{mode === 'support' ? 'Support Mode' : 'Challenge Mode'} · Picture {cardIndex + 1} of {cards.length}</strong>
      </div>

      <div className={styles.workspace}>
        <div className={styles.picturePanel}>
          <StoryPicture card={card} />
          <p>{card.title}</p>
        </div>

        <div className={styles.answerPanel}>
          {mode === 'support' ? (
            <div className={styles.options}>
              <p>Which sentence is correct?</p>
              {options.map((sentence, index) => {
                const isSelected = selectedSentence === sentence
                const isCorrect = isResolved && sentence === card.correctSentence
                const isWrong = isSelected && sentence !== card.correctSentence
                return (
                  <button
                    className={`${isCorrect ? styles.correct : ''} ${isWrong ? styles.wrong : ''}`}
                    type="button"
                    onClick={() => chooseSentence(sentence)}
                    disabled={isResolved || (isSelected && isWrong)}
                    key={sentence}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>{sentence}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className={styles.challenge}>
              <label htmlFor="story-sentence">Write one sentence in Past Simple.</label>
              <p>Change the base verb to Past Simple yourself.</p>
              <p>Base verb help: <strong>{card.wordHelp}</strong></p>
              <textarea
                id="story-sentence"
                value={typedSentence}
                onChange={(event) => setTypedSentence(event.target.value)}
                disabled={isResolved}
                rows={4}
                placeholder="She…"
              />
              <button type="button" onClick={checkTypedSentence} disabled={isResolved || !typedSentence.trim()}>Check Sentence</button>
            </div>
          )}

          <div className={`${styles.message} ${attempts > 0 ? styles.hint : ''}`} aria-live="polite">{message}</div>
          {isResolved && <button className={styles.next} type="button" onClick={nextCard}>{cardIndex === cards.length - 1 ? 'Complete Story' : 'Next Picture'} →</button>}
        </div>
      </div>
    </section>
  )
}
