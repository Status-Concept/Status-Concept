import { useEffect, useRef, useState } from 'react'

// Adapted from React Bits' Magnet (JS/CSS variant):
// https://github.com/DavidHDev/react-bits/blob/main/src/content/Animations/Magnet/Magnet.jsx
export default function Magnet({ children, className = '', strength = 16, padding = 24 }) {
  const elementRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ||
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const update = (event) => {
      const bounds = elementRef.current?.getBoundingClientRect()
      if (!bounds) return
      const x = event.clientX - bounds.left - bounds.width / 2
      const y = event.clientY - bounds.top - bounds.height / 2
      const near = Math.abs(x) < bounds.width / 2 + padding && Math.abs(y) < bounds.height / 2 + padding
      const next = near ? {
        x: Math.max(-5, Math.min(5, x / strength)),
        y: Math.max(-5, Math.min(5, y / strength)),
      } : { x: 0, y: 0 }
      setOffset((current) => current.x === next.x && current.y === next.y ? current : next)
    }

    window.addEventListener('mousemove', update, { passive: true })
    return () => window.removeEventListener('mousemove', update)
  }, [padding, strength])

  return (
    <span ref={elementRef} className={`home-magnet ${className}`}>
      <span className="home-magnet-inner" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}>
        {children}
      </span>
    </span>
  )
}
