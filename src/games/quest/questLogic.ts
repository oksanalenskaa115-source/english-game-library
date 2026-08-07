export function calculateQuestionPoints(wrongAttempts: number) {
  if (wrongAttempts === 0) return 20
  if (wrongAttempts === 1) return 10
  return 0
}

export function calculateQuestAccuracy(successfulQuestions: number, totalQuestions: number) {
  if (totalQuestions === 0) return 0
  return Math.round((successfulQuestions / totalQuestions) * 100)
}

export function calculateQuestTimeBonus(elapsedSeconds: number) {
  return Math.max(0, 300 - elapsedSeconds)
}

export function formatQuestTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
