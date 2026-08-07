import { describe, expect, it } from 'vitest'
import type { EditorMemoryTopic, EditorQuestTopic, EditorStoryboardTopic } from '../types'
import { validateContent, validateGeneral, validateTopic } from './topicValidation'

const common = {
  schemaVersion: 1 as const,
  title: 'Past Simple',
  description: 'A clear classroom topic.',
  difficulty: 'easy' as const,
  maxStars: 3 as const,
  status: 'published' as const,
  updatedAt: '2026-08-07T00:00:00.000Z',
}

function validMemoryTopic(): EditorMemoryTopic {
  return {
    ...common,
    id: 'memory-topic',
    gameType: 'memory',
    pairs: ['go|went', 'see|saw', 'take|took', 'find|found'].map((value, index) => {
      const [base, past] = value.split('|')
      return { id: `pair-${index}`, base, past }
    }),
  }
}

function validQuestTopic(): EditorQuestTopic {
  return {
    ...common,
    id: 'quest-topic',
    gameType: 'quest',
    questions: Array.from({ length: 5 }, (_, index) => ({
      id: `question-${index}`,
      sentence: `She ___ treasure ${index}.`,
      verb: 'find',
      options: ['find', 'found', 'finds'] as [string, string, string],
      correctIndex: 1 as const,
      hint: 'Use Past Simple.',
      explanation: 'Found is the Past Simple form of find.',
    })),
  }
}

function validStoryboardTopic(): EditorStoryboardTopic {
  return {
    ...common,
    id: 'story-topic',
    gameType: 'storyboard',
    cards: Array.from({ length: 10 }, (_, index) => ({
      id: `card-${index}`,
      eventNumber: index + 1,
      title: `Event ${index + 1}`,
      image: { name: 'story.png', type: 'image/png', dataUrl: 'data:image/png;base64,AA==' },
      correctSentence: 'She opened the door.',
      wrongSentences: ['She open the door.', 'She opens the door.'] as [string, string],
      wordHelp: 'she / open / door',
    })),
  }
}

describe('topicValidation', () => {
  it('accepts the minimum valid content for every game type', () => {
    expect(validateTopic(validMemoryTopic())).toEqual([])
    expect(validateTopic(validQuestTopic())).toEqual([])
    expect(validateTopic(validStoryboardTopic())).toEqual([])
  })

  it('rejects missing general information', () => {
    expect(validateGeneral({ ...validMemoryTopic(), title: '', description: '' })).toHaveLength(2)
  })

  it('rejects duplicate memory pairs and an empty Past Simple form', () => {
    const topic = validMemoryTopic()
    topic.pairs[1] = { ...topic.pairs[0] }
    topic.pairs[2].past = ''

    expect(validateContent(topic).length).toBeGreaterThanOrEqual(2)
  })

  it('rejects a quest question without a selected correct answer', () => {
    const topic = validQuestTopic()
    topic.questions[0].correctIndex = null

    expect(validateContent(topic)).not.toEqual([])
  })

  it('rejects repeated Storyboard event numbers and a missing image', () => {
    const topic = validStoryboardTopic()
    topic.cards[1].eventNumber = 1
    topic.cards[2].image = undefined

    expect(validateContent(topic).length).toBeGreaterThanOrEqual(2)
  })
})
