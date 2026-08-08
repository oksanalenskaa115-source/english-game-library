import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { publicAsset } from '../../utils/publicAsset'
import { useSound } from '../../hooks/useSound'
import { StoryPicture } from './StoryPicture'
import type { StoryCardData } from './storyboardTypes'
import styles from './ThothScrollRunner.module.css'

interface ThothScrollRunnerProps {
  cards: StoryCardData[]
  onAddScore: (points: number) => void
  onProgress: (completed: number) => void
  onComplete: (successfulLevels: number) => void
}

interface PlayerPosition {
  x: number
  y: number
}

interface WordTablet {
  id: string
  word: string
  order: number
  x: number
  y: number
  collected: boolean
}

const PLAYER_WIDTH = 6
const PLAYER_HEIGHT = 9
const TABLET_WIDTH = 12
const TABLET_HEIGHT = 6
const GROUND_Y = 16

const platforms = [
  { x: 20, width: 16, y: 32 },
  { x: 62, width: 20, y: 32 },
  { x: 39, width: 23, y: 48 },
  { x: 3, width: 21, y: 60 },
  { x: 63, width: 16, y: 57 },
  { x: 84, width: 13, y: 60 },
]

const tabletSlots = [
  { x: 34, y: GROUND_Y + 2 },
  { x: 27, y: 35 },
  { x: 72, y: 35 },
  { x: 50, y: 51 },
  { x: 9, y: 63 },
  { x: 71, y: 60 },
  { x: 86, y: GROUND_Y + 2 },
]

function buildTablets(words: string[], level: number): WordTablet[] {
  const offset = level % tabletSlots.length
  const shiftedSlots = tabletSlots.map((_, index) => tabletSlots[(index + offset) % tabletSlots.length])

  return words.map((word, order) => {
    const slot = shiftedSlots[(order * 2 + level + 1) % shiftedSlots.length]
    return { id: `${level}-${order}-${word}`, word, order, x: slot.x, y: slot.y, collected: false }
  })
}

