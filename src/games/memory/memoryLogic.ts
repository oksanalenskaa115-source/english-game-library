import type { MemoryCardData, VerbPair } from './memoryTypes'

export function shuffleItems<T>(items: T[], random: () => number = Math.random): T[] {
  const shuffledItems = [...items]

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    const currentItem = shuffledItems[index]
    shuffledItems[index] = shuffledItems[randomIndex]
    shuffledItems[randomIndex] = currentItem
  }

  return shuffledItems
}

export function createMemoryDeck(pairs: VerbPair[], random: () => number = Math.random): MemoryCardData[] {
  const cards = pairs.flatMap<MemoryCardData>((pair) => [
    { id: `${pair.id}-base`, pairId: pair.id, value: pair.base, form: 'base', isMatched: false },
    { id: `${pair.id}-past`, pairId: pair.id, value: pair.past, form: 'past', isMatched: false },
  ])

  return shuffleItems(cards, random)
}

export function cardsArePair(firstCard: MemoryCardData, secondCard: MemoryCardData) {
  return firstCard.pairId === secondCard.pairId && firstCard.id !== secondCard.id
}

export function calculateAccuracy(matchedPairs: number, moves: number) {
  if (moves === 0) return 0
  return Math.round((matchedPairs / moves) * 100)
}

export function calculateTimeBonus(elapsedSeconds: number) {
  return Math.max(0, 300 - elapsedSeconds)
}

export function calculateMatchPoints(streak: number) {
  const comboBonus = streak > 0 && streak % 3 === 0 ? 10 : 0
  return { basePoints: 20, comboBonus, totalPoints: 20 + comboBonus }
}

export function formatGameTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
