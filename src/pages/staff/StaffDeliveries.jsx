import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const emptyForm = { reference: '', customer_name: '', location: '', delivery_date: '', notes: '' }

function statusLabel(status) {
  return { planned: 'Planned', in_progress: 'In progress', completed: 'Completed', issue: 'Issue' }[status] || status
}

export default function StaffDeliveries() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const [deliveries, setDeliveries] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadDeliveries = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = await getSupabase()
    const { data, error: fetchError } = await supabase
      .from('deliveries')
      .select('id, reference, customer_name, location, delivery_date, status, notes, assigned_to, created_at')
      .order('delivery_date', { ascending: true })
    if (fetchError) setError(fetchError.message)
    else setDeliveries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadDeliveries() }, [loadDeliveries])

  const createDelivery = async (event) => {
    event.preventDefault()
    if (profile?.role !== 'admin' || saving) return
    setSaving(true)
    setError('')
    try {
      const supabase = await getSupabase()
      const { error: insertError } = await supabase.from('deliveries').insert({
        ...form,
        created_by: user.id,
        delivery_date: form.delivery_date || null,
        status: 'planned',
      })
      if (insertError) throw insertError
      setForm(emptyForm)
      showToast('Delivery created.')
      await loadDeliveries()
    } catch (insertError) {
      setError(insertError.message || 'Could not create the delivery.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="staff-panel">
      <div className="staff-heading-row">
        <div><span className="fs sl">Operations</span><h2 className="ff">Deliveries</h2><p className="fs staff-copy">Private delivery records, installation notes and condition photos.</p></div>
        <span className="staff-badge fs">{profile?.role}</span>
      </div>

      {!isSupabaseConfigured && <div className="staff-notice fs">Supabase is not configured in this local environment. Add the local keys and apply <code>supabase-schema.sql</code> to enable the staff workspace.</div>}
      {error && <div className="staff-error fs" role="alert">{error}</div>}

      {profile?.role === 'admin' && (
        <form className="staff-create-form" onSubmit={createDelivery}>
          <div className="staff-form-heading"><span className="rd-kicker fs">Admin</span><h3 className="ff">Create delivery record</h3></div>
          <div className="staff-form-grid">
            <label className="fs">Reference<input required value={form.reference} onChange={(event) => setForm({ ...form, reference: event.target.value })} placeholder="SC-2026-001" /></label>
            <label className="fs">Customer<input required value={form.customer_name} onChange={(event) => setForm({ ...form, customer_name: event.target.value })} /></label>
            <label className="fs">Location<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} /></label>
            <label className="fs">Delivery date<input type="date" value={form.delivery_date} onChange={(event) => setForm({ ...form, delivery_date: event.target.value })} /></label>
            <label className="fs staff-form-wide">Notes<textarea rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></label>
          </div>
          <button className="cb cg" type="submit" disabled={saving || !isSupabaseConfigured}>{saving ? 'Creating…' : 'Create delivery'}</button>
        </form>
      )}

      <section className="staff-delivery-list" aria-labelledby="staff-delivery-list-title">
        <div className="staff-list-heading"><h3 id="staff-delivery-list-title" className="ff">Delivery records</h3><button type="button" className="staff-refresh fs" onClick={loadDeliveries}>Refresh</button></div>
        {loading ? <p className="fs staff-muted">Loading deliveries…</p> : deliveries.length === 0 ? <p className="fs staff-muted">No delivery records yet.</p> : (
          <div className="staff-table-wrap">
            <table className="staff-table fs">
              <thead><tr><th>Reference</th><th>Customer</th><th>Date</th><th>Status</th><th /></tr></thead>
              <tbody>{deliveries.map((delivery) => <tr key={delivery.id}><td><strong>{delivery.reference}</strong></td><td>{delivery.customer_name}</td><td>{delivery.delivery_date || '—'}</td><td><span className={`staff-status ${delivery.status}`}>{statusLabel(delivery.status)}</span></td><td><Link to={`/staff/deliveries/${delivery.id}`}>Open →</Link></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
