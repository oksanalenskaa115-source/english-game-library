import { createContext, useContext } from 'react'
import type { AchievementDefinition, GameResult, GameResultInput, StudentAvatarId, StudentProfile } from '../types'

export interface StudentContextValue {
  students: StudentProfile[]
  selectedStudent: StudentProfile | null
  isProfilePickerOpen: boolean
  createStudent: (name: string, avatarId: StudentAvatarId) => StudentProfile
  selectStudent: (studentId: string) => void
  recordGameResult: (input: GameResultInput) => GameResult | null
  achievementNotifications: AchievementDefinition[]
  dismissAchievementNotifications: () => void
  recentAchievements: AchievementDefinition[]
  clearRecentAchievements: () => void
  openProfilePicker: () => void
  closeProfilePicker: () => void
}

export const StudentContext = createContext<StudentContextValue | undefined>(undefined)

export function useStudent() {
  const context = useContext(StudentContext)

  if (!context) {
    throw new Error('useStudent must be used inside StudentProvider')
  }

  return context
}
