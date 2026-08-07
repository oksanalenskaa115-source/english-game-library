import type { EditorTopic } from '../types'

const clean = (value: string) => value.trim().toLocaleLowerCase()

export function validateGeneral(topic: EditorTopic) {
  const errors: string[] = []
  if (!topic.title.trim()) errors.push('Введите название темы')
  else if (topic.title.trim().length < 3 || topic.title.trim().length > 80) errors.push('Название должно содержать от 3 до 80 символов')
  if (!topic.description.trim()) errors.push('Введите короткое описание')
  if (topic.description.length > 180) errors.push('Описание должно содержать не более 180 символов')
  return errors
}

export function validateContent(topic: EditorTopic) {
  const errors: string[] = []
  if (topic.gameType === 'memory') {
    if (topic.pairs.length < 4) errors.push('Для игры нужно минимум 4 пары')
    if (topic.pairs.length > 20) errors.push('Для игры можно добавить максимум 20 пар')
    topic.pairs.forEach((pair, index) => {
      if (!pair.base.trim()) errors.push(`Пара ${index + 1}: добавьте начальную форму глагола`)
      if (!pair.past.trim()) errors.push(`Пара ${index + 1}: добавьте Past Simple форму глагола`)
    })
    const pairs = topic.pairs.map((pair) => `${clean(pair.base)}|${clean(pair.past)}`)
    if (new Set(pairs).size !== pairs.length) errors.push('Такая пара глаголов уже есть')
  }
  if (topic.gameType === 'quest') {
    if (topic.questions.length < 5) errors.push('Для игры нужно минимум 5 вопросов')
    if (topic.questions.length > 30) errors.push('Для игры можно добавить максимум 30 вопросов')
    topic.questions.forEach((question, index) => {
      if ((question.sentence.match(/___/g) ?? []).length !== 1) errors.push(`Вопрос ${index + 1}: добавьте в предложение один пропуск ___`)
      if (!question.verb.trim()) errors.push(`Вопрос ${index + 1}: укажите глагол в скобках`)
      if (question.options.some((option) => !option.trim())) errors.push(`Вопрос ${index + 1}: заполните все три варианта ответа`)
      if (new Set(question.options.map(clean)).size !== 3) errors.push(`Вопрос ${index + 1}: варианты ответа должны различаться`)
      if (question.correctIndex === null) errors.push(`Вопрос ${index + 1}: выберите правильный ответ`)
      if (!question.hint.trim()) errors.push(`Вопрос ${index + 1}: добавьте грамматическую подсказку`)
      if (!question.explanation.trim()) errors.push(`Вопрос ${index + 1}: добавьте объяснение`)
    })
  }
  if (topic.gameType === 'storyboard') {
    if (topic.cards.length < 10) errors.push('Для истории нужно минимум 10 карточек')
    if (topic.cards.length > 20) errors.push('Для истории можно добавить максимум 20 карточек')
    topic.cards.forEach((card, index) => {
      if (!card.image) errors.push(`Карточка ${index + 1}: загрузите изображение`)
      if (!card.correctSentence.trim()) errors.push(`Карточка ${index + 1}: добавьте правильное предложение`)
      if (!card.title.trim()) errors.push(`Карточка ${index + 1}: добавьте название события`)
    })
    const numbers = topic.cards.map((card) => card.eventNumber)
    if (new Set(numbers).size !== numbers.length) errors.push('Номера событий не должны повторяться')
    if (numbers.some((number) => !Number.isInteger(number) || number < 1 || number > topic.cards.length)) errors.push('Номера событий должны быть от 1 до количества карточек')
  }
  return errors
}

export function validateTopic(topic: EditorTopic) {
  return [...validateGeneral(topic), ...validateContent(topic)]
}
