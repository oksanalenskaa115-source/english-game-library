import styles from './TreasurePath.module.css'

interface TempleDoorProgressProps {
  completedSteps: number
  totalSteps: number
  isOpen: boolean
}

export function TempleDoorProgress({ completedSteps, totalSteps, isOpen }: TempleDoorProgressProps) {
  return (
    <div className={styles.progressLayer} aria-label={`Door symbols lit: ${completedSteps} of ${totalSteps}`}>
      <div className={styles.counter}>
        <span>Door power</span>
        <strong>{completedSteps}/{totalSteps}</strong>
      </div>
      <div className={styles.runes} aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, index) => (
          <span className={`${styles.rune} ${index < completedSteps ? styles.lit : ''}`} key={index} />
        ))}
      </div>
      {isOpen && <span className={styles.unlocked}>Temple unlocked</span>}
    </div>
  )
}
