import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import DevelopmentGate from './components/DevelopmentGate.jsx'

const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevelopmentGate>
      <HashRouter>
        <Suspense fallback={null}><App /></Suspense>
      </HashRouter>
    </DevelopmentGate>
  </StrictMode>,
)
