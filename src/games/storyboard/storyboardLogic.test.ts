import { describe, expect, it } from 'vitest'
import {
  buildCompleteStory,
  calculateStoryboardAccuracy,
  getProvisionalStars,
  isAcceptedSentence,
  normalizeSentence,
} from './storyboardLogic'
import type { StoryCardData } from './storyboardTypes'

function makeCard(index: number): StoryCardData {
  return {
    id: `card-${index}`,
    order: index,
    title: `Event ${index}`,
    imagePosition: 'center',
    correctSentence: `She visited place ${index}.`,
    acceptedSentences: [`She visited place ${index}.`],
    wrongSentences: ['Wrong one.', 'Wrong two.'],
    wordHelp: 'she / visit / place',
  }
}

describe('storyboardLogic', () => {
  it('ignores letter case, extra spaces and a final full stop', () => {
    expect(normalizeSentence('  SHE   visited the temple.  ')).toBe('she visited the temple')
    expect(isAcceptedSentence('she visited the temple', ['She visited the temple.'])).toBe(true)
  })

  it('treats straight and typographic apostrophes equally', () => {
    expect(normalizeSentence('She didn’t run.')).toBe("she didn't run")
    expect(normalizeSentence('She didn‘t run.')).toBe("she didn't run")
  })

  it('calculates combined accuracy and star thresholds', () => {
    expect(calculateStoryboardAccuracy(8, 6, 10)).toBe(70)
    expect(getProvisionalStars(69)).toBe(1)
    expect(getProvisionalStars(70)).toBe(2)
    expect(getProvisionalStars(90)).toBe(3)
  })

  it('builds a linked ten-card story from First to Finally', () => {
    const story = buildCompleteStory(Array.from({ length: 10 }, (_, index) => makeCard(index + 1)))

    expect(story).toMatch(/^First, she visited place 1\./)
    expect(story).toContain('After that, she visited place 4.')
    expect(story).toMatch(/Finally, she visited place 10\.$/)
  })
})
