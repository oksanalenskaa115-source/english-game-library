import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameCard } from '../../components/cards/GameCard'
import { HowToPlayModal } from '../../components/modals/HowToPlayModal'
import { defaultTopics, type DefaultTopic } from '../../data/defaultTopics'
import { howToPlayInstructions } from '../../data/howToPlay'
import { useStudent } from '../../hooks/useStudent'
import styles from './HomePage.module.css'
import { publicAsset } from '../../utils/publicAsset'

export function HomePage() {
  const navigate = useNavigate()
  const [instructionTopic, setInstructionTopic] = useState<DefaultTopic | null>(null)
  const { selectedStudent, openProfilePicker } = useStudent()
  const topics = defaultTopics.map((topic) => {
    if (!selectedStudent) return topic
    const key = `${topic.gameType}:${topic.id}`
    return {
      ...topic,
      stars: (selectedStudent.starsByTopic[key] ?? 0) as 0 | 1 | 2 | 3,
      bestScore: selectedStudent.bestScores[key] ?? null,
      completed: selectedStudent.completedTopicIds.includes(topic.id),
    }
  })

  const openGame = (topic: DefaultTopic) => {
    if (!selectedStudent) {
      openProfilePicker()
      return
    }

    navigate(topic.route)
  }

  const startGame = (topic: DefaultTopic) => {
    setInstructionTopic(null)
    openGame(topic)
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="library-title">
        <div className={styles.welcome}>
          <span className={styles.welcomeIcon} aria-hidden="true">𓃠</span>
          <p><strong>Welcome, Explorer!</strong><br />Ready for an English adventure?</p>
        </div>

        <div className={styles.brandSign}>
          <span className={styles.scarab} aria-hidden="true">◆</span>
          <p className={styles.brandTop}>English Game</p>
          <h1 id="library-title">Library</h1>
          <p className={styles.tagline}>Play <span>•</span> Learn <span>•</span> Adventure</p>
        </div>

        <div className={styles.heroPortrait}>
          <img
            className={styles.heroPortraitBackdrop}
            src={publicAsset('images/optimized/victory-screen.webp')}
            alt=""
            aria-hidden="true"
          />
          <img
            className={styles.heroPortraitImage}
            src={publicAsset('images/optimized/victory-screen.webp')}
            alt="A young explorer holding a golden scarab in Ancient Egypt"
          />
        </div>
      </section>

      <section className={styles.library} id="game-library" aria-labelledby="games-title">
        <div className={styles.sectionTitle}>
          <span aria-hidden="true">◈</span>
          <h2 id="games-title">Choose Your Game</h2>
          <span aria-hidden="true">◈</span>
        </div>

        <div className={styles.gameGrid}>
          {topics.map((topic, index) => (
            <GameCard
              key={topic.id}
              number={index + 1}
              topic={topic}
              onPlay={() => openGame(topic)}
              onHowToPlay={() => setInstructionTopic(topic)}
            />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>Build skills. Gain stars. Become an English hero!</p>
        <button type="button" onClick={() => navigate('/teacher')}>Teacher Editor</button>
        <p>Your profiles and progress stay on this device.</p>
      </footer>

      {instructionTopic && (
        <HowToPlayModal
          instructions={howToPlayInstructions[instructionTopic.gameType]}
          onClose={() => setInstructionTopic(null)}
          onStart={() => startGame(instructionTopic)}
        />
      )}
    </main>
  )
}
