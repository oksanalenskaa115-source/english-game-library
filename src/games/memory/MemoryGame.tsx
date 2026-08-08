import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HowToPlayModal } from '../../components/modals/HowToPlayModal'
import { howToPlayInstructions } from '../../data/howToPlay'
import { MemoryCard } from './MemoryCard'
import {
  calculateAccuracy,
  calculateMatchPoints,
  calculateTimeBonus,
  cardsArePair,
  createMemoryDeck,
  formatGameTime,
} from './memoryLogic'
import type { MemoryTopicData } from './memoryTypes'
import styles from './MemoryGame.module.css'
import { useSound } from '../../hooks/useSound'
import { useStudent } from '../../hooks/useStudent'
import { VictoryScreen } from '../../components/victory/VictoryScreen'
import { calculateStars } from '../../services/progress/progressService'
import { useGameMusic } from '../../hooks/useGameMusic'
import { publicAsset } from '../../utils/publicAsset'

interface MemoryGameProps {
  topic: MemoryTopicData
  saveProgress?: boolean
}

export function MemoryGame({ topic, saveProgress = true }: MemoryGameProps) {
  useGameMusic(publicAsset('sounds/first game.mp3'))
  const navigate = useNavigate()
  const { recordGameResult, recentAchievements, clearRecentAchievements } = useStudent()
  const { settings: soundSettings, play, toggleMaster } = useSound()
  const pendingTimeouts = useRef<number[]>([])
  const resultSaved = useRef(false)
  const [cards, setCards] = useState(() => createMemoryDeck(topic.pairs))
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [streak, setStreak] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timeBonus, setTimeBonus] = useState(0)
  const [feedback, setFeedback] = useState('Choose two cards.')

  const remainingPairs = topic.pairs.length - matchedPairs
  const accuracy = calculateAccuracy(matchedPairs, moves)

  const clearPendingTimeouts = useCallback(() => {
    pendingTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    pendingTimeouts.current = []
  }, [])

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      pendingTimeouts.current = pendingTimeouts.current.filter((storedId) => storedId !== timeoutId)
      callback()
    }, delay)
    pendingTimeouts.current.push(timeoutId)
  }, [])

  useEffect(() => clearPendingTimeouts, [clearPendingTimeouts])

  useEffect(() => {
    if (isPaused || isFinished) return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentTime) => currentTime + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isFinished, isPaused])

  useLayoutEffect(() => {
    if (!isFinished || resultSaved.current || !saveProgress) return
    resultSaved.current = true
    recordGameResult({ topicId: topic.id, topicTitle: topic.title, gameType: 'memory', score, accuracy, elapsedSeconds })
  }, [accuracy, elapsedSeconds, isFinished, recordGameResult, saveProgress, score, topic.id, topic.title])

  const restartGame = useCallback(() => {
    clearPendingTimeouts()
    setCards(createMemoryDeck(topic.pairs))
    setSelectedCardIds([])
    setIsChecking(false)
    setIsPaused(false)
    setIsFinished(false)
    setScore(0)
    setMoves(0)
    setMatchedPairs(0)
    setStreak(0)
    setElapsedSeconds(0)
    setTimeBonus(0)
    setFeedback('Choose two cards.')
    resultSaved.current = false
    clearRecentAchievements()
  }, [clearPendingTimeouts, topic.pairs])

  const requestRestart = () => {
    if (moves === 0 || isFinished || window.confirm('Restart this game? Your current attempt will be lost.')) {
      restartGame()
    }
  }

  const goHome = () => {
    if (!isFinished && moves > 0 && !window.confirm('Leave this game? Your current attempt will be lost.')) return
    navigate('/')
  }

  const selectCard = (cardId: string) => {
    if (isPaused || isChecking || isFinished) return

    const selectedCard = cards.find((card) => card.id === cardId)
    if (!selectedCard || selectedCard.isMatched || selectedCardIds.includes(cardId)) return
    play('cardFlip')

    if (selectedCardIds.length === 0) {
      setSelectedCardIds([cardId])
      setFeedback('Choose one more card.')
      return
    }

    const firstCard = cards.find((card) => card.id === selectedCardIds[0])
    if (!firstCard) return

    setSelectedCardIds([firstCard.id, cardId])
    setIsChecking(true)
    setMoves((currentMoves) => currentMoves + 1)

    if (cardsArePair(firstCard, selectedCard)) {
      const nextStreak = streak + 1
      const { comboBonus, totalPoints } = calculateMatchPoints(nextStreak)
      const nextMatchedPairs = matchedPairs + 1

      setCards((currentCards) => currentCards.map((card) =>
        card.pairId === selectedCard.pairId ? { ...card, isMatched: true } : card,
      ))
      setScore((currentScore) => currentScore + totalPoints)
      setStreak(nextStreak)
      setMatchedPairs(nextMatchedPairs)
      setFeedback(comboBonus ? 'Great streak! +20 points and +10 bonus.' : 'Correct pair! +20 points.')
      play(comboBonus ? 'star' : 'correct')

      schedule(() => {
        setSelectedCardIds([])
        setIsChecking(false)

        if (nextMatchedPairs === topic.pairs.length) {
          const earnedTimeBonus = calculateTimeBonus(elapsedSeconds)
          setTimeBonus(earnedTimeBonus)
          setScore((currentScore) => currentScore + earnedTimeBonus)
          setIsFinished(true)
          play('levelComplete')
          setFeedback(`All pairs found! Time bonus: ${earnedTimeBonus} points.`)
        }
      }, 500)
    } else {
      setStreak(0)
      setFeedback('Not a pair. Look carefully and try again.')
      play('wrong')
      schedule(() => {
        setSelectedCardIds([])
        setIsChecking(false)
        setFeedback('Choose two cards.')
      }, 1000)
    }
  }

  const stats = useMemo(() => [
    { label: 'Score', value: score.toString() },
    { label: 'Time', value: formatGameTime(elapsedSeconds) },
    { label: 'Moves', value: moves.toString() },
    { label: 'Pairs left', value: remainingPairs.toString() },
  ], [elapsedSeconds, moves, remainingPairs, score])

  if (isFinished) return <VictoryScreen gameTitle="Mummy Memory" score={score} accuracy={accuracy} elapsedSeconds={elapsedSeconds} stars={calculateStars(accuracy)} newAchievements={recentAchievements} onPlayAgain={restartGame} onChooseAnotherGame={() => navigate('/#game-library')} onHome={() => navigate('/')} />

  return (
    <main className={styles.page}>
      <header className={styles.gameHeader}>
        <button className={styles.homeButton} type="button" onClick={goHome}>⌂ <span>Home</span></button>
        <div className={styles.titleBlock}>
          <p>Mummy Memory</p>
          <h1>{topic.title}</h1>
          <span>{topic.description}</span>
        </div>
        <div className={styles.controls} aria-label="Game controls">
          <button type="button" onClick={() => setIsPaused((currentValue) => !currentValue)} disabled={isFinished}>
            {isPaused ? '▶ Resume' : 'Ⅱ Pause'}
          </button>
          <button type="button" onClick={requestRestart}>↻ Restart</button>
          <button type="button" onClick={() => setIsHowToPlayOpen(true)}>?</button>
          <button type="button" onClick={toggleMaster} aria-pressed={!soundSettings.masterMuted}>
            {soundSettings.masterMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      <section className={styles.stats} aria-label="Game statistics">
        {stats.map((stat) => (
          <div key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section className={styles.boardArea} aria-label="Memory card board">
        <div className={styles.board} aria-busy={isChecking}>
          {cards.map((card) => {
            const isFaceUp = card.isMatched || selectedCardIds.includes(card.id)
            return (
              <MemoryCard
                key={card.id}
                card={card}
                isFaceUp={isFaceUp}
                isDisabled={isPaused || isChecking || isFinished || isFaceUp}
                onSelect={() => selectCard(card.id)}
              />
            )
          })}
        </div>

        {isPaused && (
          <div className={styles.pauseOverlay} role="status">
            <span aria-hidden="true">Ⅱ</span>
            <h2>Game Paused</h2>
            <p>Your cards are hidden. The timer is stopped.</p>
            <button type="button" onClick={() => setIsPaused(false)}>Resume Game</button>
          </div>
        )}
      </section>

      <p className={styles.feedback} aria-live="polite">{feedback}</p>

      {isHowToPlayOpen && (
        <HowToPlayModal
          instructions={howToPlayInstructions.memory}
          onClose={() => setIsHowToPlayOpen(false)}
          onStart={() => setIsHowToPlayOpen(false)}
        />
      )}
    </main>
  )
}
