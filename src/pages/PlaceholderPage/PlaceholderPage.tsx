import { Link } from 'react-router-dom'
import { EgyptianFrame } from '../../components/decorative/EgyptianFrame'
import styles from './PlaceholderPage.module.css'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className={styles.page}>
      <EgyptianFrame className={styles.panel}>
        <p className={styles.eyebrow}>LOST IN THE DESERT</p>
        <h1>{title}</h1>
        <p>We could not find this page or game topic. Return to the library and choose another adventure.</p>
        <Link className={styles.homeLink} to="/">Return home</Link>
      </EgyptianFrame>
    </main>
  )
}
