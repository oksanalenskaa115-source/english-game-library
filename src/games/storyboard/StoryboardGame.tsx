import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HowToPlayModal } from '../../components/modals/HowToPlayModal'
import { howToPlayInstructions } from '../../data/howToPlay'
import { CompleteStory } from './CompleteStory'
import { ThothScrollRunner } from './ThothScrollRunner'
import { StoryOrder } from './StoryOrder'
import { calculateStoryboardAccuracy, getProvisionalStars } from './storyboardLogic'
import type { StoryboardTopicData } from './storyboardTypes'
import styles from './StoryboardGame.module.css'
import { useSound } from '../../hooks/useSound'
import { useStudent } from '../../hooks/useStudent'
import { VictoryScreen } from '../../components/victory/VictoryScreen'
import { calculateStars } from '../../services/progress/progressService'

interface StoryboardGameProps {
  topic: StoryboardTopicData
  saveProgress?: boolean
}

export function StoryboardGame({ topic, saveProgress = true }: StoryboardGameProps) {
  const navigate = useNavigate()
  const { recordGameResult, recentAchievements, clearRecentAchievements } = useStudent()
  const resultSaved = useRef(false)
  const { settings: soundSettings, play, toggleMaster } = useSound()
  const [runId, setRunId] = useState(0)
  const [stage, setStage] = useState<1 | 2 | 3>(1)
  const [stageProgress, setStageProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [firstCheckCorrect, setFirstCheckCorrect] = useState(0)
  const [sentenceSuccesses, setSentenceSuccesses] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false)
  const [showVictory, setShowVictory] = useState(false)

  const accuracy = calculateStoryboardAccuracy(firstCheckCorrect, sentenceSuccesses, topic.cards.length)
  const stars = stage === 1 ? 0 : getProvisionalStars(accuracy)
  const overallProgress = stage === 3 ? 100 : Math.round((((stage - 1) * topic.cards.length + stageProgress) / (topic.cards.length * 3)) * 100)

  useEffect(() => {
    if (stage === 3) return
    const timer = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000)
    return () => window.clearInterval(timer)
  }, [stage])

  useLayoutEffect(() => {
    if (stage !== 3 || resultSaved.current || !saveProgress) return
    resultSaved.current = true
    recordGameResult({ topicId: topic.id, topicTitle: topic.title, gameType: 'storyboard', score, accuracy, elapsedSeconds })
  }, [accuracy, elapsedSeconds, recordGameResult, saveProgress, score, stage, topic.id, topic.title])

  const addScore = (points: number) => setScore((current) => Math.max(0, current + points))

  const restart = () => {
    setRunId((current) => current + 1)
    setStage(1)
    setStageProgress(0)
    setScore(0)
    setFirstCheckCorrect(0)
    setSentenceSuccesses(0)
    setElapsedSeconds(0)
    setShowVictory(false)
    resultSaved.current = false
    clearRecentAchievements()
  }

  const requestRestart = () => {
    if (stage === 1 && stageProgress === 0) return restart()
    if (window.confirm('Restart this story? Your current attempt will be lost.')) restart()
  }

  const goHome = () => {
    setIsHowToPlayOpen(false)
    navigate('/', { replace: true })
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }

  const chooseAnotherGame = () => {
    setIsHowToPlayOpen(false)
    navigate('/#game-library', { replace: true })
  }

  const statusItems = useMemo(() => [
    { label: 'Progress', value: `${overallProgress}%` },
    { label: 'Score', value: score.toString() },
    { label: 'Stars', value: stars === 0 ? '—' : `${stars} / 3` },
  ], [overallProgress, score, stars])

  if (showVictory) return <VictoryScreen gameTitle="Adventure Storyboard" score={score} accuracy={accuracy} elapsedSeconds={elapsedSeconds} stars={calculateStars(accuracy)} newAchievements={recentAchievements} onPlayAgain={restart} onChooseAnotherGame={chooseAnotherGame} onHome={goHome} />

  return (
    <main className={styles.page} key={runId}>
      <header className={styles.gameHeader}>
        <button className={styles.homeButton} type="button" onClick={goHome}>⌂ <span>Home</span></button>
        <div className={styles.titleBlock}>
          <p>Adventure Storyboard</p>
          <h1>{topic.title}</h1>
          <span>{topic.description}</span>
        </div>
        <div className={styles.controls} aria-label="Game controls">
          <button type="button" onClick={requestRestart}>↻ Restart</button>
          <button type="button" onClick={() => setIsHowToPlayOpen(true)}>How to Play</button>
          <button type="button" onClick={toggleMaster} aria-pressed={!soundSettings.masterMuted} aria-label={soundSettings.masterMuted ? 'Sound off' : 'Sound on'}>{soundSettings.masterMuted ? 'Sound Off' : 'Sound On'}</button>
        </div>
      </header>

      <section className={styles.statusBar} aria-label="Story progress">
        <div className={styles.stageLabel}>Stage {stage} of 3</div>
        <div className={styles.progressTrack}><span style={{ width: `${overallProgress}%` }} /></div>
        <div className={styles.stats}>{statusItems.map((item) => <span key={item.label}><small>{item.label}</small><strong>{item.value}</strong></span>)}</div>
      </section>

      {stage === 1 && (
        <ThothScrollRunner
          cards={topic.cards}
          onAddScore={addScore}
          onProgress={setStageProgress}
          onComplete={(successes) => { play('levelComplete'); setSentenceSuccesses(successes); setStage(2); setStageProgress(0) }}
        />
      )}

      {stage === 2 && (
        <StoryOrder
          cards={topic.cards}
          onAddScore={addScore}
          onProgress={setStageProgress}
          onComplete={(correct) => { play('victory'); setFirstCheckCorrect(correct); setStage(3); setStageProgress(topic.cards.length) }}
        />
      )}

      {stage === 3 && (
        <CompleteStory cards={topic.cards} score={score} accuracy={accuracy} stars={stars} onRestart={restart} onHome={goHome} onFinish={() => setShowVictory(true)} />
      )}

      {isHowToPlayOpen && (
        <HowToPlayModal
          instructions={howToPlayInstructions.storyboard}
          onClose={() => setIsHowToPlayOpen(false)}
          onStart={() => setIsHowToPlayOpen(false)}
        />
      )}
    </main>
  )
}
