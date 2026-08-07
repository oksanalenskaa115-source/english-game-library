import { Link } from 'react-router-dom'
import { ProgressBar } from '../../components/progress/ProgressBar'
import { defaultTopics } from '../../data/defaultTopics'
import { getStudentAvatar } from '../../data/studentAvatars'
import { useStudent } from '../../hooks/useStudent'
import { loadGameResults } from '../../services/progress/progressService'
import type { GameType } from '../../types'
import styles from './ProgressPage.module.css'

const gameNames: Record<GameType, string> = { memory: 'Mummy Memory', quest: 'Verb Treasure Quest', storyboard: 'Adventure Storyboard' }
const gameSymbols: Record<GameType, string> = { memory: '◆', quest: '♢', storyboard: '▦' }
const formatTime = (seconds?: number) => seconds === undefined ? '—' : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

export function ProgressPage() {
  const { selectedStudent, openProfilePicker } = useStudent()
  if (!selectedStudent) return <main className={styles.page}><section className={styles.empty}><h1>My Progress</h1><p>Choose an explorer to see progress.</p><button type="button" onClick={openProfilePicker}>Choose Profile</button></section></main>

  const avatar = getStudentAvatar(selectedStudent.avatarId)
  const results = loadGameResults().filter((result) => result.studentId === selectedStudent.id)
  const completedTopics = Array.from(new Map(results.map((result) => [`${result.gameType}:${result.topicId}`, result])).values())
  const starsToNextLevel = selectedStudent.totalStars % 10

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.avatar} aria-hidden="true">{avatar.symbol}</div>
      <div className={styles.identity}><p>My Progress</p><h1>{selectedStudent.name}</h1><span>Level {selectedStudent.level} Explorer</span></div>
      <div className={styles.starTotal}><strong>★ {selectedStudent.totalStars}</strong><span>Total stars</span></div>
      <ProgressBar value={starsToNextLevel} max={10} label={`Progress to Level ${selectedStudent.level + 1}`} />
    </section>

    {results.length === 0 ? <section className={styles.empty}><h2>Your adventure starts here!</h2><p>Play your first game to see your progress!</p><Link to="/">Choose a Game</Link></section> : <>
      <section className={styles.section} aria-labelledby="game-results-title"><div className={styles.sectionTitle}><h2 id="game-results-title">Game Results</h2><span>{results.length} completed attempts</span></div><div className={styles.gameGrid}>
        {(Object.keys(gameNames) as GameType[]).map((gameType) => {
          const topic = defaultTopics.find((item) => item.gameType === gameType)
          const key = topic ? `${gameType}:${topic.id}` : ''
          const stars = selectedStudent.starsByTopic[key] ?? 0
          const completed = selectedStudent.completedGameTypes.includes(gameType)
          return <article className={styles.gameCard} key={gameType}><div className={styles.gameIcon} aria-hidden="true">{gameSymbols[gameType]}</div><div><p>{completed ? 'Completed' : 'Not completed'}</p><h3>{gameNames[gameType]}</h3></div><div className={styles.stars} aria-label={`${stars} stars`}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div><dl><div><dt>Best score</dt><dd>{key && selectedStudent.bestScores[key] !== undefined ? selectedStudent.bestScores[key] : '—'}</dd></div><div><dt>Best time</dt><dd>{formatTime(key ? selectedStudent.bestTimes[key] : undefined)}</dd></div><div><dt>Best accuracy</dt><dd>{key && selectedStudent.accuracyByTopic[key] !== undefined ? `${selectedStudent.accuracyByTopic[key]}%` : '—'}</dd></div><div><dt>Attempts</dt><dd>{key ? selectedStudent.attemptsByTopic[key] ?? 0 : 0}</dd></div></dl></article>
        })}
      </div></section>

      <section className={styles.section}><div className={styles.sectionTitle}><h2>Completed Topics</h2><span>{completedTopics.length}</span></div><div className={styles.topicList}>{completedTopics.map((result) => { const key = `${result.gameType}:${result.topicId}`; return <article key={key}><span>{gameSymbols[result.gameType]}</span><div><strong>{result.topicTitle}</strong><small>{gameNames[result.gameType]}</small></div><div className={styles.topicStars}>{'★'.repeat(selectedStudent.starsByTopic[key] ?? 1)}</div></article> })}</div></section>

      <section className={styles.achievements}><div><p>Achievements</p><h2>{selectedStudent.unlockedAchievementIds.length} of 6 unlocked</h2><span>Complete games and improve your accuracy to collect every badge.</span></div><Link to="/achievements">View Achievements</Link></section>
    </>}
    <Link className={styles.home} to="/">← Back to Home</Link>
  </main>
}
