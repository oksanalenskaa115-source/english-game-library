import { useEffect } from 'react'
import { useStudent } from '../../hooks/useStudent'
import { useSound } from '../../hooks/useSound'
import styles from './AchievementToast.module.css'

export function AchievementToast() {
  const { achievementNotifications, dismissAchievementNotifications } = useStudent()
  const { play } = useSound()

  useEffect(() => {
    if (achievementNotifications.length === 0) return
    play('star')
    const timer = window.setTimeout(dismissAchievementNotifications, 6500)
    return () => window.clearTimeout(timer)
  }, [achievementNotifications, dismissAchievementNotifications, play])

  if (achievementNotifications.length === 0) return null
  return <aside className={styles.toast} role="status" aria-live="polite">
    <button type="button" onClick={dismissAchievementNotifications} aria-label="Close achievement notification">×</button>
    <p>New achievement!</p>
    {achievementNotifications.map((achievement) => <div key={achievement.id}><span aria-hidden="true">{achievement.symbol}</span><strong>{achievement.title}</strong></div>)}
  </aside>
}
