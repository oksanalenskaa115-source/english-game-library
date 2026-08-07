import { useEffect } from 'react'
import type { AchievementDefinition } from '../../types'
import { useSound } from '../../hooks/useSound'
import styles from './VictoryScreen.module.css'
import { publicAsset } from '../../utils/publicAsset'

interface VictoryScreenProps {
  gameTitle: string
  score: number
  accuracy: number
  elapsedSeconds: number
  stars: 1 | 2 | 3
  newAchievements?: AchievementDefinition[]
  onPlayAgain: () => void
  onChooseAnotherGame: () => void
  onHome: () => void
}

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

export function VictoryScreen({ gameTitle, score, accuracy, elapsedSeconds, stars, newAchievements = [], onPlayAgain, onChooseAnotherGame, onHome }: VictoryScreenProps) {
  const { play } = useSound()
  useEffect(() => { play('victory') }, [play])

  return <main className={styles.page} aria-labelledby="victory-title">
    <div className={styles.glow} aria-hidden="true" />
    <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} />)}</div>
    <section className={styles.panel}>
      <div className={styles.art}>
        <img src={publicAsset('images/optimized/victory-screen.webp')} alt="A young English explorer celebrating with a golden scarab in Ancient Egypt" />
        <div className={styles.scarab} aria-label="Golden scarab">◆</div>
        <div className={styles.chest} aria-hidden="true"><span>✦</span></div>
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Adventure complete · {gameTitle}</p>
        <h1 id="victory-title">CONGRATULATIONS!</h1>
        <h2>YOU DID IT!</h2>
        <div className={styles.stars} aria-label={`${stars} of 3 stars earned`}>{[1, 2, 3].map((star) => <span className={star <= stars ? styles.earned : styles.empty} key={star}>★</span>)}</div>
        <dl className={styles.results}>
          <div><dt>Score</dt><dd>{score}</dd></div>
          <div><dt>Accuracy</dt><dd>{accuracy}%</dd></div>
          <div><dt>Time</dt><dd>{formatTime(elapsedSeconds)}</dd></div>
          <div><dt>Stars</dt><dd>{stars} / 3</dd></div>
        </dl>
        {newAchievements.length > 0 && <section className={styles.achievement} aria-label="New achievement"><p>New achievement!</p>{newAchievements.map((achievement) => <div key={achievement.id}><span aria-hidden="true">{achievement.symbol}</span><strong>{achievement.title}</strong></div>)}</section>}
        <div className={styles.actions}>
          <button type="button" onClick={onPlayAgain}>Play Again</button>
          <button type="button" onClick={onChooseAnotherGame}>Choose Another Game</button>
          <button type="button" onClick={onHome}>Home</button>
        </div>
      </div>
    </section>
  </main>
}
