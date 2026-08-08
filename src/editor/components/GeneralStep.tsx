import type { EditorTopic } from '../types'
import { createEmptyTopic, topicContentCount } from '../types'
import type { GameType } from '../../types'
import { MediaInput } from './MediaInput'

export function GeneralStep({ topic, onChange }: { topic: EditorTopic; onChange: (topic: EditorTopic) => void }) {
  const changeType = (gameType: GameType) => {
    if (gameType === topic.gameType) return
    if (topicContentCount(topic) > 0 && !window.confirm('При смене типа игры добавленное содержимое будет удалено. Продолжить?')) return
    const empty = createEmptyTopic(gameType)
    onChange({ ...empty, id: topic.id, title: topic.title, description: topic.description, difficulty: topic.difficulty, maxStars: topic.maxStars, status: topic.status, coverImage: topic.coverImage } as EditorTopic)
  }
  return <section>
    <h2>Шаг 1 — General Information</h2>
    <div className="editorFormGrid">
      <label>Название темы *<input value={topic.title} maxLength={80} onChange={(event) => onChange({ ...topic, title: event.target.value })} /></label>
      <label>Тип игры *<select value={topic.gameType} onChange={(event) => changeType(event.target.value as GameType)}><option value="memory">Mummy Memory</option><option value="quest">Temple Door Challenge</option><option value="storyboard">Adventure Storyboard</option></select></label>
      <label className="editorWide">Короткое описание *<textarea value={topic.description} maxLength={180} rows={3} onChange={(event) => onChange({ ...topic, description: event.target.value })} /><small>{topic.description.length} / 180</small></label>
      <label>Сложность<select value={topic.difficulty} onChange={(event) => onChange({ ...topic, difficulty: event.target.value as EditorTopic['difficulty'] })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></label>
      <label>Звёзд за прохождение<select value={topic.maxStars} onChange={(event) => onChange({ ...topic, maxStars: Number(event.target.value) as 1 | 2 | 3 })}><option value="1">1</option><option value="2">2</option><option value="3">3 (рекомендуется)</option></select></label>
      <label>Статус<select value={topic.status} onChange={(event) => onChange({ ...topic, status: event.target.value as EditorTopic['status'] })}><option value="draft">Draft</option><option value="published">Published</option></select></label>
      <div className="editorWide"><MediaInput label="Изображение обложки (JPG, PNG или WebP, до 5 МБ)" value={topic.coverImage} accept="image/jpeg,image/png,image/webp" onChange={(coverImage) => onChange({ ...topic, coverImage })} /></div>
    </div>
  </section>
}
