import { useState } from 'react'
import type { EditorMemoryPair, EditorQuestQuestion, EditorStoryCard, EditorTopic } from '../types'
import { MediaInput } from './MediaInput'

const newId = () => crypto.randomUUID()

export function ContentStep({ topic, onChange }: { topic: EditorTopic; onChange: (topic: EditorTopic) => void }) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  if (topic.gameType === 'memory') {
    const update = (index: number, value: EditorMemoryPair) => onChange({ ...topic, pairs: topic.pairs.map((pair, itemIndex) => itemIndex === index ? value : pair) })
    return <section><h2>Шаг 2 — Add Content: Mummy Memory</h2><p>Добавьте от 4 до 20 уникальных пар.</p>
      <div className="editorItems">{topic.pairs.map((pair, index) => <article className="editorItem" key={pair.id}><header><strong>Пара {index + 1}</strong><button type="button" onClick={() => onChange({ ...topic, pairs: topic.pairs.filter((_, itemIndex) => itemIndex !== index) })}>Удалить</button></header><div className="editorFormGrid"><label>Base verb *<input value={pair.base} onChange={(event) => update(index, { ...pair, base: event.target.value })} /></label><label>Past Simple form *<input value={pair.past} onChange={(event) => update(index, { ...pair, past: event.target.value })} /></label><MediaInput label="Дополнительная картинка" value={pair.image} accept="image/*" onChange={(image) => update(index, { ...pair, image })} /><MediaInput label="Дополнительное аудио" value={pair.audio} accept="audio/*" maxMb={10} onChange={(audio) => update(index, { ...pair, audio })} /></div></article>)}</div>
      <button className="editorAdd" type="button" disabled={topic.pairs.length >= 20} onClick={() => onChange({ ...topic, pairs: [...topic.pairs, { id: newId(), base: '', past: '' }] })}>＋ ADD VERB PAIR</button></section>
  }

  if (topic.gameType === 'quest') {
    const update = (index: number, value: EditorQuestQuestion) => onChange({ ...topic, questions: topic.questions.map((question, itemIndex) => itemIndex === index ? value : question) })
    return <section><h2>Шаг 2 — Add Content: Temple Door Challenge</h2><p>Добавьте от 5 до 30 вопросов. В предложении нужен один пропуск ___.</p>
      <div className="editorItems">{topic.questions.map((question, index) => <article className="editorItem" key={question.id}><header><strong>Вопрос {index + 1}</strong><button type="button" onClick={() => onChange({ ...topic, questions: topic.questions.filter((_, itemIndex) => itemIndex !== index) })}>Удалить</button></header><div className="editorFormGrid">
        <label className="editorWide">Предложение *<input value={question.sentence} placeholder="She ___ the treasure yesterday." onChange={(event) => update(index, { ...question, sentence: event.target.value })} /></label><label>Глагол в скобках *<input value={question.verb} onChange={(event) => update(index, { ...question, verb: event.target.value })} /></label>
        {question.options.map((option, optionIndex) => <label key={optionIndex}>Вариант {String.fromCharCode(65 + optionIndex)} *<input value={option} onChange={(event) => { const options = [...question.options] as [string, string, string]; options[optionIndex] = event.target.value; update(index, { ...question, options }) }} /></label>)}
        <label>Правильный ответ *<select value={question.correctIndex ?? ''} onChange={(event) => update(index, { ...question, correctIndex: event.target.value === '' ? null : Number(event.target.value) as 0 | 1 | 2 })}><option value="">Выберите…</option><option value="0">A</option><option value="1">B</option><option value="2">C</option></select></label><label>Грамматическая подсказка *<input value={question.hint} onChange={(event) => update(index, { ...question, hint: event.target.value })} /></label><label className="editorWide">Объяснение *<input value={question.explanation} onChange={(event) => update(index, { ...question, explanation: event.target.value })} /></label><MediaInput label="Дополнительная картинка" value={question.image} accept="image/*" onChange={(image) => update(index, { ...question, image })} />
      </div></article>)}</div>
      <button className="editorAdd" type="button" disabled={topic.questions.length >= 30} onClick={() => onChange({ ...topic, questions: [...topic.questions, { id: newId(), sentence: '', verb: '', options: ['', '', ''], correctIndex: null, hint: '', explanation: '' }] })}>＋ ADD QUESTION</button></section>
  }

  const update = (index: number, value: EditorStoryCard) => onChange({ ...topic, cards: topic.cards.map((card, itemIndex) => itemIndex === index ? value : card) })
  const move = (from: number, to: number) => {
    if (to < 0 || to >= topic.cards.length) return
    const cards = [...topic.cards]
    const [card] = cards.splice(from, 1)
    cards.splice(to, 0, card)
    onChange({ ...topic, cards })
  }
  return <section><h2>Шаг 2 — Add Content: Adventure Storyboard</h2><p>Добавьте от 10 до 20 карточек. Картинка и правильное предложение обязательны.</p><button type="button" onClick={() => onChange({ ...topic, cards: topic.cards.map((card, index) => ({ ...card, eventNumber: index + 1 })) })}>Перенумеровать по порядку</button>
    <div className="editorItems">{topic.cards.map((card, index) => <article className="editorItem" key={card.id} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null) move(dragIndex, index); setDragIndex(null) }}><header><strong>Карточка {index + 1}</strong><div><button type="button" disabled={index === 0} onClick={() => move(index, index - 1)}>Move Up</button><button type="button" disabled={index === topic.cards.length - 1} onClick={() => move(index, index + 1)}>Move Down</button><button type="button" onClick={() => { const cards = [...topic.cards]; cards.splice(index + 1, 0, { ...structuredClone(card), id: newId(), eventNumber: topic.cards.length + 1 }); onChange({ ...topic, cards }) }}>Duplicate</button><button type="button" onClick={() => onChange({ ...topic, cards: topic.cards.filter((_, itemIndex) => itemIndex !== index) })}>Delete</button></div></header><div className="editorFormGrid">
      <label>Номер события *<input type="number" min="1" max={topic.cards.length} value={card.eventNumber} onChange={(event) => update(index, { ...card, eventNumber: Number(event.target.value) })} /></label><label>Название события *<input value={card.title} onChange={(event) => update(index, { ...card, title: event.target.value })} /></label><MediaInput label="Картинка *" value={card.image} accept="image/*" onChange={(image) => update(index, { ...card, image })} /><label className="editorWide">Правильное предложение *<input value={card.correctSentence} onChange={(event) => update(index, { ...card, correctSentence: event.target.value })} /></label>
      {card.wrongSentences.map((sentence, sentenceIndex) => <label key={sentenceIndex}>Неправильное предложение {sentenceIndex + 1}<input value={sentence} onChange={(event) => { const wrongSentences = [...card.wrongSentences] as [string, string]; wrongSentences[sentenceIndex] = event.target.value; update(index, { ...card, wrongSentences }) }} /></label>)}<label>Помощь со словами<input value={card.wordHelp} onChange={(event) => update(index, { ...card, wordHelp: event.target.value })} /></label><MediaInput label="Дополнительное аудио" value={card.audio} accept="audio/*" maxMb={10} onChange={(audio) => update(index, { ...card, audio })} />
    </div></article>)}</div>
    <button className="editorAdd" type="button" disabled={topic.cards.length >= 20} onClick={() => onChange({ ...topic, cards: [...topic.cards, { id: newId(), eventNumber: topic.cards.length + 1, title: '', correctSentence: '', wrongSentences: ['', ''], wordHelp: '' }] })}>＋ ADD STORY CARD</button></section>
}
