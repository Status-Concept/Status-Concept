import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import { getLangFromPath } from '../utils/language'

export default function Login() {
  const location = useLocation()
  const lang = getLangFromPath(location.pathname)
  const isPortuguese = lang === 'pt'
  const [notice, setNotice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice(isPortuguese ? 'O login ainda não está desenvolvido.' : 'Login is not developed yet.')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <LocalizedLink to="/" className="auth-logo ff">ST<span>A</span>TVS</LocalizedLink>
        <span className="fs sl">{isPortuguese ? 'Área de cliente' : 'Client area'}</span>
        <h1 className="ff">{isPortuguese ? 'Entrar na conta' : 'Sign in to your account'}</h1>
        <p className="fs auth-copy">{isPortuguese ? 'A área de cliente ainda está a ser preparada.' : 'The client area is still being prepared.'}</p>

        <div className="form-alert fs">{isPortuguese ? 'O login ainda não está desenvolvido.' : 'Login is not developed yet.'}</div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="form-field">
            <span className="fs">{isPortuguese ? 'Utilizador' : 'Username'}</span>
            <input
              type="text"
              autoComplete="username"
            />
          </label>

          <label className="form-field">
            <span className="fs">{isPortuguese ? 'Palavra-passe' : 'Password'}</span>
            <input
              type="password"
              autoComplete="current-password"
            />
          </label>

          <button className="cb cg auth-submit" type="submit">
            {isPortuguese ? 'Entrar' : 'Sign in'}
          </button>
        </form>

        {notice && <p className="fs form-alert" role="status">{notice}</p>}
        <p className="fs auth-switch"><LocalizedLink to="/">{isPortuguese ? 'Voltar ao site' : 'Back to website'}</LocalizedLink></p>
      </section>
    </main>
  )
}
