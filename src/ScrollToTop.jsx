import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search } = useLocation()
  const previousLocation = useRef(null)

  useEffect(() => {
    const previous = previousLocation.current
    const previousCollection = new URLSearchParams(previous?.search || '').get('collection')
    const currentCollection = new URLSearchParams(search).get('collection')
    const openedCollection = pathname === previous?.pathname
      && currentCollection
      && currentCollection !== previousCollection

    if (!previous || pathname !== previous.pathname || openedCollection) {
      window.scrollTo(0, 0)
    }

    previousLocation.current = { pathname, search }
  }, [pathname, search])

  return null
}
