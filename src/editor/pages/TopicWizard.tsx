import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { TeacherGate } from '../components/TeacherGate'
import { GeneralStep } from '../components/GeneralStep'
import { ContentStep } from '../components/ContentStep'
import { PreviewStep } from '../components/PreviewStep'
import { SaveStep } from '../components/SaveStep'
import { createEmptyTopic, type EditorTopic } from '../types'
import { getTopic, saveTopic } from '../../services/storage/topicDatabase'
import { validateContent, validateGeneral, validateTopic } from '../validation/topicValidation'
import styles from './TopicWizard.module.css'

const stepNames = ['General Information', 'Add Content', 'Preview', 'Save']

export function TopicWizard() {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const [searchParams] = useSearchParams()
  const [topic, setTopic] = useState<EditorTopic>(() => createEmptyTopic())
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(Boolean(topicId) || searchParams.has('import'))
  const errorsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (errors.length > 0) errorsRef.current?.focus()
  }, [errors])

  useEffect(() => {
    const load = async () => {
      if (searchParams.has('import')) {
        const raw = sessionStorage.getItem('egl.pendingImport')
        sessionStorage.removeItem('egl.pendingImport')
        if (raw) {
          try {
            const imported = JSON.parse(raw) as EditorTopic
            setTopic(imported)
            const importErrors = validateTopic(imported)
            setErrors(importErrors)
            setStep(importErrors.length ? 1 : 3)
            setDirty(true)
          } catch { setErrors(['В импортируемой теме отсутствуют обязательные поля']) }
        }
      } else if (topicId) {
        const stored = await getTopic(topicId)
        if (stored) {
          setTopic(stored)
          if (searchParams.has('preview')) {
            const previewErrors = validateTopic(stored)
            setErrors(previewErrors)
            setStep(previewErrors.length ? 1 : 3)
          }
        } else setErrors(['Тема не найдена'])
      }
      setLoading(false)
    }
    void load()
  }, [searchParams, topicId])

  const changeTopic = (value: EditorTopic) => { setTopic(value); setDirty(true); setErrors([]) }

  const next = () => {
    const nextErrors = step === 1 ? validateGeneral(topic) : step === 2 ? validateContent(topic) : []
    if (nextErrors.length) { setErrors(nextErrors); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    setErrors([])
    setStep((current) => Math.min(4, current + 1))
    window.scrollTo({ top: 0 })
  }

  const cancel = () => {
    if (dirty && !window.confirm('Отменить редактирование? Несохранённые изменения будут потеряны.')) return
    navigate('/teacher')
  }

  const store = async (status: 'draft' | 'published') => {
    if (status === 'published') {
      const publishErrors = validateTopic(topic)
      if (publishErrors.length) { setErrors(publishErrors); setStep(1); window.scrollTo({ top: 0 }); return }
    }
    const prepared = { ...topic, title: topic.title.trim() || 'Черновик без названия', status, updatedAt: new Date().toISOString() } as EditorTopic
    try {
      await saveTopic(prepared)
      setDirty(false)
      navigate('/teacher')
    } catch { setErrors(['Не удалось сохранить тему. Проверьте настройки браузера']) }
  }

  if (loading) return <TeacherGate><main className={styles.loading}>Загрузка темы…</main></TeacherGate>

  return <TeacherGate><main className={styles.page}>
    <header className={styles.header}><div><p>Teacher Editor</p><h1>{topicId ? 'Редактирование темы' : 'Новая тема'}</h1></div><button type="button" onClick={cancel}>CANCEL</button></header>
    <nav className={styles.steps} aria-label="Шаги редактора">{stepNames.map((name, index) => <button type="button" key={name} className={step === index + 1 ? styles.current : step > index + 1 ? styles.done : ''} onClick={() => { if (index + 1 < step) setStep(index + 1) }}><span>{index + 1}</span>{name}</button>)}</nav>
    {errors.length > 0 && <section className={styles.errors} role="alert" tabIndex={-1} ref={errorsRef}><strong>Проверьте заполнение:</strong><ul>{errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></section>}
    <div className={styles.content}>
      {step === 1 && <GeneralStep topic={topic} onChange={changeTopic} />}
      {step === 2 && <ContentStep topic={topic} onChange={changeTopic} />}
      {step === 3 && <PreviewStep topic={topic} onBack={() => setStep(2)} />}
      {step === 4 && <SaveStep topic={topic} onDraft={() => void store('draft')} onPublish={() => void store('published')} />}
    </div>
    <footer className={styles.footer}><div><button type="button" onClick={step === 1 ? cancel : () => setStep((current) => Math.max(1, current - 1))}>{step === 1 ? 'CANCEL' : 'BACK'}</button><button type="button" onClick={() => void store('draft')}>SAVE AS DRAFT</button></div>{step < 4 && <button type="button" onClick={next}>{step === 3 ? 'CONTINUE TO SAVE' : 'NEXT'} →</button>}</footer>
  </main></TeacherGate>
}
