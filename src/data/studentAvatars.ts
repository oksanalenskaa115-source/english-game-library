import type { StudentAvatarId } from '../types'

export interface StudentAvatar {
  id: StudentAvatarId
  symbol: string
  label: string
}

export const studentAvatars: StudentAvatar[] = [
  { id: 'explorer', symbol: '🧭', label: 'Explorer compass' },
  { id: 'cat', symbol: '𓃠', label: 'Egyptian cat' },
  { id: 'scarab', symbol: '◆', label: 'Golden scarab' },
  { id: 'falcon', symbol: '𓅃', label: 'Egyptian falcon' },
  { id: 'ankh', symbol: '☥', label: 'Ankh' },
  { id: 'pyramid', symbol: '△', label: 'Pyramid' },
]

export function getStudentAvatar(avatarId: StudentAvatarId) {
  return studentAvatars.find((avatar) => avatar.id === avatarId) ?? studentAvatars[0]
}
