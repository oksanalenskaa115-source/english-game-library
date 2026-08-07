import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StudentProvider } from './components/profile/StudentProvider'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import { setupAudioSystem } from './services/audio/audioService'
import { AppErrorBoundary } from './components/errors/AppErrorBoundary'

setupAudioSystem()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <StudentProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </StudentProvider>
    </AppErrorBoundary>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error: unknown) => {
      console.warn('Offline support could not be started.', error)
    })
  })
}
