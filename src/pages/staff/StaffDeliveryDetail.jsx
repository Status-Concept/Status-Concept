import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSupabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const PHOTO_STAGES = ['before', 'during', 'after', 'damage']

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      const maxSize = 1800
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(objectUrl)
        if (blob) resolve(blob)
        else reject(new Error('Could not prepare this image.'))
      }, 'image/jpeg', .84)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('This image could not be read.'))
    }
    image.src = objectUrl
  })
}

export default function StaffDeliveryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const fileRef = useRef(null)
  const [delivery, setDelivery] = useState(null)
  const [photos, setPhotos] = useState([])
  const [stage, setStage] = useState('before')
  const [caption, setCaption] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = await getSupabase()
    const [{ data: deliveryData, error: deliveryError }, { data: photoData, error: photoError }] = await Promise.all([
      supabase.from('deliveries').select('id, reference, customer_name, location, delivery_date, status, notes, assigned_to, created_at').eq('id', id).single(),
      supabase.from('delivery_photos').select('id, stage, storage_path, caption, uploaded_by, created_at, invalidated_at, invalidated_reason').eq('delivery_id', id).order('created_at', { ascending: true }),
    ])
    if (deliveryError || photoError) {
      setError((deliveryError || photoError).message)
      setLoading(false)
      return
    }
    setDelivery(deliveryData)
    setNotes(deliveryData?.notes || '')
    const validPhotos = (photoData || []).filter((photo) => !photo.invalidated_at)
    const signed = validPhotos.length ? await supabase.storage.from('delivery-photos').createSignedUrls(validPhotos.map((photo) => photo.storage_path), 3600) : { data: [] }
    setPhotos(validPhotos.map((photo, index) => ({ ...photo, url: signed.data?.[index]?.signedUrl || '' })))
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const hasBefore = photos.some((photo) => photo.stage === 'before')
  const hasAfter = photos.some((photo) => photo.stage === 'after')
  const canComplete = hasBefore && hasAfter
  const photoCountByStage = useMemo(() => PHOTO_STAGES.reduce((counts, item) => ({ ...counts, [item]: photos.filter((photo) => photo.stage === item).length }), {}), [photos])

  const uploadPhotos = async (event) => {
    const files = [...event.target.files]
    event.target.value = ''
    if (!files.length || uploading || !delivery) return
    setUploading(true)
    setError('')
    try {
      const supabase = await getSupabase()
      for (const file of files) {
        if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`)
        const blob = await compressImage(file)
        const path = `${delivery.id}/${crypto.randomUUID()}.jpg`
        const { error: uploadError } = await supabase.storage.from('delivery-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
        if (uploadError) throw uploadError
        const { error: photoError } = await supabase.from('delivery_photos').insert({ delivery_id: delivery.id, stage, storage_path: path, caption: caption.trim() || null, uploaded_by: user.id })
        if (photoError) throw photoError
      }
      setCaption('')
      await load()
    } catch (uploadError) {
      setError(uploadError.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const updateDelivery = async (nextStatus = delivery?.status) => {
    if (!delivery || !isSupabaseConfigured) return
    if (nextStatus === 'completed' && !canComplete) {
      setError('A completed delivery needs at least one before photo and one after photo.')
      return
    }
    const supabase = await getSupabase()
    const { data, error: updateError } = await supabase.from('deliveries').update({ notes, status: nextStatus, completed_at: nextStatus === 'completed' ? new Date().toISOString() : null, updated_at: new Date().toISOString() }).eq('id', delivery.id).select('id, reference, customer_name, location, delivery_date, status, notes, assigned_to, created_at').single()
    if (updateError) setError(updateError.message)
    else setDelivery(data)
  }

  const invalidatePhoto = async (photo) => {
    if (profile?.role !== 'admin') return
    const reason = window.prompt('Reason for invalidating this photo:')
    if (!reason?.trim()) return
    const supabase = await getSupabase()
    const { error: updateError } = await supabase.from('delivery_photos').update({ invalidated_at: new Date().toISOString(), invalidated_reason: reason.trim(), invalidated_by: user.id }).eq('id', photo.id)
    if (updateError) setError(updateError.message)
    else load()
  }

  if (loading) return <div className="staff-panel"><p className="fs staff-muted">Loading delivery…</p></div>
  if (!isSupabaseConfigured) return <div className="staff-panel"><div className="staff-notice fs">Supabase is not configured in this local environment. The delivery workspace will be available after the local keys and schema are applied.</div></div>
  if (!delivery) return <div className="staff-panel"><div className="staff-error fs">{error || 'Delivery not found.'}</div><button className="rd-back-link fs" type="button" onClick={() => navigate('/staff/deliveries')}>Back to deliveries</button></div>

  return (
    <div className="staff-panel">
      <Link className="rd-back-link fs" to="/staff/deliveries">← Deliveries</Link>
      <div className="staff-heading-row staff-detail-heading"><div><span className="fs sl">Delivery record</span><h2 className="ff">{delivery.reference}</h2><p className="fs staff-copy">{delivery.customer_name} · {delivery.location || 'Location not set'} · {delivery.delivery_date || 'Date not set'}</p></div><span className={`staff-status ${delivery.status}`}>{delivery.status.replace('_', ' ')}</span></div>
      {error && <div className="staff-error fs" role="alert">{error}</div>}

      <section className="staff-upload-panel">
        <div className="staff-form-heading"><span className="rd-kicker fs">Mobile capture</span><h3 className="ff">Add condition photos</h3><p className="fs staff-muted">Images are compressed and re-encoded before upload, which removes camera metadata such as GPS.</p></div>
        <div className="staff-upload-controls">
          <label className="fs">Stage<select value={stage} onChange={(event) => setStage(event.target.value)}>{PHOTO_STAGES.map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)} ({photoCountByStage[item] || 0})</option>)}</select></label>
          <label className="fs">Caption<input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="Optional note" /></label>
          <label className="cb cg staff-file-button">{uploading ? 'Uploading…' : 'Take or choose photos'}<input ref={fileRef} type="file" accept="image/*" capture="environment" multiple disabled={uploading} onChange={uploadPhotos} /></label>
        </div>
      </section>

      <section className="staff-photo-grid" aria-label="Delivery photos">
        {photos.length === 0 ? <p className="fs staff-muted">No photos uploaded yet.</p> : photos.map((photo) => <figure key={photo.id} className="staff-photo-card"><div>{photo.url ? <img src={photo.url} alt={photo.caption || `${photo.stage} delivery photo`} /> : <span className="fs">Preview unavailable</span>}</div><figcaption><strong className="fs">{photo.stage}</strong><span className="fs">{photo.caption || 'No caption'}</span>{profile?.role === 'admin' && <button type="button" className="staff-invalidate fs" onClick={() => invalidatePhoto(photo)}>Invalidate</button>}</figcaption></figure>)}
      </section>

      <section className="staff-detail-actions">
        <label className="fs">Notes<textarea rows="4" value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
        <div className="staff-action-row"><button type="button" className="cb cd" onClick={() => updateDelivery('in_progress')}>Save notes</button><button type="button" className="cb cg" disabled={!canComplete} onClick={() => updateDelivery('completed')}>Complete delivery</button>{delivery.status === 'issue' ? <span className="staff-muted fs">Issue recorded</span> : <button type="button" className="staff-issue-button fs" onClick={() => updateDelivery('issue')}>Mark issue</button>}</div>
        {!canComplete && <p className="staff-muted fs">Completion unlocks after a before and an after photo are uploaded.</p>}
      </section>
    </div>
  )
}
