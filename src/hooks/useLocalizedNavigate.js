import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLangFromPath, withLang } from '../utils/language'

export function useLocalizedNavigate() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentLang = getLangFromPath(location.pathname)

  return useCallback((path, options) => {
    navigate(withLang(path, currentLang), options)
  }, [currentLang, navigate])
}
