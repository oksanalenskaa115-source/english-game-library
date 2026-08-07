import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  label: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return <div className={styles.wrapper}>
    <div className={styles.labels}><span>{label}</span><strong>{value} / {max}</strong></div>
    <div className={styles.track} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><span style={{ width: `${percentage}%` }} /></div>
  </div>
}
