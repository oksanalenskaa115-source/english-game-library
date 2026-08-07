import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { StudentContext } from '../../hooks/useStudent'
import {
  loadSelectedStudentId,
  loadStudentProfiles,
  saveSelectedStudentId,
  saveStudentProfiles,
} from '../../services/storage/studentStorage'
import type { AchievementDefinition, GameResultInput, StudentAvatarId, StudentProfile } from '../../types'
import { applyResultToProfile, createAndSaveResult } from '../../services/progress/progressService'
import { unlockEligibleAchievements } from '../../services/achievements/achievementService'

interface StudentProviderProps {
  children: ReactNode
}

function createStudentId() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `student-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function StudentProvider({ children }: StudentProviderProps) {
  const [students, setStudents] = useState<StudentProfile[]>(loadStudentProfiles)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(loadSelectedStudentId)
  const [isProfilePickerOpen, setIsProfilePickerOpen] = useState(() => !loadSelectedStudentId())
  const [achievementNotifications, setAchievementNotifications] = useState<AchievementDefinition[]>([])
  const [recentAchievements, setRecentAchievements] = useState<AchievementDefinition[]>([])
  const didReconcileAchievements = useRef(false)

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) ?? null,
    [selectedStudentId, students],
  )

  useEffect(() => {
    saveStudentProfiles(students)
  }, [students])

  useEffect(() => {
    if (didReconcileAchievements.current) return
    didReconcileAchievements.current = true
    setStudents((currentStudents) => currentStudents.map((student) => unlockEligibleAchievements(student).profile))
  }, [])

  useEffect(() => {
    saveSelectedStudentId(selectedStudent?.id ?? null)
    if (!selectedStudent) setIsProfilePickerOpen(true)
  }, [selectedStudent])

  const createStudent = (name: string, avatarId: StudentAvatarId) => {
    const profile: StudentProfile = {
      id: createStudentId(),
      name: name.trim(),
      avatarId,
      level: 1,
      totalStars: 0,
      starsByTopic: {},
      completedGameTypes: [],
      completedTopicIds: [],
      bestScores: {},
      bestTimes: {},
      accuracyByTopic: {},
      attemptsByTopic: {},
      unlockedAchievementIds: [],
    }

    setStudents((currentStudents) => [...currentStudents, profile])
    setSelectedStudentId(profile.id)
    setIsProfilePickerOpen(false)
    return profile
  }

  const selectStudent = (studentId: string) => {
    if (!students.some((student) => student.id === studentId)) return
    setSelectedStudentId(studentId)
    setIsProfilePickerOpen(false)
  }

  const recordGameResult = (input: GameResultInput) => {
    if (!selectedStudentId || !selectedStudent) return null
    const result = createAndSaveResult(selectedStudentId, input)
    const progressedProfile = applyResultToProfile(selectedStudent, result)
    const achievementResult = unlockEligibleAchievements(progressedProfile)
    setStudents((currentStudents) => currentStudents.map((student) =>
      student.id === selectedStudentId ? achievementResult.profile : student,
    ))
    if (achievementResult.unlocked.length > 0) setAchievementNotifications(achievementResult.unlocked)
    setRecentAchievements(achievementResult.unlocked)
    return result
  }

  const value = useMemo(
    () => ({
      students,
      selectedStudent,
      isProfilePickerOpen,
      createStudent,
      selectStudent,
      recordGameResult,
      achievementNotifications,
      dismissAchievementNotifications: () => setAchievementNotifications([]),
      recentAchievements,
      clearRecentAchievements: () => setRecentAchievements([]),
      openProfilePicker: () => setIsProfilePickerOpen(true),
      closeProfilePicker: () => setIsProfilePickerOpen(false),
    }),
    [achievementNotifications, isProfilePickerOpen, recentAchievements, selectedStudent, students],
  )

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
}
