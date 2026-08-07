import { Link } from 'react-router-dom'
import { useSound } from '../../hooks/useSound'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  const { settings, updateSettings, play } = useSound()
  return <main className={styles.page}>
    <section className={styles.panel}>
      <p className={styles.eyebrow}>English Game Library</p>
      <h1>Settings</h1>
      <p>Choose how loud the game sounds should be. Your settings are saved on this device.</p>
      <div className={styles.setting}>
        <div><strong>Sound Effects</strong><span>Buttons, cards, answers and rewards</span></div>
        <button type="button" aria-pressed={settings.effectsEnabled} onClick={() => updateSettings({ effectsEnabled: !settings.effectsEnabled })}>{settings.effectsEnabled ? 'On' : 'Off'}</button>
      </div>
      <label className={styles.slider}>Effects volume <strong>{Math.round(settings.effectsVolume * 100)}%</strong><input type="range" min="0" max="100" value={settings.effectsVolume * 100} disabled={!settings.effectsEnabled} onChange={(event) => updateSettings({ effectsVolume: Number(event.target.value) / 100 })} onPointerUp={() => play('correct')} onKeyUp={() => play('correct')} /></label>
      <div className={styles.setting}>
        <div><strong>Music</strong><span>Light Egyptian adventure melody</span></div>
        <button type="button" aria-pressed={settings.musicEnabled} onClick={() => updateSettings({ musicEnabled: !settings.musicEnabled })}>{settings.musicEnabled ? 'On' : 'Off'}</button>
      </div>
      <label className={styles.slider}>Music volume <strong>{Math.round(settings.musicVolume * 100)}%</strong><input type="range" min="0" max="100" value={settings.musicVolume * 100} disabled={!settings.musicEnabled} onChange={(event) => updateSettings({ musicVolume: Number(event.target.value) / 100 })} /></label>
      <p className={styles.note}>Music starts only after you press or tap something. It pauses when this browser tab is hidden.</p>
      <Link to="/">Back to Home</Link>
    </section>
  </main>
}
