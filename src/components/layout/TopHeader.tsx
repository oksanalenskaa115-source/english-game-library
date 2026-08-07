import { NavLink } from 'react-router-dom'
import { getStudentAvatar } from '../../data/studentAvatars'
import { useStudent } from '../../hooks/useStudent'
import styles from './TopHeader.module.css'
import { useSound } from '../../hooks/useSound'

const getNavClassName = ({ isActive }: { isActive: boolean }) =>
  `${styles.navLink} ${isActive ? styles.active : ''}`

export function TopHeader() {
  const { settings, toggleMaster } = useSound()
  const isSoundOn = !settings.masterMuted
  const { selectedStudent, openProfilePicker } = useStudent()
  const avatar = selectedStudent ? getStudentAvatar(selectedStudent.avatarId) : null

  return (
    <header className={styles.header}>
      <NavLink className={styles.brand} to="/" aria-label="English Game Library home">
        <span className={styles.brandName}>English Game Library</span>
        <span className={styles.tagline}>PLAY • LEARN • ADVENTURE</span>
      </NavLink>

      <nav className={styles.navigation} aria-label="Main navigation">
        <NavLink className={getNavClassName} to="/achievements">
          <span aria-hidden="true">🏆</span><span className={styles.navText}>Achievements</span>
        </NavLink>
        <NavLink className={getNavClassName} to="/progress">
          <span aria-hidden="true">📖</span><span className={styles.navText}>My Progress</span>
        </NavLink>
        <NavLink className={getNavClassName} to="/settings">
          <span aria-hidden="true">⚙</span><span className={styles.navText}>Settings</span>
        </NavLink>
        <button
          className={styles.soundButton}
          type="button"
          aria-pressed={isSoundOn}
          onClick={toggleMaster}
        >
          <span aria-hidden="true">{isSoundOn ? '🔊' : '🔇'}</span>
          <span className={styles.soundLabel}>{isSoundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
      </nav>

      <button
        className={styles.profile}
        type="button"
        onClick={openProfilePicker}
        aria-label={selectedStudent ? `Change profile. Current student: ${selectedStudent.name}` : 'Choose student profile'}
      >
        <span className={styles.avatar} aria-hidden="true">{avatar?.symbol ?? '?'}</span>
        <span>
          <span className={styles.studentName}>{selectedStudent?.name ?? 'Choose profile'}</span>
          <span className={styles.stats}>
            <span>Level {selectedStudent?.level ?? 1}</span>
            <span>★ {selectedStudent?.totalStars ?? 0}</span>
          </span>
        </span>
      </button>
    </header>
  )
}
