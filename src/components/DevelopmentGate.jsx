import { useEffect, useState } from 'react'

const ACCESS_KEY = 'statvs-development-access'

function hasAccess() {
  try {
    return window.sessionStorage.getItem(ACCESS_KEY) === 'granted'
  } catch {
    return false
  }
}

export default function DevelopmentGate({ children }) {
  const [unlocked, setUnlocked] = useState(hasAccess)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!unlocked) document.title = 'Site under development | STATVS'
  }, [unlocked])

  function handleSubmit(event) {
    event.preventDefault()

    // Temporary client-side preview gate, not a security boundary.
    if (username === 'status' && password === 'status123') {
      try {
        window.sessionStorage.setItem(ACCESS_KEY, 'granted')
      } catch {
        // Access still works for this render when browser storage is unavailable.
      }
      setUnlocked(true)
      return
    }

    setPassword('')
    setError('Incorrect username or password.')
  }

  if (unlocked) return children

  return (
    <main className="development-gate">
      <div className="development-gate-card">
        <div className="development-gate-brand" aria-label="STATVS">STATVS</div>
        <span className="development-gate-eyebrow">Preview access</span>
        <h1>Site under development<span aria-hidden="true">.</span></h1>
        <p>This site is being prepared. Enter your credentials to view the preview.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="development-username">Username</label>
          <input
            id="development-username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            value={username}
            onChange={(event) => { setUsername(event.target.value); setError('') }}
            required
          />
          <label htmlFor="development-password">Password</label>
          <input
            id="development-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setError('') }}
            required
          />
          <p className="development-gate-error" role="alert">{error}</p>
          <button type="submit">Enter site <span aria-hidden="true">↗</span></button>
        </form>
      </div>
      <span className="development-gate-footer">STATVS · OUTDOOR FURNITURE SPECIALISTS</span>
    </main>
  )
}
