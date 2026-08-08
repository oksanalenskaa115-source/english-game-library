import type { QuestQuestionData } from './questTypes'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  question: QuestQuestionData
  selectedIndexes: number[]
  isResolved: boolean
  shotIndex: number | null
  shotId: number
  onSelect: (index: 0 | 1 | 2) => void
}

const optionLabels = ['A', 'B', 'C'] as const

export function QuestionCard({
  question,
  selectedIndexes,
  isResolved,
  shotIndex,
  shotId,
  onSelect,
}: QuestionCardProps) {
  return (
    <section className={styles.card} aria-labelledby={`question-${question.id}`}>
      <div className={styles.questionPanel}>
        <span className={styles.mission}>Choose the right form and shoot!</span>
        <p id={`question-${question.id}`}>{question.sentence}</p>
        <span className={styles.verb}>({question.verb})</span>
      </div>

      <div className={styles.options} role="group" aria-label="Magical answer targets">
        {question.options.map((option, index) => {
          const typedIndex = index as 0 | 1 | 2
          const isSelected = selectedIndexes.includes(index)
          const isCorrect = index === question.correctIndex
          const showCorrect = isResolved && isCorrect
          const showWrong = isSelected && !isCorrect
          const classes = [
            styles.target,
            showCorrect ? styles.correct : '',
            showWrong ? styles.wrong : '',
          ].filter(Boolean).join(' ')

          return (
            <button
              className={classes}
              key={`${question.id}-${option}-${index}`}
              type="button"
              onClick={() => onSelect(typedIndex)}
              disabled={isResolved || showWrong}
              aria-label={`Target ${optionLabels[index]}: ${option}${showCorrect ? '. Correct answer' : showWrong ? '. Incorrect answer' : ''}`}
            >
              <span className={styles.optionLabel}>{optionLabels[index]}</span>
              <span className={styles.optionText}>{option}</span>
              <span className={styles.crosshair} aria-hidden="true" />
              {shotIndex === index && (
                <span className={styles.impact} key={`${shotId}-${index}`} aria-hidden="true" />
              )}
              {showCorrect && <span className={styles.resultIcon} aria-hidden="true">&#10022;</span>}
              {showWrong && <span className={styles.resultIcon} aria-hidden="true">&#10005;</span>}
            </button>
          )
        })}
      </div>

    </section>
  )
}
