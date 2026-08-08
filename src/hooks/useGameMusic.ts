import { useEffect } from 'react'
import { setGameMusicTrack } from '../services/audio/audioService'

export function useGameMusic(source: string) {
  useEffect(() => {
    setGameMusicTrack(source)
    return () => setGameMusicTrack(null)
  }, [source])
}
