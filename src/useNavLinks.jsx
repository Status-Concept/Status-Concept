import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLangFromPath, withLang } from './utils/language'

const navMap = {
  Furniture: '/products',
  Shade: '/products?cat=shade',
  Kitchens: '/products?cat=kitchen',
  Decor: '/products?cat=decor',
  Projects: '/projects',
  Showrooms: '/contact',
  Contact: '/contact',
}

export default function useNavLinks() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentLang = getLangFromPath(location.pathname)

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a.nl')
      if (link) {
        const text = link.textContent.trim()
        if (navMap[text]) {
          e.preventDefault()
          navigate(withLang(navMap[text], currentLang))
        }
      }

      const el = e.target
      if (el.tagName === 'SPAN' && el.textContent.trim() === 'STATVS') {
        const parent = el.parentElement
        if (parent && parent.style && parent.style.cursor === 'pointer') {
          e.preventDefault()
          navigate(withLang('/', currentLang))
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [currentLang, navigate])
}
