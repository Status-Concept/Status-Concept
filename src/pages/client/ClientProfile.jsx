import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function ClientProfile() {
  const { profile, user, updateProfile } = useAuth()
  const { showToast } = useToast()
  const [values, setValues] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setValues({ name: profile?.name || '', phone: profile?.phone || '' })
  }, [profile])

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'O nome e obrigatorio.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await updateProfile(values)
      showToast('Perfil atualizado.')
    } catch (error) {
      showToast(error.message || 'Nao foi possivel atualizar o perfil.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="account-panel">
      <span className="fs sl">Dados pessoais</span>
      <h2 className="ff">Perfil</h2>
      <p className="fs account-copy">Mantem os teus dados atualizados para futuras propostas e contactos da equipa Statvs.</p>

      <form className="auth-form profile-form" onSubmit={handleSubmit} noValidate>
        <label className="form-field">
          <span className="fs">Nome</span>
          <input className={errors.name ? 'invalid' : ''} value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} />
          {errors.name && <small>{errors.name}</small>}
        </label>

        <label className="form-field">
          <span className="fs">Email</span>
          <input value={user?.email || ''} disabled />
        </label>

        <label className="form-field">
          <span className="fs">Telefone</span>
          <input value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} />
        </label>

        <button type="submit" className="cb cg auth-submit" disabled={submitting}>
          {submitting ? 'A processar...' : 'Guardar alteracoes'}
        </button>
      </form>
    </div>
  )
}

