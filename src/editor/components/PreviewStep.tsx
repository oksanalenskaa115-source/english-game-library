import type { EditorTopic } from '../types'
import { MemoryGame } from '../../games/memory/MemoryGame'
import { QuestGame } from '../../games/quest/QuestGame'
import { StoryboardGame } from '../../games/storyboard/StoryboardGame'

export function PreviewStep({ topic, onBack }: { topic: EditorTopic; onBack: () => void }) {
  const game = topic.gameType === 'memory'
    ? <MemoryGame saveProgress={false} topic={{ id: topic.id, title: topic.title, description: topic.description, pairs: topic.pairs.map(({ id, base, past }) => ({ id, base, past })) }} />
    : topic.gameType === 'quest'
      ? <QuestGame saveProgress={false} topic={{ id: topic.id, title: topic.title, description: topic.description, questions: topic.questions.map((question) => ({ ...question, correctIndex: question.correctIndex as 0 | 1 | 2 })) }} />
      : <StoryboardGame saveProgress={false} topic={{ id: topic.id, title: topic.title, description: topic.description, cards: [...topic.cards].sort((a, b) => a.eventNumber - b.eventNumber).map((card) => ({ id: card.id, order: card.eventNumber, title: card.title, imagePosition: 'center', imageUrl: card.image?.dataUrl, correctSentence: card.correctSentence, acceptedSentences: [card.correctSentence], wrongSentences: card.wrongSentences, wordHelp: card.wordHelp })) }} />

  return <section><div className="editorPreviewBar"><strong>Preview mode</strong><span>Результат игры не сохраняется в профиль ученика.</span><button type="button" onClick={onBack}>Вернуться к редактированию</button></div>{game}</section>
}
