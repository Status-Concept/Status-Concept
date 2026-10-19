import { useEffect, useRef, useState } from 'react'
import { CONTACT } from '../data/showrooms'
import { salesEnquiry, salesPrice } from '../utils/salesEnquiry'

export default function SalesEnquiry({ offer, pt, onClose }) {
  const dialog = useRef(null)
  const form = useRef(null)
  const [optionIndex, setOptionIndex] = useState(0)
  const [contact, setContact] = useState({ name: '', email: '', phone: '' })
  const [prepared, setPrepared] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const option = offer.options[optionIndex]
  const request = salesEnquiry(offer, { pt, optionIndex, contact, origin: window.location.origin })

  function updateContact(field, value) {
    setContact({ ...contact, [field]: value })
    setPrepared(false)
    setCopyStatus('')
  }

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [])

  async function copyEnquiry() {
    try {
      await navigator.clipboard.writeText(`${request.subject}\n\n${request.body}`)
      setCopyStatus(pt ? 'Pedido copiado. Cole-o no seu email ou mensagem.' : 'Enquiry copied. Paste it into your email or message.')
    } catch {
      setCopyStatus(pt ? 'Não foi possível copiar. Selecione e copie o texto abaixo.' : 'Could not copy. Select and copy the text below.')
    }
  }

  function openEmail(event) {
    event.preventDefault()
    setPrepared(true)
    window.location.assign(request.emailHref)
  }

  return (
    <dialog ref={dialog} className="sales-enquiry-dialog" data-no-translate data-lenis-prevent aria-labelledby="sales-enquiry-title"
      onCancel={event => { event.preventDefault(); onClose() }}
      onClick={event => { if (event.target === event.currentTarget) onClose() }}>
      <button className="sales-dialog-close" type="button" onClick={onClose} aria-label={pt ? 'Fechar pedido' : 'Close enquiry'}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg>
      </button>
      <div className="sales-dialog-content">
        <h2 id="sales-enquiry-title">{pt ? 'Vamos confirmar.' : 'Let’s check availability.'}</h2>
        <p className="sales-dialog-intro">{pt ? 'Deixe os seus contactos. O pedido já vai com os dados desta oferta.' : 'Add your contact details. We’ll include this offer in your enquiry.'}</p>
        <div className="sales-enquiry-product">
          {offer.image && <img src={offer.image} alt="" width="120" height="96" />}
          <div><h3>{offer.name}</h3><p>{offer.subtitle}</p><strong>{salesPrice(option.sale)}</strong><span className="sales-enquiry-reference">Sales 2026 · {pt ? 'página' : 'page'} {offer.page}</span></div>
        </div>
        <form ref={form} onSubmit={openEmail}>
          {offer.options.length > 1 && <label className="sales-dialog-field">{pt ? 'Escolha a opção' : 'Choose an option'}
            <select value={optionIndex} onChange={event => { setOptionIndex(Number(event.target.value)); setPrepared(false); setCopyStatus('') }}>
              {offer.options.map((item, index) => <option key={index} value={index}>{item.quantity} {pt ? 'cadeiras' : 'chairs'} — {salesPrice(item.sale)}</option>)}
            </select>
          </label>}
          <div className="sales-dialog-fields">
            <label className="sales-dialog-field">{pt ? 'Nome' : 'Name'}<input name="name" autoComplete="name" required maxLength="100" value={contact.name} onChange={event => updateContact('name', event.target.value)} /></label>
            <label className="sales-dialog-field">Email<input name="email" type="email" autoComplete="email" required maxLength="254" value={contact.email} onChange={event => updateContact('email', event.target.value)} /></label>
            <label className="sales-dialog-field sales-dialog-phone">{pt ? 'Telefone' : 'Phone'} <span>{pt ? '(opcional)' : '(optional)'}</span><input name="phone" type="tel" autoComplete="tel" maxLength="40" value={contact.phone} onChange={event => updateContact('phone', event.target.value)} /></label>
          </div>
          <button className="sales-primary-action" type="submit">{pt ? 'Abrir email preparado' : 'Open email draft'}<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button>
          <p className="sales-dialog-note">{pt ? 'Abre a sua aplicação de email. Reveja o pedido e carregue em Enviar.' : 'Opens your email app. Review the enquiry and press Send.'}</p>
          <div className="sales-enquiry-alternatives">
            <a href={request.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={event => { if (!form.current.reportValidity()) event.preventDefault() }}>{pt ? 'Preferir WhatsApp' : 'Use WhatsApp instead'}</a>
            <button type="button" onClick={copyEnquiry}>{pt ? 'Copiar pedido' : 'Copy enquiry'}</button>
          </div>
          {prepared && <p className="sales-dialog-status" role="status">{pt ? 'O email não abriu? Pode' : 'Email didn’t open? You can'} <a href={request.emailHref}>{pt ? 'tentar novamente' : 'try again'}</a> {pt ? 'ou usar uma alternativa acima.' : 'or use an alternative above.'}</p>}
          {copyStatus && <div className="sales-copy-result"><p role="status">{copyStatus}</p><details><summary>{pt ? 'Ver texto do pedido' : 'View enquiry text'}</summary><textarea aria-label={pt ? 'Texto do pedido' : 'Enquiry text'} readOnly value={`${request.subject}\n\n${request.body}`} /></details></div>}
          <p className="sales-dialog-recipient">{pt ? 'Para' : 'To'} <a href={CONTACT.emailHref}>{CONTACT.email}</a></p>
        </form>
      </div>
    </dialog>
  )
}
