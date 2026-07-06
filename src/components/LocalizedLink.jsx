import { Link, useLocation } from 'react-router-dom'
import { getLangFromPath, withLang } from '../utils/language'

export default function LocalizedLink({ to, ...props }) {
  const location = useLocation()
  const lang = getLangFromPath(location.pathname)
  return <Link to={withLang(to, lang)} {...props} />
}
