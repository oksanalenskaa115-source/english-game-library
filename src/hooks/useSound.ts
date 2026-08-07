import { useSyncExternalStore } from 'react'
import { getSoundSettings, playSound, subscribeSoundSettings, toggleMasterSound, updateSoundSettings } from '../services/audio/audioService'

export function useSound() {
  const settings = useSyncExternalStore(subscribeSoundSettings, getSoundSettings, getSoundSettings)
  return { settings, play: playSound, updateSettings: updateSoundSettings, toggleMaster: toggleMasterSound }
}
