import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HowToPlayModal } from '../../components/modals/HowToPlayModal'
import { VictoryScreen } from '../../components/victory/VictoryScreen'
import { howToPlayInstructions } from '../../data/howToPlay'
import { useSound } from '../../hooks/useSound'
import { useStudent } from '../../hooks/useStudent'
import { calculateStars } from '../../services/progress/progressService'
import { publicAsset } from '../../utils/publicAsset'
import { QuestionCard } from './QuestionCard'
import { TempleDoorProgress } from './TreasurePath'
import {
  calculateQuestionPoints,
  calculateQuestAccuracy,
  calculateQuestTimeBonus,
  formatQuestTime,
} from './questLogic'
import type { QuestTopicData } from './questTypes'
import styles from './QuestGame.module.css'
import { useGameMusic } from '../../hooks/useGameMusic'

interface QuestGameProps {
  topic: QuestTopicData
  saveProgress?: boolean
}

export function QuestGame({ topic, saveProgress = true }: QuestGameProps) {
  useGameMusic(publicAsset('sounds/second game.mp3'))
  const navigate = useNavigate()
  const { recordGameResult, recentAchievements, clearRecentAchievements } = useStudent()
  const { settings: soundSettings, play, toggleMaster } = useSound()
  const resultSaved = useRef(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [successfulQuestions, setSuccessfulQuestions] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(0)
  const [score, setScore] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isResolved, setIsResolved] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isTempleOpen, setIsTempleOpen] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [message, setMessage] = useState('Take aim at the correct verb form.')
  const [shotIndex, setShotIndex] = useState<number | null>(null)
  const [shotId, setShotId] = useState(0)

  const currentQuestion = topic.questions[questionIndex]
  const arrows = Math.max(1, 3 - wrongAttempts)
  const accuracy = calculateQuestAccuracy(successfulQuestions, topic.questions.length)

  useEffect(() => {
    if (isPaused || isTempleOpen || isFinished) return
    const intervalId = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [isFinished, isPaused, isTempleOpen])

  useLayoutEffect(() => {
    if (!isFinished || resultSaved.current || !saveProgress) return
    resultSaved.current = true
    recordGameResult({ topicId: topic.id, topicTitle: topic.title, gameType: 'quest', score, accuracy, elapsedSeconds })
  }, [accuracy, elapsedSeconds, isFinished, recordGameResult, saveProgress, score, topic.id, topic.title])

  const restartGame = useCallback(() => {
    setQuestionIndex(0)
    setSelectedIndexes([])
    setWrongAttempts(0)
    setSuccessfulQuestions(0)
    setCompletedSteps(0)
    setScore(0)
    setElapsedSeconds(0)
    setIsResolved(false)
    setIsPaused(false)
    setIsTempleOpen(false)
    setIsFinished(false)
    setMessage('Take aim at the correct verb form.')
    setShotIndex(null)
    setShotId(0)
    resultSaved.current = false
    clearRecentAchievements()
  }, [clearRecentAchievements])

  const requestRestart = () => {
    if (questionIndex === 0 && selectedIndexes.length === 0) {
      restartGame()
      return
    }
    if (window.confirm('Restart this challenge? Your current attempt will be lost.')) restartGame()
  }

  const goHome = () => {
    if (!isFinished && (questionIndex > 0 || selectedIndexes.length > 0) &&
      !window.confirm('Leave this challenge? Your current attempt will be lost.')) return
    navigate('/')
  }

  const selectAnswer = (answerIndex: 0 | 1 | 2) => {
    if (isPaused || isResolved || isTempleOpen || selectedIndexes.includes(answerIndex)) return

    setShotIndex(answerIndex)
    setShotId((value) => value + 1)
    setSelectedIndexes((indexes) => [...indexes, answerIndex])

    if (answerIndex === currentQuestion.correctIndex) {
      const earnedPoints = calculateQuestionPoints(wrongAttempts)
      setScore((value) => value + earnedPoints)
      if (wrongAttempts < 2) setSuccessfulQuestions((value) => value + 1)
      setCompletedSteps(questionIndex + 1)
      setIsResolved(true)
      setMessage(`${currentQuestion.explanation} Rune ${questionIndex + 1} is glowing! +${earnedPoints} points.`)
      play('correct')
      play('move')
      return
    }

    const nextWrongAttempts = wrongAttempts + 1
    setWrongAttempts(nextWrongAttempts)
    setMessage(nextWrongAttempts === 1
      ? `Missed! Hint: ${currentQuestion.hint}`
      : `That target is sealed. ${currentQuestion.hint}`)
    play('wrong')
    play('heartLost')
  }

  const continueChallenge = () => {
    if (!isResolved) return

    if (questionIndex < topic.questions.length - 1) {
      setQuestionIndex((index) => index + 1)
      setSelectedIndexes([])
      setWrongAttempts(0)
      setIsResolved(false)
      setShotIndex(null)
      setMessage('Take aim at the correct verb form.')
      return
    }

    const timeBonus = calculateQuestTimeBonus(elapsedSeconds)
    setScore((value) => value + timeBonus)
    setIsTempleOpen(true)
    setMessage(`All ten symbols are shining. The temple door is open! Time bonus: ${timeBonus} points.`)
    play('chest')
    window.setTimeout(() => play('levelComplete'), 450)
  }

  const statItems = useMemo(() => [
    { label: 'Score', value: score.toString() },
    { label: 'Time', value: formatQuestTime(elapsedSeconds) },
    { label: 'Arrows', value: arrows.toString() },
  ], [arrows, elapsedSeconds, score])

  if (isFinished) {
    return <VictoryScreen gameTitle="Temple Door Challenge" score={score} accuracy={accuracy} elapsedSeconds={elapsedSeconds} stars={calculateStars(accuracy)} newAchievements={recentAchievements} onPlayAgain={restartGame} onChooseAnotherGame={() => navigate('/#game-library')} onHome={() => navigate('/')} />
  }

  return (
    <main className={styles.page}>
      <header className={styles.gameHeader}>
        <button className={styles.homeButton} type="button" onClick={goHome}>&#8962; <span>Home</span></button>
        <div className={styles.titleBlock}>
          <p>Temple Door Challenge</p>
          <h1>{topic.title}</h1>
          <span>Light all ten symbols to unlock the treasury.</span>
        </div>
        <div className={styles.controls} aria-label="Game controls">
          <button type="button" onClick={() => setIsPaused((value) => !value)} disabled={isTempleOpen}>
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button type="button" onClick={requestRestart}>Restart</button>
          <button type="button" onClick={() => setIsHowToPlayOpen(true)} aria-label="How to Play">?</button>
          <button type="button" onClick={toggleMaster} aria-pressed={!soundSettings.masterMuted} aria-label={soundSettings.masterMuted ? 'Sound off' : 'Sound on'}>
            {soundSettings.masterMuted ? 'Sound off' : 'Sound on'}
          </button>
        </div>
      </header>

      <section className={styles.statusRow}>
        <div className={styles.questionCount}>Mission {Math.min(questionIndex + 1, topic.questions.length)} / {topic.questions.length}</div>
        <div className={styles.stats} aria-label="Challenge statistics">
          {statItems.map((item) => <span key={item.label}><small>{item.label}</small><strong>{item.value}</strong></span>)}
        </div>
        <div className={styles.arrowRack} aria-label={`${arrows} targets remaining`}>
          {[0, 1, 2].map((index) => <span className={index < arrows ? styles.arrowReady : styles.arrowSpent} key={index} aria-hidden="true">&#10148;</span>)}
        </div>
      </section>

      <div className={styles.sceneSlot}>
        <section className={`${styles.challengeArea} ${isTempleOpen ? styles.templeOpen : ''}`}>
        <div
          className={styles.sceneImage}
          style={{ backgroundImage: `url(${publicAsset('images/quest.png')})` }}
          role="img"
          aria-label="An Egyptian archer aiming at three magical targets before an ancient temple door"
        />
        <TempleDoorProgress completedSteps={completedSteps} totalSteps={topic.questions.length} isOpen={isTempleOpen} />

        {!isTempleOpen && (
          <QuestionCard
            question={currentQuestion}
            selectedIndexes={selectedIndexes}
            isResolved={isResolved}
            shotIndex={shotIndex}
            shotId={shotId}
            onSelect={selectAnswer}
          />
        )}

        {!isTempleOpen && (
          <div className={`${styles.message} ${wrongAttempts > 0 ? styles.hint : ''}`} aria-live="polite">
            <span aria-hidden="true">{isResolved ? '✦' : wrongAttempts > 0 ? '!' : '◎'}</span>
            <p>{message}</p>
          </div>
        )}

        {isResolved && !isTempleOpen && (
          <button className={styles.nextButton} type="button" onClick={continueChallenge}>
            {questionIndex === topic.questions.length - 1 ? 'Open the Temple Door' : 'Next Target'} &#8594;
          </button>
        )}

        {isTempleOpen && (
          <div className={styles.treasuryReveal} role="status">
            <div className={styles.doorGlow} aria-hidden="true" />
            <div className={styles.treasureCard}>
              <span className={styles.treasureIcon} aria-hidden="true">&#10022;</span>
              <p>THE TREASURY IS OPEN</p>
              <h2>Temple conquered!</h2>
              <button type="button" onClick={() => setIsFinished(true)}>Enter the Treasury</button>
            </div>
          </div>
        )}

        {isPaused && (
          <div className={styles.pauseOverlay} role="status">
            <span aria-hidden="true">&#8545;</span>
            <h2>Challenge Paused</h2>
            <p>The timer is stopped.</p>
            <button type="button" onClick={() => setIsPaused(false)}>Return to the temple</button>
          </div>
        )}
        </section>
      </div>

      {isHowToPlayOpen && (
        <HowToPlayModal
          instructions={howToPlayInstructions.quest}
          onClose={() => setIsHowToPlayOpen(false)}
          onStart={() => setIsHowToPlayOpen(false)}
        />
      )}
    </main>
  )
}
