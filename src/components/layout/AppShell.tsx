import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ProfilePicker } from '../profile/ProfilePicker'
import { EgyptBackground } from './EgyptBackground'
import { TopHeader } from './TopHeader'
import styles from './AppShell.module.css'
import { AchievementToast } from '../achievements/AchievementToast'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation()
  const isGameRoute = location.pathname.startsWith('/games/')
  const isTeacherRoute = location.pathname.startsWith('/teacher')

  return (
    <div className={styles.shell}>
      <EgyptBackground />
      {!isGameRoute && !isTeacherRoute && <TopHeader />}
      <div className={styles.content}>{children}</div>
      {!isTeacherRoute && <ProfilePicker />}
      {!isTeacherRoute && <AchievementToast />}
    </div>
  )
}
