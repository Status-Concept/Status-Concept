import { useEffect, useRef } from 'react'

// Mounted only while open. Native modal dialogs keep keyboard focus inside,
// make the background inert and support Escape without a custom focus trap.
export default function ImageDialog({ className, label, onClose, onKeyDown, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [])
  return (
    <dialog ref={ref} className={className} aria-label={label} onKeyDown={onKeyDown}
      style={{ width: '100vw', height: '100dvh', maxWidth: 'none', maxHeight: 'none', margin: 0, border: 0 }}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      {children}
    </dialog>
  )
}
