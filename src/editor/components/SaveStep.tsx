import type { EditorTopic } from '../types'

export function SaveStep({ topic, onDraft, onPublish }: { topic: EditorTopic; onDraft: () => void; onPublish: () => void }) {
  const count = topic.gameType === 'memory' ? topic.pairs.length : topic.gameType === 'quest' ? topic.questions.length : topic.cards.length
  return <section className="editorSave"><p>Шаг 4</p><h2>Save</h2><dl><div><dt>Тема</dt><dd>{topic.title || 'Без названия'}</dd></div><div><dt>Игра</dt><dd>{topic.gameType}</dd></div><div><dt>Элементов</dt><dd>{count}</dd></div><div><dt>Текущий статус</dt><dd>{topic.status}</dd></div></dl><p>Черновик можно сохранить незавершённым. Для публикации все поля и ограничения должны пройти проверку.</p><div><button type="button" onClick={onDraft}>SAVE AS DRAFT</button><button type="button" onClick={onPublish}>SAVE AND PUBLISH</button></div></section>
}
