import type { StoryCardData } from './storyboardTypes'

export function shuffleStoryCards(cards: StoryCardData[], random = Math.random) {
  const result = [...cards]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

export function normalizeSentence(value: string) {
  return value
    .toLocaleLowerCase('en')
    .replace(/[’‘]/g, "'")
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .trim()
}

export function isAcceptedSentence(value: string, acceptedSentences: string[]) {
  const normalizedValue = normalizeSentence(value)
  return acceptedSentences.some((sentence) => normalizeSentence(sentence) === normalizedValue)
}

export function calculateStoryboardAccuracy(stageOneCorrect: number, sentenceSuccesses: number, total: number) {
  if (total === 0) return 0
  const stageOneAccuracy = (stageOneCorrect / total) * 100
  const stageTwoAccuracy = (sentenceSuccesses / total) * 100
  return Math.round((stageOneAccuracy + stageTwoAccuracy) / 2)
}

export function getProvisionalStars(accuracy: number) {
  if (accuracy >= 90) return 3
  if (accuracy >= 70) return 2
  return 1
}

export function buildCompleteStory(cards: StoryCardData[]) {
  const links = ['First', 'Then', 'Next', 'After that', 'Later', 'Then', 'Next', 'After that', 'Later', 'Finally']
  return cards.map((card, index) => {
    const sentence = card.correctSentence.replace(/^She\s/, 'she ')
    return `${links[index]}, ${sentence}`
  }).join(' ')
}
