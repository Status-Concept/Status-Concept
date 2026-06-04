import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const { register, isSupabaseConfigured } = useAuth()
  const { showToast } = useToast()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'O nome e obrigatorio.'
    if (!values.email.trim()) next.email = 'O email e obrigatorio.'
    else if (!emailPattern.test(values.email)) next.email = 'Introduz um email valido.'
    if (!values.password) next.password = 'A password e obrigatoria.'
    else if (values.password.length < 8) next.password = 'A password deve ter pelo menos 8 caracteres.'
    if (!values.confirmPassword) next.confirmPassword = 'Confirma a password.'
    else if (values.password !== values.confirmPassword) next.confirmPassword = 'As passwords nao coincidem.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const data = await register(values)
      showToast(data.session ? 'Conta criada com sucesso.' : 'Conta criada. Confirma o email para entrar.')
      navigate(data.session ? '/cliente' : '/login')
    } catch (error) {
      showToast(error.message || 'Nao foi possivel criar a conta.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo ff">ST<span>A</span>TVS</Link>
        <span className="fs sl">Nova conta</span>
        <h1 className="ff">Criar area de cliente</h1>
        <p className="fs auth-copy">Guarda favoritos, prepara pedidos de orcamento e mantem os teus dados atualizados.</p>

        {!isSupabaseConfigured && (
          <div className="form-alert fs">Configura o Supabase no ficheiro .env para ativar o registo.</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <label className="form-field">
            <span className="fs">Nome</span>
            <input className={errors.name ? 'invalid' : ''} value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} autoComplete="name" />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label className="form-field">
            <span className="fs">Email</span>
            <input className={errors.email ? 'invalid' : ''} type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} autoComplete="email" />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="form-field">
            <span className="fs">Telefone opcional</span>
            <input value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} autoComplete="tel" />
          </label>

          <div className="auth-two">
            <label className="form-field">
              <span className="fs">Password</span>
              <input className={errors.password ? 'invalid' : ''} type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} autoComplete="new-password" />
              {errors.password && <small>{errors.password}</small>}
            </label>
            <label className="form-field">
              <span className="fs">Confirmar password</span>
              <input className={errors.confirmPassword ? 'invalid' : ''} type="password" value={values.confirmPassword} onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} autoComplete="new-password" />
              {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
            </label>
          </div>

          <button className="cb cg auth-submit" type="submit" disabled={submitting || !isSupabaseConfigured}>
            {submitting ? 'A processar...' : 'Criar conta'}
          </button>
        </form>

        <p className="fs auth-switch">Ja tens conta? <Link to="/login">Entrar</Link></p>
      </section>
    </main>
  )
}

