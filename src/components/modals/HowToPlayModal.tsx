import { PrimaryButton } from '../buttons/PrimaryButton'
import type { HowToPlayInstructions } from '../../data/howToPlay'
import { Modal } from './Modal'
import styles from './HowToPlayModal.module.css'

interface HowToPlayModalProps {
  instructions: HowToPlayInstructions
  onClose: () => void
  onStart: () => void
}

export function HowToPlayModal({ instructions, onClose, onStart }: HowToPlayModalProps) {
  return (
    <Modal
      isOpen
      title={instructions.title}
      onClose={onClose}
      footer={<PrimaryButton onClick={onStart}>Start Game</PrimaryButton>}
    >
      <div className={styles.instructions} data-game={instructions.gameType}>
        <div className={styles.illustration}>
          <img
            className={styles.illustrationBackdrop}
            src={instructions.illustration}
            alt=""
            aria-hidden="true"
            style={{ objectPosition: instructions.illustrationPosition }}
          />
          <img
            className={styles.illustrationImage}
            src={instructions.illustration}
            alt={instructions.illustrationAlt}
            style={{ objectPosition: instructions.illustrationPosition }}
          />
        </div>

        <p className={styles.subtitle}>{instructions.subtitle}</p>

        <ol className={styles.steps}>
          {instructions.steps.map((step, index) => (
            <li key={step}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <div className={styles.details}>
          <section>
            <h3><span aria-hidden="true">★</span> Points</h3>
            <p>{instructions.points}</p>
          </section>
          <section>
            <h3><span aria-hidden="true">◆</span> Reward</h3>
            <p>{instructions.reward}</p>
          </section>
        </div>
      </div>
    </Modal>
  )
}
