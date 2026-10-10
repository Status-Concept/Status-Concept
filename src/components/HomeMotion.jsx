import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function HomeMotion({ pageRef }) {
  useGSAP(() => {
    if (!window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) return

    gsap.from('.home-hero-slides', {
      scale: 1.018,
      duration: 1.15,
      ease: 'power2.out',
      clearProps: 'transform',
    })

    gsap.from('.home-visit-image img', {
      scale: 1.045,
      duration: 1.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.home-visit',
        start: 'top 78%',
        once: true,
      },
    })
    gsap.from('.home-visit-copy > *', {
      opacity: 0,
      y: 20,
      duration: 0.65,
      ease: 'power2.out',
      stagger: 0.07,
      scrollTrigger: {
        trigger: '.home-visit',
        start: 'top 78%',
        once: true,
      },
    })
  }, { scope: pageRef })

  useEffect(() => {
    if (!window.matchMedia?.('(prefers-reduced-motion: no-preference)').matches) return undefined
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const tick = (time) => lenis.raf(time * 1000)
    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])

  return null
}
