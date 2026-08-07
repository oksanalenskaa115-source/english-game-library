import styles from './TreasurePath.module.css'

interface TreasurePathProps {
  completedSteps: number
  totalSteps: number
  isFinished: boolean
}

export function TreasurePath({ completedSteps, totalSteps, isFinished }: TreasurePathProps) {
  const progress = totalSteps === 0 ? 0 : Math.min(100, (completedSteps / totalSteps) * 100)

  return (
    <section className={styles.path} aria-label={`Treasure progress: ${completedSteps} of ${totalSteps}`}>
      <div className={styles.labels}>
        <span>Temple gate</span>
        <span>{completedSteps} / {totalSteps}</span>
        <span>Treasure</span>
      </div>
      <div className={styles.track}>
        <div className={styles.progress} style={{ width: `${progress}%` }} />
        <span className={styles.explorer} style={{ left: `${progress}%` }} aria-hidden="true">🧭</span>
        <span className={`${styles.chest} ${isFinished ? styles.openChest : ''}`} aria-hidden="true">
          {isFinished ? '✨' : '▣'}
        </span>
      </div>
    </section>
  )
}
