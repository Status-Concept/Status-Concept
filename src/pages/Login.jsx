import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isSupabaseConfigured } = useAuth()
  const { showToast } = useToast()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!values.email.trim()) next.email = 'O email e obrigatorio.'
    else if (!emailPattern.test(values.email)) next.email = 'Introduz um email valido.'
    if (!values.password) next.password = 'A password e obrigatoria.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await login(values)
      showToast('Sessao iniciada com sucesso.')
      navigate(location.state?.from?.pathname || '/cliente', { replace: true })
    } catch (error) {
      showToast(error.message || 'Nao foi possivel iniciar sessao.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo ff">ST<span>A</span>TVS</Link>
        <span className="fs sl">Area de cliente</span>
        <h1 className="ff">Entrar na conta</h1>
        <p className="fs auth-copy">Acede aos teus favoritos, dados pessoais e pedidos de orcamento.</p>

        {!isSupabaseConfigured && (
          <div className="form-alert fs">Configura o Supabase no ficheiro .env para ativar o login.</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="form-field">
            <span className="fs">Email</span>
            <input
              className={errors.email ? 'invalid' : ''}
              type="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              autoComplete="email"
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="form-field">
            <span className="fs">Password</span>
            <input
              className={errors.password ? 'invalid' : ''}
              type="password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              autoComplete="current-password"
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <button className="cb cg auth-submit" type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? 'A processar...' : 'Entrar'}
          </button>
        </form>

        <p className="fs auth-switch">Ainda nao tens conta? <Link to="/registar">Criar conta</Link></p>
      </section>
    </main>
  )
}

