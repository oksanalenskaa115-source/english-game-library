export type SoundEffect = 'button' | 'cardFlip' | 'correct' | 'wrong' | 'star' | 'heartLost' | 'chest' | 'levelComplete' | 'victory' | 'move' | 'hint'

export interface SoundSettings {
  effectsEnabled: boolean
  musicEnabled: boolean
  effectsVolume: number
  musicVolume: number
  masterMuted: boolean
}

const STORAGE_KEY = 'egl.soundSettings'
const defaults: SoundSettings = { effectsEnabled: true, musicEnabled: true, effectsVolume: 0.6, musicVolume: 0.2, masterMuted: false }
const listeners = new Set<() => void>()
let settings = loadSettings()
let context: AudioContext | null = null
let effectsGain: GainNode | null = null
let musicGain: GainNode | null = null
let musicStarted = false
let userActivated = false
let musicTimer: number | null = null
let musicStep = 0

function loadSettings(): SoundSettings {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Partial<SoundSettings> | null
    return stored ? { ...defaults, ...stored } : defaults
  } catch { return defaults }
}

function ensureContext() {
  if (!context) {
    context = new AudioContext()
    effectsGain = context.createGain()
    musicGain = context.createGain()
    effectsGain.connect(context.destination)
    musicGain.connect(context.destination)
    document.addEventListener('visibilitychange', updateGains)
  }
  if (context.state === 'suspended') void context.resume()
  updateGains()
  return context
}

function updateGains() {
  if (!context || !effectsGain || !musicGain) return
  const now = context.currentTime
  const effectsLevel = settings.effectsEnabled && !settings.masterMuted ? settings.effectsVolume : 0
  const musicLevel = settings.musicEnabled && !settings.masterMuted && !document.hidden ? settings.musicVolume : 0
  effectsGain.gain.setTargetAtTime(effectsLevel, now, 0.03)
  musicGain.gain.setTargetAtTime(musicLevel, now, 0.15)
  if (settings.musicEnabled && userActivated && !musicStarted) startMusic()
}

function tone(frequency: number, duration: number, volume: number, startDelay = 0, type: OscillatorType = 'sine', destination = effectsGain) {
  const audio = ensureContext()
  if (!destination) return
  const start = audio.currentTime + startDelay
  const oscillator = audio.createOscillator()
  const envelope = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.025, duration / 3))
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(envelope).connect(destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

function startMusic() {
  if (musicStarted || !userActivated || !settings.musicEnabled) return
  musicStarted = true
  ensureContext()
  if (!musicGain) { musicStarted = false; return }

  // A light D-major adventure theme. Short notes keep the music warm and
  // energetic without the gloomy continuous drone used in the old version.
  const melodyBars = [
    [293.66, 369.99, 440, 493.88, 440, 369.99, 329.63, 293.66],
    [392, 440, 493.88, 587.33, 493.88, 440, 369.99, 329.63],
    [440, 493.88, 587.33, 739.99, 659.25, 587.33, 493.88, 440],
    [369.99, 440, 493.88, 587.33, 440, 369.99, 329.63, 293.66],
  ]
  const bassNotes = [146.83, 196, 220, 146.83]

  const playMotif = () => {
    if (!settings.musicEnabled || settings.masterMuted || document.hidden) return
    const barIndex = musicStep % melodyBars.length
    melodyBars[barIndex].forEach((frequency, noteIndex) => {
      const accent = noteIndex === 0 || noteIndex === 4
      tone(frequency, accent ? 0.28 : 0.2, accent ? 0.04 : 0.032, noteIndex * 0.32, 'triangle', musicGain)
    })
    tone(bassNotes[barIndex], 0.5, 0.022, 0, 'sine', musicGain)
    tone(bassNotes[barIndex] * 1.5, 0.32, 0.014, 1.28, 'sine', musicGain)
    musicStep += 1
  }
  playMotif()
  musicTimer = window.setInterval(playMotif, 2800)
}

export function playSound(effect: SoundEffect) {
  if (!settings.effectsEnabled || settings.masterMuted) return
  userActivated = true
  ensureContext()
  const patterns: Record<SoundEffect, Array<[number, number, number, number?, OscillatorType?]>> = {
    button: [[520, 0.045, 0.035]],
    cardFlip: [[360, 0.07, 0.045], [510, 0.06, 0.03, 0.045]],
    correct: [[523.25, 0.18, 0.055], [659.25, 0.22, 0.05, 0.08]],
    wrong: [[246.94, 0.18, 0.035, 0, 'triangle'], [220, 0.2, 0.025, 0.1, 'triangle']],
    star: [[659.25, 0.18, 0.05], [783.99, 0.25, 0.05, 0.1]],
    heartLost: [[293.66, 0.14, 0.035], [246.94, 0.2, 0.03, 0.1]],
    chest: [[196, 0.2, 0.04], [392, 0.3, 0.055, 0.12], [523.25, 0.35, 0.045, 0.24]],
    levelComplete: [[392, 0.2, 0.045], [523.25, 0.25, 0.05, 0.12], [659.25, 0.35, 0.055, 0.25]],
    victory: [[523.25, 0.2, 0.05], [659.25, 0.25, 0.05, 0.1], [783.99, 0.4, 0.055, 0.22]],
    move: [[330, 0.06, 0.03], [440, 0.08, 0.025, 0.05]],
    hint: [[440, 0.12, 0.03, 0, 'triangle'], [554.37, 0.16, 0.03, 0.1, 'triangle']],
  }
  patterns[effect].forEach(([frequency, duration, volume, delay, type]) => tone(frequency, duration, volume, delay, type))
}

export function getSoundSettings() { return settings }
export function subscribeSoundSettings(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) }

export function updateSoundSettings(next: Partial<SoundSettings>) {
  settings = { ...settings, ...next, effectsVolume: Math.max(0, Math.min(1, next.effectsVolume ?? settings.effectsVolume)), musicVolume: Math.max(0, Math.min(1, next.musicVolume ?? settings.musicVolume)) }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  if (userActivated) ensureContext()
  updateGains()
  listeners.forEach((listener) => listener())
}

export function toggleMasterSound() { updateSoundSettings({ masterMuted: !settings.masterMuted }) }

export function setupAudioSystem() {
  const activate = () => { userActivated = true; ensureContext(); startMusic() }
  document.addEventListener('pointerdown', activate, { once: true })
  document.addEventListener('keydown', activate, { once: true })
  document.addEventListener('click', (event) => {
    if ((event.target as Element).closest('button, a')) playSound('button')
  })
}

export function stopAudioSystem() {
  if (musicTimer !== null) window.clearInterval(musicTimer)
  musicTimer = null
  if (context) void context.close()
  context = null; effectsGain = null; musicGain = null; musicStarted = false
}
