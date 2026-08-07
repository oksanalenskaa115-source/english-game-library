import type { QuestQuestionData } from './questTypes'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  question: QuestQuestionData
  selectedIndexes: number[]
  isResolved: boolean
  wasRevealed: boolean
  onSelect: (index: 0 | 1 | 2) => void
}

const optionLabels = ['A', 'B', 'C'] as const

export function QuestionCard({ question, selectedIndexes, isResolved, wasRevealed, onSelect }: QuestionCardProps) {
  return (
    <section className={styles.card} aria-labelledby={`question-${question.id}`}>
      <div className={styles.sentenceBlock}>
        <p id={`question-${question.id}`}>{question.sentence}</p>
        <span>({question.verb})</span>
      </div>

      <div className={styles.options} role="group" aria-label="Answer choices">
        {question.options.map((option, index) => {
          const typedIndex = index as 0 | 1 | 2
          const isSelected = selectedIndexes.includes(index)
          const isCorrect = index === question.correctIndex
          const showCorrect = isResolved && isCorrect
          const showWrong = isSelected && !isCorrect
          const classes = [
            styles.option,
            showCorrect ? styles.correct : '',
            showWrong ? styles.wrong : '',
          ].filter(Boolean).join(' ')

          return (
            <button
              className={classes}
              key={`${option}-${index}`}
              type="button"
              onClick={() => onSelect(typedIndex)}
              disabled={isResolved || showWrong}
              aria-label={`${optionLabels[index]}. ${option}${showCorrect ? '. Correct answer' : showWrong ? '. Incorrect answer' : ''}`}
            >
              <span className={styles.optionLabel}>{optionLabels[index]}</span>
              <span className={styles.optionText}>{option}</span>
              {showCorrect && <span className={styles.resultIcon} aria-hidden="true">✓</span>}
              {showWrong && <span className={styles.resultIcon} aria-hidden="true">×</span>}
            </button>
          )
        })}
      </div>

      {wasRevealed && <p className={styles.revealed}>The correct answer is highlighted above.</p>}
    </section>
  )
}
