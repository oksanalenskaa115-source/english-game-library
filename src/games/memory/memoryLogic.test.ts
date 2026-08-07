import { describe, expect, it } from 'vitest'
import {
  calculateAccuracy,
  calculateMatchPoints,
  calculateTimeBonus,
  cardsArePair,
  createMemoryDeck,
  formatGameTime,
} from './memoryLogic'

const pairs = [
  { id: 'go', base: 'go', past: 'went' },
  { id: 'see', base: 'see', past: 'saw' },
]

describe('memoryLogic', () => {
  it('creates two cards for every verb pair without changing the source data', () => {
    const deck = createMemoryDeck(pairs, () => 0.5)

    expect(deck).toHaveLength(4)
    expect(deck.filter((card) => card.pairId === 'go').map((card) => card.form).sort()).toEqual(['base', 'past'])
    expect(pairs).toHaveLength(2)
  })

  it('recognises only two different cards from the same pair', () => {
    const deck = createMemoryDeck(pairs, () => 0.5)
    const goCards = deck.filter((card) => card.pairId === 'go')

    expect(cardsArePair(goCards[0], goCards[1])).toBe(true)
    expect(cardsArePair(goCards[0], goCards[0])).toBe(false)
    expect(cardsArePair(goCards[0], deck.find((card) => card.pairId === 'see')!)).toBe(false)
  })

  it('awards 20 points and a 10 point bonus on every third correct pair', () => {
    expect(calculateMatchPoints(1)).toEqual({ basePoints: 20, comboBonus: 0, totalPoints: 20 })
    expect(calculateMatchPoints(3)).toEqual({ basePoints: 20, comboBonus: 10, totalPoints: 30 })
    expect(calculateMatchPoints(6).totalPoints).toBe(30)
  })

  it('calculates accuracy, time bonus and timer boundaries', () => {
    expect(calculateAccuracy(3, 4)).toBe(75)
    expect(calculateAccuracy(0, 0)).toBe(0)
    expect(calculateTimeBonus(120)).toBe(180)
    expect(calculateTimeBonus(301)).toBe(0)
    expect(formatGameTime(65)).toBe('1:05')
  })
})