export function ThothScrollRunner({ cards, onAddScore, onProgress, onComplete }: ThothScrollRunnerProps) {
  const { play } = useSound()
  const [level, setLevel] = useState(0)
  const [player, setPlayer] = useState<PlayerPosition>({ x: 3, y: GROUND_Y })
  const [tablets, setTablets] = useState<WordTablet[]>([])
  const [nextWord, setNextWord] = useState(0)
  const [message, setMessage] = useState('Collect the tablets in the correct sentence order.')
  const [levelComplete, setLevelComplete] = useState(false)
  const [mistake, setMistake] = useState(false)
  const [perfectLevels, setPerfectLevels] = useState(0)

  const keys = useRef({ left: false, right: false })
  const body = useRef({ x: 3, y: GROUND_Y, velocityY: 0, grounded: true })
  const tabletsRef = useRef<WordTablet[]>([])
  const nextWordRef = useRef(0)
  const mistakeRef = useRef(false)
  const perfectLevelsRef = useRef(0)
  const levelCompleteRef = useRef(false)
  const collisionLock = useRef(0)
  const dropThroughUntil = useRef(0)

  const card = cards[level]
  const words = useMemo(() => card.wordHelp.split('/').map((word) => word.trim()).filter(Boolean), [card.wordHelp])

  useEffect(() => {
    const freshTablets = buildTablets(words, level)
    tabletsRef.current = freshTablets
    nextWordRef.current = 0
    mistakeRef.current = false
    levelCompleteRef.current = false
    body.current = { x: 3, y: GROUND_Y, velocityY: 0, grounded: true }
    setPlayer({ x: 3, y: GROUND_Y })
    setTablets(freshTablets)
    setNextWord(0)
    setMistake(false)
    setLevelComplete(false)
    setMessage('Collect the tablets in the correct sentence order.')
  }, [level, words])

  const jump = useCallback(() => {
    if (levelCompleteRef.current || !body.current.grounded) return
    body.current.velocityY = 78
    body.current.grounded = false
    play('move')
  }, [play])

  const dropDown = useCallback(() => {
    if (levelCompleteRef.current || !body.current.grounded || body.current.y <= GROUND_Y) return
    dropThroughUntil.current = performance.now() + 450
    body.current.y -= 1.5
    body.current.velocityY = -28
    body.current.grounded = false
    play('move')
  }, [play])

  useEffect(() => {
    const updateKey = (event: KeyboardEvent, pressed: boolean) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'A', 'd', 'D', 'w', 'W', 's', 'S'].includes(event.key)) event.preventDefault()
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keys.current.left = pressed
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keys.current.right = pressed
      if (pressed && (event.key === 'ArrowUp' || event.key === ' ' || event.key.toLowerCase() === 'w')) jump()
      if (pressed && (event.key === 'ArrowDown' || event.key.toLowerCase() === 's')) dropDown()
    }
    const keyDown = (event: KeyboardEvent) => updateKey(event, true)
    const keyUp = (event: KeyboardEvent) => updateKey(event, false)
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
    }
  }, [dropDown, jump])

  useEffect(() => {
    let frame = 0
    let previousTime = performance.now()

    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.035)
      previousTime = time
      const current = body.current
      const previousY = current.y
      const direction = Number(keys.current.right) - Number(keys.current.left)
      current.x = Math.max(0, Math.min(100 - PLAYER_WIDTH, current.x + direction * 25 * delta))
      current.velocityY -= 105 * delta
      current.y += current.velocityY * delta
      current.grounded = false

      if (current.velocityY <= 0 && time >= dropThroughUntil.current) {
        for (const platform of platforms) {
          const overlaps = current.x + PLAYER_WIDTH > platform.x && current.x < platform.x + platform.width
          if (overlaps && previousY >= platform.y && current.y <= platform.y) {
            current.y = platform.y
            current.velocityY = 0
            current.grounded = true
            break
          }
        }
      }

      if (current.y <= GROUND_Y) {
        current.y = GROUND_Y
        current.velocityY = 0
        current.grounded = true
      }

      if (!levelCompleteRef.current) {
        const colliding = tabletsRef.current.find((tablet) => !tablet.collected
          && current.x + PLAYER_WIDTH > tablet.x
          && current.x < tablet.x + TABLET_WIDTH
          && current.y + PLAYER_HEIGHT > tablet.y
          && current.y < tablet.y + TABLET_HEIGHT)

        if (colliding && time > collisionLock.current) {
          collisionLock.current = time + 700
          if (colliding.order === nextWordRef.current) {
            const updated = tabletsRef.current.map((tablet) => tablet.id === colliding.id ? { ...tablet, collected: true } : tablet)
            tabletsRef.current = updated
            nextWordRef.current += 1
            setTablets(updated)
            setNextWord(nextWordRef.current)
            setMistake(false)
            onAddScore(5)
            play('correct')

            if (nextWordRef.current === words.length) {
              levelCompleteRef.current = true
              setLevelComplete(true)
              onAddScore(10)
              onProgress(level + 1)
              if (!mistakeRef.current) {
                perfectLevelsRef.current += 1
                setPerfectLevels(perfectLevelsRef.current)
              }
              setMessage('The scroll is restored! Thoth’s library glows with golden light.')
              play('levelComplete')
            } else {
              setMessage('Correct word. Keep building the sentence.')
            }
          } else {
            mistakeRef.current = true
            setMistake(true)
            setMessage('That word does not come next. Try a different tablet.')
            play('wrong')
          }
        }
      }

      setPlayer({ x: current.x, y: current.y })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [level, onAddScore, onProgress, play, words])

  const move = (direction: 'left' | 'right', pressed: boolean) => {
    keys.current[direction] = pressed
  }

  const continueJourney = () => {
    if (level === cards.length - 1) {
      onComplete(perfectLevelsRef.current)
      return
    }
    setLevel((current) => current + 1)
  }

  return (
    <section className={styles.stage} aria-labelledby="thoth-stage-title">
      <div className={styles.heading}>
        <div><span>Stage 1 · Scroll {level + 1} of {cards.length}</span><h2 id="thoth-stage-title">Thoth’s Library</h2></div>
        <p>Guide the scarab and collect the words in the correct order.</p>
      </div>

      <div className={`${styles.scroll} ${levelComplete ? styles.scrollComplete : ''}`} aria-label="Restored sentence">
        <strong>Ancient scroll</strong>
        <div>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className={index < nextWord ? styles.restored : ''}>
              {index < nextWord ? word : '•••'}{index < words.length - 1 && <i>→</i>}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.scene} style={{ backgroundImage: `url(${publicAsset('images/optimized/thoth-library-platformer.webp')})` }}>
        <aside className={styles.eventCard}>
          <StoryPicture card={card} compact />
          <span>Event {card.order}</span>
          <strong>{card.title}</strong>
        </aside>

        {platforms.map((platform, index) => (
          <span key={index} className={styles.platformHitbox} style={{ left: `${platform.x}%`, bottom: `${platform.y}%`, width: `${platform.width}%` }} />
        ))}

        {tablets.map((tablet) => !tablet.collected && (
          <div key={tablet.id} className={styles.tablet} style={{ left: `${tablet.x}%`, bottom: `${tablet.y}%` }}>
            {tablet.word}
          </div>
        ))}

        <div className={styles.scarab} style={{ left: `${player.x}%`, bottom: `${player.y}%` }} aria-label="Magic scarab">
          <span className={styles.leftWing} />
          <span className={styles.scarabBody} />
          <span className={styles.rightWing} />
        </div>

        <div className={`${styles.message} ${mistake ? styles.mistake : ''}`} role="status">{message}</div>

        {levelComplete && (
          <div className={styles.levelComplete}>
            <span>✦ Scroll restored ✦</span>
            <strong>{words.join(' ')}</strong>
            <button type="button" onClick={continueJourney}>{level === cards.length - 1 ? 'Enter the Hall of Knowledge' : 'Next scroll →'}</button>
          </div>
        )}
      </div>

      <div className={styles.controls} aria-label="Scarab controls">
        <button type="button" onPointerDown={() => move('left', true)} onPointerUp={() => move('left', false)} onPointerCancel={() => move('left', false)} onPointerLeave={() => move('left', false)}>← <span>Left</span></button>
        <button type="button" onClick={dropDown}>↓ <span>Down</span></button>
        <button type="button" onClick={jump}>↑ <span>Jump</span></button>
        <button type="button" onPointerDown={() => move('right', true)} onPointerUp={() => move('right', false)} onPointerCancel={() => move('right', false)} onPointerLeave={() => move('right', false)}><span>Right</span> →</button>
      </div>
      <p className={styles.keyboardHint}>Move: A / D or ← / → · Jump: W, ↑, or Space · Down: S or ↓ · Perfect scrolls: {perfectLevels}</p>
    </section>
  )
}
