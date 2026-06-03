import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const navMap = {
  'Furniture': '/products',
  'Shade': '/products',
  'Kitchens': '/products',
  'Decor': '/products',
  'Projects': '/projects',
  'Showrooms': '/contact',
  'Contact': '/contact',
}

export default function useNavLinks() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a.nl')
      if (link) {
        const text = link.textContent.trim()
        if (navMap[text]) {
          e.preventDefault()
          navigate(navMap[text])
        }
      }

      const el = e.target
      if (el.tagName === 'SPAN' && el.textContent.trim() === 'STATVS') {
        const parent = el.parentElement
        if (parent && parent.style && parent.style.cursor === 'pointer') {
          e.preventDefault()
          navigate('/')
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])
}
