import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import LocalizedLink from '../components/LocalizedLink'
import { getLangFromPath, withLang } from '../utils/language'
import BrandLogo from '../components/BrandLogo'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isSupabaseConfigured } = useAuth()
  const { showToast } = useToast()
  const lang = getLangFromPath(location.pathname)
  const isPortuguese = lang === 'pt'
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = isPortuguese ? 'O nome é obrigatório.' : 'Name is required.'
    if (!values.email.trim()) next.email = isPortuguese ? 'O email é obrigatório.' : 'Email is required.'
    else if (!emailPattern.test(values.email)) next.email = isPortuguese ? 'Introduza um email válido.' : 'Enter a valid email.'
    if (!values.password) next.password = isPortuguese ? 'A palavra-passe é obrigatória.' : 'Password is required.'
    else if (values.password.length < 8) next.password = isPortuguese ? 'A palavra-passe deve ter pelo menos 8 caracteres.' : 'Password must be at least 8 characters.'
    if (!values.confirmPassword) next.confirmPassword = isPortuguese ? 'Confirme a palavra-passe.' : 'Confirm your password.'
    else if (values.password !== values.confirmPassword) next.confirmPassword = isPortuguese ? 'As palavras-passe não coincidem.' : 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const data = await register(values)
      showToast(data.session
        ? (isPortuguese ? 'Conta criada com sucesso.' : 'Account created successfully.')
        : (isPortuguese ? 'Conta criada. Confirme o email para entrar.' : 'Account created. Confirm your email to sign in.'))
      navigate(withLang(data.session ? '/cliente' : '/login', lang))
    } catch (error) {
      showToast(error.message || (isPortuguese ? 'Não foi possível criar a conta.' : 'Unable to create the account.'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <LocalizedLink to="/" className="auth-logo" aria-label="STATVS home">
          <BrandLogo alt="" />
        </LocalizedLink>
        <span className="fs sl">{isPortuguese ? 'Nova conta' : 'New account'}</span>
        <h1 className="ff">{isPortuguese ? 'Criar área de cliente' : 'Create your client account'}</h1>
        <p className="fs auth-copy">{isPortuguese ? 'Guarde favoritos, prepare pedidos de orçamento e mantenha os seus dados atualizados.' : 'Save favorites, prepare proposal requests and keep your details up to date.'}</p>

        {!isSupabaseConfigured && (
          <div className="form-alert fs">{isPortuguese ? 'Configure o Supabase no ficheiro .env para ativar o registo.' : 'Configure Supabase in the .env file to enable registration.'}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="form-field">
            <span className="fs">{isPortuguese ? 'Nome' : 'Name'}</span>
            <input className={errors.name ? 'invalid' : ''} value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} autoComplete="name" />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label className="form-field">
            <span className="fs">Email</span>
            <input className={errors.email ? 'invalid' : ''} type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} autoComplete="email" />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="form-field">
            <span className="fs">{isPortuguese ? 'Telefone opcional' : 'Phone (optional)'}</span>
            <input value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} autoComplete="tel" />
          </label>

          <div className="auth-two">
            <label className="form-field">
              <span className="fs">{isPortuguese ? 'Palavra-passe' : 'Password'}</span>
              <input className={errors.password ? 'invalid' : ''} type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} autoComplete="new-password" />
              {errors.password && <small>{errors.password}</small>}
            </label>
            <label className="form-field">
              <span className="fs">{isPortuguese ? 'Confirmar palavra-passe' : 'Confirm password'}</span>
              <input className={errors.confirmPassword ? 'invalid' : ''} type="password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} autoComplete="new-password" />
              {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
            </label>
          </div>

          <button className="cb cg auth-submit" type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? (isPortuguese ? 'A processar...' : 'Creating account...') : (isPortuguese ? 'Criar conta' : 'Create account')}
          </button>
        </form>

        <p className="fs auth-switch">
          {isPortuguese ? 'Já tem conta? ' : 'Already have an account? '}
          <LocalizedLink to="/login">{isPortuguese ? 'Entrar' : 'Sign in'}</LocalizedLink>
        </p>
      </section>
    </main>
  )
}
