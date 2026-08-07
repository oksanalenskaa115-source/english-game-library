import type { StudentProfile } from '../../types'

const STUDENTS_KEY = 'egl.students'
const SELECTED_STUDENT_KEY = 'egl.selectedStudentId'

function isStudentProfile(value: unknown): value is StudentProfile {
  if (!value || typeof value !== 'object') return false

  const profile = value as Partial<StudentProfile>
  return (
    typeof profile.id === 'string' &&
    typeof profile.name === 'string' &&
    typeof profile.avatarId === 'string' &&
    typeof profile.level === 'number' &&
    typeof profile.totalStars === 'number'
  )
}

export function loadStudentProfiles(): StudentProfile[] {
  try {
    const storedValue = localStorage.getItem(STUDENTS_KEY)
    if (!storedValue) return []

    const parsedValue: unknown = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue.filter(isStudentProfile).map((profile) => ({
      ...profile,
      starsByTopic: profile.starsByTopic ?? {},
      completedGameTypes: profile.completedGameTypes ?? [],
      completedTopicIds: profile.completedTopicIds ?? [],
      bestScores: profile.bestScores ?? {},
      bestTimes: profile.bestTimes ?? {},
      accuracyByTopic: profile.accuracyByTopic ?? {},
      attemptsByTopic: profile.attemptsByTopic ?? {},
      unlockedAchievementIds: profile.unlockedAchievementIds ?? [],
    })) : []
  } catch {
    return []
  }
}

export function saveStudentProfiles(profiles: StudentProfile[]) {
  try {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(profiles))
  } catch {
    // The interface keeps working if private browsing or browser settings block storage.
  }
}

export function loadSelectedStudentId(): string | null {
  return localStorage.getItem(SELECTED_STUDENT_KEY)
}

export function saveSelectedStudentId(studentId: string | null) {
  try {
    if (studentId) {
      localStorage.setItem(SELECTED_STUDENT_KEY, studentId)
    } else {
      localStorage.removeItem(SELECTED_STUDENT_KEY)
    }
  } catch {
    // The selected profile remains available until the current tab is closed.
  }
}
