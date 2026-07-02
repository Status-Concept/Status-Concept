import { useState } from 'react'

const CONSENT_KEY = 'cookie_consent'

export default function ConsentNotice() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(CONSENT_KEY))

  const choose = (value) => {
    localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div>
        <span className="fs">Privacidade e cookies</span>
        <p className="fs">
          Usamos cookies essenciais para o funcionamento do site e, com o teu consentimento, cookies adicionais para melhorar a experiencia.
          <a href="/privacidade"> Politica de privacidade</a>
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="cb cd" onClick={() => choose('rejected')}>Rejeitar nao essenciais</button>
        <button type="button" className="cb cg" onClick={() => choose('accepted')}>Aceitar</button>
      </div>
    </div>
  )
}
