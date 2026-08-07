import { describe, expect, it } from 'vitest'
import {
  calculateQuestionPoints,
  calculateQuestAccuracy,
  calculateQuestTimeBonus,
  formatQuestTime,
} from './questLogic'

describe('questLogic', () => {
  it('awards points according to the number of wrong attempts', () => {
    expect(calculateQuestionPoints(0)).toBe(20)
    expect(calculateQuestionPoints(1)).toBe(10)
    expect(calculateQuestionPoints(2)).toBe(0)
  })

  it('calculates accuracy and handles an empty question set', () => {
    expect(calculateQuestAccuracy(7, 10)).toBe(70)
    expect(calculateQuestAccuracy(0, 0)).toBe(0)
  })

  it('never returns a negative time bonus', () => {
    expect(calculateQuestTimeBonus(50)).toBe(250)
    expect(calculateQuestTimeBonus(500)).toBe(0)
    expect(formatQuestTime(125)).toBe('2:05')
  })
})
