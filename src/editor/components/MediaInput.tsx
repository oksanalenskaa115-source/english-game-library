import { useState, type ChangeEvent } from 'react'
import type { EditorMedia } from '../types'

interface MediaInputProps {
  label: string
  value?: EditorMedia
  accept: string
  maxMb?: number
  onChange: (media?: EditorMedia) => void
}

export function MediaInput({ label, value, accept, maxMb = 5, onChange }: MediaInputProps) {
  const [error, setError] = useState('')
  const readFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > maxMb * 1024 * 1024) return setError(`Файл слишком большой. Максимальный размер — ${maxMb} МБ`)
    const reader = new FileReader()
    reader.onload = () => { onChange({ name: file.name, type: file.type, dataUrl: String(reader.result) }); setError('') }
    reader.onerror = () => setError('Не удалось прочитать файл')
    reader.readAsDataURL(file)
  }
  return <div>
    <label>{label}<input type="file" accept={accept} onChange={readFile} /></label>
    {value && <p>Выбран файл: <strong>{value.name}</strong> <button type="button" onClick={() => onChange(undefined)}>Убрать</button></p>}
    {error && <p role="alert">{error}</p>}
  </div>
}
