import styles from './EgyptBackground.module.css'

export function EgyptBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.sky} />
      <div className={styles.sun} />
      <div className={`${styles.pyramid} ${styles.pyramidOne}`} />
      <div className={`${styles.pyramid} ${styles.pyramidTwo}`} />
      <div className={`${styles.temple} ${styles.templeLeft}`} />
      <div className={`${styles.temple} ${styles.templeRight}`} />
      <div className={styles.river} />
      <div className={styles.sand} />
      <div className={styles.vignette} />
    </div>
  )
}
