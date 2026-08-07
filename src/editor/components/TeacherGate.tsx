import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { createTeacherPin, hasTeacherPin, isTeacherUnlocked, verifyTeacherPin } from '../../services/security/teacherPin'
import styles from './TeacherGate.module.css'

export function TeacherGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isTeacherUnlocked())
  const [isCreating, setIsCreating] = useState(!hasTeacherPin())
  const [pin, setPin] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [lockedUntil, setLockedUntil] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    if (!lockedUntil) return
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 250)
    return () => window.clearInterval(timer)
  }, [lockedUntil])

  if (unlocked) return <>{children}</>

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!/^\d{4}$/.test(pin)) return setError('PIN-код должен содержать ровно четыре цифры')
    if (isCreating) {
      if (pin !== confirmation) return setError('PIN-коды не совпадают')
      await createTeacherPin(pin)
      setUnlocked(true)
      return
    }
    const result = await verifyTeacherPin(pin)
    if (result.ok) setUnlocked(true)
    else if (result.lockedUntil) {
      setLockedUntil(result.lockedUntil)
      setError('Слишком много попыток. Ввод временно заблокирован')
    } else setError('Неверный PIN-код')
    setPin('')
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>English Game Library</p>
        <h1>{isCreating ? 'Создание PIN-кода учителя' : 'Вход для учителя'}</h1>
        <p>{isCreating ? 'Придумайте четыре цифры и повторите их. PIN сохранится только на этом устройстве.' : 'Введите четырёхзначный PIN-код.'}</p>
        <form onSubmit={submit}>
          <label htmlFor="teacher-pin">PIN-код</label>
          <input id="teacher-pin" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))} disabled={secondsLeft > 0} autoFocus />
          {isCreating && <><label htmlFor="teacher-pin-confirm">Повторите PIN-код</label><input id="teacher-pin-confirm" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={confirmation} onChange={(event) => setConfirmation(event.target.value.replace(/\D/g, ''))} /></>}
          {error && <p className={styles.error} role="alert">{error}{secondsLeft > 0 ? `: ${secondsLeft} сек.` : ''}</p>}
          <button type="submit" disabled={secondsLeft > 0}>{isCreating ? 'Сохранить PIN' : 'Войти'}</button>
        </form>
        <p className={styles.note}>Это защита от случайного входа ребёнка, а не интернет-аккаунт.</p>
      </section>
    </main>
  )
}
