import type { StoryboardTopicData } from '../games/storyboard/storyboardTypes'

export const storyboardTopics: StoryboardTopicData[] = [
  {
    id: 'nile-adventure',
    title: 'A Princess\'s Day in Egypt',
    description: 'Put the princess\'s day in order and tell her story in Past Simple.',
    cards: [
      {
        id: 'get-up', order: 1, title: 'Get up', imagePosition: '0% 0%',
        correctSentence: 'She got up early.', acceptedSentences: ['She got up early.'],
        wrongSentences: ['She get up early.', 'She got early up.'], wordHelp: 'get up / early',
      },
      {
        id: 'breakfast', order: 2, title: 'Have breakfast', imagePosition: '25% 0%',
        correctSentence: 'She had breakfast.', acceptedSentences: ['She had breakfast.'],
        wrongSentences: ['She has breakfast.', 'She have breakfast.'], wordHelp: 'have / breakfast',
      },
      {
        id: 'get-dressed', order: 3, title: 'Get dressed', imagePosition: '50% 0%',
        correctSentence: 'She got dressed.', acceptedSentences: ['She got dressed.'],
        wrongSentences: ['She get dressed.', 'She did got dressed.'], wordHelp: 'get dressed',
      },
      {
        id: 'letter', order: 4, title: 'Write a letter', imagePosition: '75% 0%',
        correctSentence: 'She wrote a letter.', acceptedSentences: ['She wrote a letter.'],
        wrongSentences: ['She write a letter.', 'She written a letter.'], wordHelp: 'write / a letter',
      },
      {
        id: 'market', order: 5, title: 'Go to the market', imagePosition: '100% 0%',
        correctSentence: 'She went to the market.', acceptedSentences: ['She went to the market.'],
        wrongSentences: ['She goed to the market.', 'She goes to the market.'], wordHelp: 'go / to the market',
      },
      {
        id: 'ring', order: 6, title: 'Buy a ring', imagePosition: '0% 100%',
        correctSentence: 'She bought a ring.', acceptedSentences: ['She bought a ring.'],
        wrongSentences: ['She buyed a ring.', 'She buys a ring.'], wordHelp: 'buy / a ring',
      },
      {
        id: 'temple', order: 7, title: 'Visit the temple', imagePosition: '25% 100%',
        correctSentence: 'She visited the temple.', acceptedSentences: ['She visited the temple.'],
        wrongSentences: ['She visit the temple.', 'She did visited the temple.'], wordHelp: 'visit / the temple',
      },
      {
        id: 'boat', order: 8, title: 'Take a boat trip', imagePosition: '50% 100%',
        correctSentence: 'She took a boat trip.', acceptedSentences: ['She took a boat trip.'],
        wrongSentences: ['She taked a boat trip.', 'She takes a boat trip.'], wordHelp: 'take / a boat trip',
      },
      {
        id: 'sunset', order: 9, title: 'Watch the sunset', imagePosition: '75% 100%',
        correctSentence: 'She watched the sunset.', acceptedSentences: ['She watched the sunset.'],
        wrongSentences: ['She watch the sunset.', 'She did watched the sunset.'], wordHelp: 'watch / the sunset',
      },
      {
        id: 'bed', order: 10, title: 'Go to bed', imagePosition: '100% 100%',
        correctSentence: 'She went to bed.', acceptedSentences: ['She went to bed.'],
        wrongSentences: ['She goed to bed.', 'She go to bed.'], wordHelp: 'go / to bed',
      },
    ],
  },
]
