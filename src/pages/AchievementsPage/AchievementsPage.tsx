import { Link } from 'react-router-dom'
import { achievements } from '../../data/achievements'
import { getStudentAvatar } from '../../data/studentAvatars'
import { useStudent } from '../../hooks/useStudent'
import { loadAchievementRecords } from '../../services/achievements/achievementService'
import styles from './AchievementsPage.module.css'

export function AchievementsPage() {
  const { selectedStudent, openProfilePicker } = useStudent()
  if (!selectedStudent) return <main className={styles.page}><section className={styles.empty}><h1>Achievements</h1><p>Choose an explorer to see achievements.</p><button type="button" onClick={openProfilePicker}>Choose Profile</button></section></main>

  const avatar = getStudentAvatar(selectedStudent.avatarId)
  const records = loadAchievementRecords().filter((record) => record.studentId === selectedStudent.id)
  const unlockedCount = selectedStudent.unlockedAchievementIds.length

  return <main className={styles.page}>
    <header className={styles.header}>
      <div className={styles.avatar} aria-hidden="true">{avatar.symbol}</div>
      <div><p>{selectedStudent.name}'s rewards</p><h1>Achievements</h1><span>Complete adventures and collect every Egyptian badge.</span></div>
      <div className={styles.total}><strong>{unlockedCount} / {achievements.length}</strong><span>Unlocked</span></div>
    </header>

    <section className={styles.grid} aria-label="Achievement collection">
      {achievements.map((achievement) => {
        const isUnlocked = selectedStudent.unlockedAchievementIds.includes(achievement.id)
        const record = records.find((item) => item.achievementId === achievement.id)
        return <article className={`${styles.card} ${isUnlocked ? styles.unlocked : styles.locked}`} key={achievement.id}>
          <div className={styles.symbol} aria-hidden="true">{isUnlocked ? achievement.symbol : '🔒'}</div>
          <p>{isUnlocked ? 'Achievement unlocked' : 'Locked achievement'}</p>
          <h2>{achievement.title}</h2>
          <span>{achievement.description}</span>
          <strong>{isUnlocked ? `Unlocked ${record ? new Date(record.unlockedAt).toLocaleDateString() : 'from earlier progress'}` : 'Keep playing to unlock'}</strong>
        </article>
      })}
    </section>

    <div className={styles.actions}><Link to="/">Choose a Game</Link><Link to="/progress">My Progress</Link></div>
  </main>
}
