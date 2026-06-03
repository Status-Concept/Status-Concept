import { useState, useEffect } from 'react'

export function useScrollAnimation(threshold = 0.08) {
  const [visibleSections, setVisibleSections] = useState(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id]))
      }),
      { threshold }
    )
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold])

  const vis = (id) => visibleSections.has(id)
  const S = (id) => ({
    opacity: vis(id) ? 1 : 0,
    transform: vis(id) ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  })

  return { vis, S }
}
