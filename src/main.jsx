import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import DevelopmentGate from './components/DevelopmentGate.jsx'
import { legacyUrlTarget } from './utils/legacyUrl.js'

const legacyTarget = legacyUrlTarget(window.location.href)
if (legacyTarget) window.history.replaceState(window.history.state, '', legacyTarget)

const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevelopmentGate>
      <BrowserRouter>
        <Suspense fallback={null}><App /></Suspense>
      </BrowserRouter>
    </DevelopmentGate>
  </StrictMode>,
)
