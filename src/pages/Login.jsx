import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LocalizedLink from '../components/LocalizedLink'
import { getLangFromPath, withLang } from '../utils/language'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthEnabled } = useAuth()
  const { showToast } = useToast()
  const lang = getLangFromPath(location.pathname)
  const isPortuguese = lang === 'pt'
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!values.email.trim()) next.email = isPortuguese ? 'O email é obrigatório.' : 'Email is required.'
    else if (!emailPattern.test(values.email)) next.email = isPortuguese ? 'Introduza um email válido.' : 'Enter a valid email.'
    if (!values.password) next.password = isPortuguese ? 'A palavra-passe é obrigatória.' : 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(values)
      showToast(isPortuguese ? 'Sessão iniciada com sucesso.' : 'Signed in successfully.')
      navigate(location.state?.from?.pathname || withLang('/cliente', lang), { replace: true })
    } catch (error) {
      showToast(error.message || (isPortuguese ? 'Não foi possível iniciar sessão.' : 'Unable to sign in.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <LocalizedLink to="/" className="auth-logo ff">ST<span>A</span>TVS</LocalizedLink>
        <span className="fs sl">{isPortuguese ? 'Área de cliente' : 'Client area'}</span>
        <h1 className="ff">{isPortuguese ? 'Entrar na conta' : 'Sign in to your account'}</h1>
        <p className="fs auth-copy">{isPortuguese ? 'Aceda aos seus favoritos, dados pessoais e pedidos de orçamento.' : 'Access your favorites, personal details and proposal requests.'}</p>

        {!isAuthEnabled && (
          <div className="form-alert fs">{isPortuguese ? 'A área de cliente está temporariamente indisponível.' : 'The client area is currently unavailable.'}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="form-field">
            <span className="fs">Email</span>
            <input
              className={errors.email ? 'invalid' : ''}
              type="email"
              disabled={!isAuthEnabled}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              autoComplete="email"
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="form-field">
            <span className="fs">{isPortuguese ? 'Palavra-passe' : 'Password'}</span>
            <input
              className={errors.password ? 'invalid' : ''}
              type="password"
              disabled={!isAuthEnabled}
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              autoComplete="current-password"
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <button className="cb cg auth-submit" type="submit" disabled={submitting || !isAuthEnabled}>
            {submitting ? (isPortuguese ? 'A processar...' : 'Signing in...') : (isPortuguese ? 'Entrar' : 'Sign in')}
          </button>
        </form>

        <p className="fs auth-switch">
          {isPortuguese ? 'A área de cliente ficará disponível numa fase futura.' : 'The client area will be available in a future phase.'}
        </p>
      </section>
    </main>
  )
}
