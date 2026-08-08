import type { StoryboardTopicData } from '../games/storyboard/storyboardTypes'

export const storyboardTopics: StoryboardTopicData[] = [
  {
    id: 'nile-adventure',
    title: 'A Princess\'s Day in Egypt',
    description: 'Put Nefertiti’s day in order, restore Thoth’s scrolls, and tell her story.',
    cards: [
      {
        id: 'get-up', order: 1, title: 'Get up', imagePosition: '0% 0%',
        correctSentence: 'Nefertiti got up early.', acceptedSentences: ['Nefertiti got up early.'],
        wrongSentences: ['Nefertiti get up early.', 'Nefertiti got early up.'], wordHelp: 'Nefertiti / got up / early',
      },
      {
        id: 'breakfast', order: 2, title: 'Have breakfast', imagePosition: '25% 0%',
        correctSentence: 'Nefertiti had breakfast.', acceptedSentences: ['Nefertiti had breakfast.'],
        wrongSentences: ['Nefertiti has breakfast.', 'Nefertiti have breakfast.'], wordHelp: 'Nefertiti / had / breakfast',
      },
      {
        id: 'get-dressed', order: 3, title: 'Get dressed', imagePosition: '50% 0%',
        correctSentence: 'Nefertiti got dressed.', acceptedSentences: ['Nefertiti got dressed.'],
        wrongSentences: ['Nefertiti get dressed.', 'Nefertiti did got dressed.'], wordHelp: 'Nefertiti / got dressed',
      },
      {
        id: 'letter', order: 4, title: 'Write a letter', imagePosition: '75% 0%',
        correctSentence: 'Nefertiti wrote a letter yesterday.', acceptedSentences: ['Nefertiti wrote a letter yesterday.'],
        wrongSentences: ['Nefertiti write a letter yesterday.', 'Yesterday wrote Nefertiti a letter.'], wordHelp: 'Nefertiti / wrote / a letter / yesterday',
      },
      {
        id: 'market', order: 5, title: 'Go to the market', imagePosition: '100% 0%',
        correctSentence: 'Nefertiti went to the market.', acceptedSentences: ['Nefertiti went to the market.'],
        wrongSentences: ['Nefertiti goed to the market.', 'Nefertiti goes to the market.'], wordHelp: 'Nefertiti / went / to the market',
      },
      {
        id: 'ring', order: 6, title: 'Buy a ring', imagePosition: '0% 100%',
        correctSentence: 'Nefertiti bought a ring.', acceptedSentences: ['Nefertiti bought a ring.'],
        wrongSentences: ['Nefertiti buyed a ring.', 'Nefertiti buys a ring.'], wordHelp: 'Nefertiti / bought / a ring',
      },
      {
        id: 'temple', order: 7, title: 'Visit the temple', imagePosition: '25% 100%',
        correctSentence: 'Nefertiti visited the temple.', acceptedSentences: ['Nefertiti visited the temple.'],
        wrongSentences: ['Nefertiti visit the temple.', 'Nefertiti did visited the temple.'], wordHelp: 'Nefertiti / visited / the temple',
      },
      {
        id: 'boat', order: 8, title: 'Take a boat trip', imagePosition: '50% 100%',
        correctSentence: 'Nefertiti took a boat trip.', acceptedSentences: ['Nefertiti took a boat trip.'],
        wrongSentences: ['Nefertiti taked a boat trip.', 'Nefertiti takes a boat trip.'], wordHelp: 'Nefertiti / took / a boat trip',
      },
      {
        id: 'sunset', order: 9, title: 'Watch the sunset', imagePosition: '75% 100%',
        correctSentence: 'Nefertiti watched the sunset.', acceptedSentences: ['Nefertiti watched the sunset.'],
        wrongSentences: ['Nefertiti watch the sunset.', 'Nefertiti did watched the sunset.'], wordHelp: 'Nefertiti / watched / the sunset',
      },
      {
        id: 'bed', order: 10, title: 'Go to bed', imagePosition: '100% 100%',
        correctSentence: 'Nefertiti went to bed.', acceptedSentences: ['Nefertiti went to bed.'],
        wrongSentences: ['Nefertiti goed to bed.', 'Nefertiti go to bed.'], wordHelp: 'Nefertiti / went / to bed',
      },
    ],
  },
]
