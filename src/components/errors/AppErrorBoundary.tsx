import { Component, type ErrorInfo, type ReactNode } from 'react'
import styles from './AppErrorBoundary.module.css'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('English Game Library stopped unexpectedly.', error, info)
  }

  private reload = () => {
    window.location.reload()
  }

  private returnHome = () => {
    window.location.assign(import.meta.env.BASE_URL)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className={styles.page}>
        <section className={styles.panel} role="alert">
          <span className={styles.scarab} aria-hidden="true">◆</span>
          <p>THE ADVENTURE PAUSED</p>
          <h1>Something went wrong</h1>
          <p>Your saved progress is still on this device. Reload the page and try again.</p>
          <div className={styles.actions}>
            <button type="button" onClick={this.reload}>Reload page</button>
            <button type="button" onClick={this.returnHome}>Home</button>
          </div>
        </section>
      </main>
    )
  }
}
