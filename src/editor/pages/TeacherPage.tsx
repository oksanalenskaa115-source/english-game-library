import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { TeacherGate } from '../components/TeacherGate'
import type { EditorTopic } from '../types'
import { deleteTopic, listTopics, saveTopic } from '../../services/storage/topicDatabase'
import { lockTeacherSession } from '../../services/security/teacherPin'
import styles from './TeacherPage.module.css'

const gameNames = { memory: 'Mummy Memory', quest: 'Temple Door Challenge', storyboard: 'Adventure Storyboard' }

function downloadTopic(topic: EditorTopic) {
  const blob = new Blob([JSON.stringify(topic, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${topic.title.trim().replace(/[^a-zа-я0-9]+/gi, '-') || 'topic'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function TeacherPage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [topics, setTopics] = useState<EditorTopic[]>([])
  const [message, setMessage] = useState('')

  const refresh = async () => {
    try { setTopics(await listTopics()) } catch { setMessage('Не удалось открыть локальное хранилище тем') }
  }
  useEffect(() => { void refresh() }, [])

  const duplicate = async (topic: EditorTopic) => {
    const copy = { ...structuredClone(topic), id: crypto.randomUUID(), title: `Copy of ${topic.title}`, status: 'draft' as const, updatedAt: new Date().toISOString() }
    await saveTopic(copy)
    setMessage('Копия темы создана как черновик')
    await refresh()
  }

  const remove = async (topic: EditorTopic) => {
    if (!window.confirm(`Удалить тему «${topic.title}»? Это действие нельзя отменить.`)) return
    await deleteTopic(topic.id)
    setMessage('Тема удалена')
    await refresh()
  }

  const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 20 * 1024 * 1024) return setMessage('JSON слишком большой. Максимальный размер — 20 МБ')
    try {
      const value: unknown = JSON.parse(await file.text())
      if (!value || typeof value !== 'object' || !('gameType' in value) || !('title' in value) || !('id' in value)) throw new Error()
      const topic = value as EditorTopic
      if (!['memory', 'quest', 'storyboard'].includes(topic.gameType)) throw new Error()
      if (topic.gameType === 'memory' && !Array.isArray(topic.pairs)) throw new Error()
      if (topic.gameType === 'quest' && !Array.isArray(topic.questions)) throw new Error()
      if (topic.gameType === 'storyboard' && !Array.isArray(topic.cards)) throw new Error()
      sessionStorage.setItem('egl.pendingImport', JSON.stringify({ ...topic, schemaVersion: 1, id: crypto.randomUUID(), status: 'draft', updatedAt: new Date().toISOString() }))
      navigate('/teacher/topic/new?import=1')
    } catch { setMessage('Не удалось прочитать JSON. Проверьте файл') }
  }

  return (
    <TeacherGate>
      <main className={styles.page}>
        <header className={styles.header}>
          <div><p>English Game Library</p><h1>Teacher Editor</h1><span>Темы сохраняются только на этом устройстве.</span></div>
          <div><button type="button" onClick={() => navigate('/')}>На главную</button><button type="button" onClick={() => { lockTeacherSession(); window.location.reload() }}>Закрыть редактор</button></div>
        </header>
        <section className={styles.toolbar}>
          <button type="button" onClick={() => navigate('/teacher/topic/new')}>＋ Создать новую тему</button>
          <button type="button" onClick={() => inputRef.current?.click()}>Импортировать JSON</button>
          <input ref={inputRef} type="file" accept="application/json,.json" onChange={importJson} hidden />
        </section>
        {message && <p className={styles.message} role="status">{message}</p>}
        {topics.length === 0 ? <section className={styles.empty}><h2>Пока нет пользовательских тем</h2><p>Создайте первую тему с помощью пошагового мастера.</p></section> : (
          <section className={styles.grid} aria-label="Список тем">
            {topics.map((topic) => <article className={styles.card} key={topic.id}>
              <div className={styles.cover}>{topic.coverImage ? <img src={topic.coverImage.dataUrl} alt="" /> : <span>{topic.gameType === 'memory' ? '◆' : topic.gameType === 'quest' ? '?' : '▦'}</span>}</div>
              <div className={styles.cardBody}><div className={styles.badges}><span>{gameNames[topic.gameType]}</span><span className={topic.status === 'published' ? styles.published : styles.draft}>{topic.status === 'published' ? 'Published' : 'Draft'}</span></div><h2>{topic.title || 'Без названия'}</h2><p>{topic.description || 'Описание пока не добавлено'}</p></div>
              <div className={styles.actions}><button type="button" onClick={() => navigate(`/teacher/topic/${topic.id}/edit`)}>Изменить</button><button type="button" onClick={() => navigate(`/teacher/topic/${topic.id}/edit?preview=1`)}>Просмотр</button><button type="button" onClick={() => duplicate(topic)}>Дублировать</button><button type="button" onClick={() => downloadTopic(topic)}>Экспорт JSON</button><button className={styles.delete} type="button" onClick={() => remove(topic)}>Удалить</button></div>
            </article>)}
          </section>
        )}
      </main>
    </TeacherGate>
  )
}
