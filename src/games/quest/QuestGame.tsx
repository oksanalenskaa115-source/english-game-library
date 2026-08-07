import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HowToPlayModal } from '../../components/modals/HowToPlayModal'
import { howToPlayInstructions } from '../../data/howToPlay'
import { QuestionCard } from './QuestionCard'
import { TreasurePath } from './TreasurePath'
import {
  calculateQuestionPoints,
  calculateQuestAccuracy,
  calculateQuestTimeBonus,
  formatQuestTime,
} from './questLogic'
import type { QuestTopicData } from './questTypes'
import styles from './QuestGame.module.css'
import { useSound } from '../../hooks/useSound'
import { useStudent } from '../../hooks/useStudent'
import { useRef } from 'react'
import { VictoryScreen } from '../../components/victory/VictoryScreen'
import { calculateStars } from '../../services/progress/progressService'

interface QuestGameProps {
  topic: QuestTopicData
  saveProgress?: boolean
}

export function QuestGame({ topic, saveProgress = true }: QuestGameProps) {
  const navigate = useNavigate()
  const { recordGameResult, recentAchievements, clearRecentAchievements } = useStudent()
  const resultSaved = useRef(false)
  const { settings: soundSettings, play, toggleMaster } = useSound()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [successfulQuestions, setSuccessfulQuestions] = useState(0)
  const [totalErrors, setTotalErrors] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(0)
  const [score, setScore] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timeBonus, setTimeBonus] = useState(0)
  const [isResolved, setIsResolved] = useState(false)
  const [wasRevealed, setWasRevealed] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [message, setMessage] = useState('Choose the best answer.')

  const currentQuestion = topic.questions[questionIndex]
  const hearts = Math.max(0, 3 - wrongAttempts)
  const accuracy = calculateQuestAccuracy(successfulQuestions, topic.questions.length)

  useEffect(() => {
    if (isPaused || isFinished) return
    const intervalId = window.setInterval(() => setElapsedSeconds((currentValue) => currentValue + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [isFinished, isPaused])

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
    setTotalErrors(0)
    setCompletedSteps(0)
    setScore(0)
    setElapsedSeconds(0)
    setTimeBonus(0)
    setIsResolved(false)
    setWasRevealed(false)
    setIsPaused(false)
    setIsFinished(false)
    setMessage('Choose the best answer.')
    resultSaved.current = false
    clearRecentAchievements()
  }, [])

  const requestRestart = () => {
    if (questionIndex === 0 && selectedIndexes.length === 0) {
      restartGame()
      return
    }

    if (window.confirm('Restart this quest? Your current attempt will be lost.')) restartGame()
  }

  const goHome = () => {
    if (!isFinished && (questionIndex > 0 || selectedIndexes.length > 0) &&
      !window.confirm('Leave this quest? Your current attempt will be lost.')) return
    navigate('/')
  }

  const selectAnswer = (answerIndex: 0 | 1 | 2) => {
    if (isPaused || isResolved || selectedIndexes.includes(answerIndex)) return

    const nextSelectedIndexes = [...selectedIndexes, answerIndex]
    setSelectedIndexes(nextSelectedIndexes)

    if (answerIndex === currentQuestion.correctIndex) {
      const earnedPoints = calculateQuestionPoints(wrongAttempts)
      setScore((currentScore) => currentScore + earnedPoints)
      setSuccessfulQuestions((currentValue) => currentValue + 1)
      setCompletedSteps(questionIndex + 1)
      setIsResolved(true)
      setMessage(`${currentQuestion.explanation} +${earnedPoints} points.`)
      play('correct')
      play('move')
      return
    }

    const nextWrongAttempts = wrongAttempts + 1
    setWrongAttempts(nextWrongAttempts)
    setTotalErrors((currentValue) => currentValue + 1)
    play('wrong')
    play('heartLost')

    if (nextWrongAttempts >= 2) {
      setCompletedSteps(questionIndex + 1)
      setWasRevealed(true)
      setIsResolved(true)
      setMessage(`${currentQuestion.explanation} No points for this question.`)
    } else {
      setMessage(`Hint: ${currentQuestion.hint}`)
    }
  }

  const continueQuest = () => {
    if (!isResolved) return

    if (questionIndex < topic.questions.length - 1) {
      setQuestionIndex((currentIndex) => currentIndex + 1)
      setSelectedIndexes([])
      setWrongAttempts(0)
      setIsResolved(false)
      setWasRevealed(false)
      setMessage('Choose the best answer.')
      return
    }

    const earnedTimeBonus = calculateQuestTimeBonus(elapsedSeconds)
    setTimeBonus(earnedTimeBonus)
    setScore((currentScore) => currentScore + earnedTimeBonus)
    setIsFinished(true)
    play('chest')
    window.setTimeout(() => play('levelComplete'), 350)
    setMessage(`The treasure chest is open! Time bonus: ${earnedTimeBonus} points.`)
  }

  const statItems = useMemo(() => [
    { label: 'Score', value: score.toString() },
    { label: 'Time', value: formatQuestTime(elapsedSeconds) },
    { label: 'Hearts', value: `${hearts} / 3` },
  ], [elapsedSeconds, hearts, score])

  if (isFinished) return <VictoryScreen gameTitle="Verb Treasure Quest" score={score} accuracy={accuracy} elapsedSeconds={elapsedSeconds} stars={calculateStars(accuracy)} newAchievements={recentAchievements} onPlayAgain={restartGame} onChooseAnotherGame={() => navigate('/#game-library')} onHome={() => navigate('/')} />

  return (
    <main className={styles.page}>
      <header className={styles.gameHeader}>
        <button className={styles.homeButton} type="button" onClick={goHome}>⌂ <span>Home</span></button>
        <div className={styles.titleBlock}>
          <p>Verb Treasure Quest</p>
          <h1>{topic.title}</h1>
          <span>{topic.description}</span>
        </div>
        <div className={styles.controls} aria-label="Game controls">
          <button type="button" onClick={() => setIsPaused((currentValue) => !currentValue)} disabled={isFinished}>
            {isPaused ? '▶ Resume' : 'Ⅱ Pause'}
          </button>
          <button type="button" onClick={requestRestart}>↻ Restart</button>
          <button type="button" onClick={() => setIsHowToPlayOpen(true)} aria-label="How to Play">?</button>
          <button type="button" onClick={toggleMaster} aria-pressed={!soundSettings.masterMuted} aria-label={soundSettings.masterMuted ? 'Sound off' : 'Sound on'}>
            {soundSettings.masterMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      <section className={styles.statusRow}>
        <div className={styles.questionCount}>Question {Math.min(questionIndex + 1, topic.questions.length)} of {topic.questions.length}</div>
        <div className={styles.stats} aria-label="Quest statistics">
          {statItems.map((item) => <span key={item.label}><small>{item.label}</small><strong>{item.value}</strong></span>)}
        </div>
        <div className={styles.hearts} aria-label={`${hearts} of 3 hearts remaining`}>
          {[0, 1, 2].map((heartIndex) => (
            <span className={heartIndex < hearts ? styles.heartFull : styles.heartEmpty} key={heartIndex} aria-hidden="true">♥</span>
          ))}
        </div>
      </section>

      <TreasurePath completedSteps={completedSteps} totalSteps={topic.questions.length} isFinished={isFinished} />

      <aside className={styles.rule}>
        <strong>Grammar key:</strong> Use the base form of the verb after <b>did</b> and <b>didn’t</b>.
      </aside>

      <section className={styles.challengeArea}>
        <>
            <QuestionCard
              question={currentQuestion}
              selectedIndexes={selectedIndexes}
              isResolved={isResolved}
              wasRevealed={wasRevealed}
              onSelect={selectAnswer}
            />

            <div className={`${styles.message} ${wrongAttempts > 0 ? styles.hint : ''}`} aria-live="polite">
              <span aria-hidden="true">{isResolved ? '◆' : wrongAttempts > 0 ? '!' : '?'}</span>
              <p>{message}</p>
            </div>

            {isResolved && (
              <button className={styles.nextButton} type="button" onClick={continueQuest}>
                {questionIndex === topic.questions.length - 1 ? 'Open the Chest' : 'Next Question'} →
              </button>
            )}
        </>

        {isPaused && (
          <div className={styles.pauseOverlay} role="status">
            <span aria-hidden="true">Ⅱ</span>
            <h2>Quest Paused</h2>
            <p>The timer is stopped.</p>
            <button type="button" onClick={() => setIsPaused(false)}>Resume Quest</button>
          </div>
        )}
      </section>

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
