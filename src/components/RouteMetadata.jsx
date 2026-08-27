import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLangFromPath, stripLangFromPath } from '../utils/language'

const PAGE_TITLES = {
  '/products': ['Products', 'Produtos'],
  '/glatz-parasols': ['Glatz Parasols', 'Chapéus de sol Glatz'],
  '/projects': ['Projects', 'Projetos'],
  '/after-care': ['After Care', 'After Care'],
  '/about': ['About & Showrooms', 'Sobre nós e showrooms'],
  '/contact': ['Contact & Showroom Visits', 'Contacto e visitas ao showroom'],
  '/login': ['Login', 'Entrar'],
  '/register': ['Register', 'Registar'],
  '/registar': ['Register', 'Registar'],
  '/privacy': ['Privacy Policy', 'Política de privacidade'],
  '/privacidade': ['Privacy Policy', 'Política de privacidade'],
  '/cookies': ['Cookie Policy', 'Política de cookies'],
  '/terms': ['Terms', 'Termos'],
}

const DESCRIPTIONS = {
  en: "Outdoor furniture, shade and outdoor kitchens for Algarve homes, with showrooms in Quinta do Lago and Almancil.",
  pt: 'Mobiliário, sombra e cozinhas de exterior para casas no Algarve, com showrooms na Quinta do Lago e em Almancil.',
}

const titleizeSlug = (value) => value
  .split('-')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ')

export default function RouteMetadata() {
  const location = useLocation()

  useEffect(() => {
    const lang = getLangFromPath(location.pathname)
    const path = stripLangFromPath(location.pathname).replace(/\/$/, '') || '/'
    const query = new URLSearchParams(location.search).get('q')
    let pageTitle

    if (path === '/') pageTitle = lang === 'pt' ? 'Especialistas em mobiliário de exterior no Algarve' : 'Outdoor Furniture Specialists · Algarve'
    else if (path === '/products' && query) pageTitle = lang === 'pt' ? `Pesquisa: ${query}` : `Search: ${query}`
    else if (path.startsWith('/product/')) pageTitle = titleizeSlug(path.slice('/product/'.length))
    else pageTitle = PAGE_TITLES[path]?.[lang === 'pt' ? 1 : 0]

    const title = `${pageTitle || (lang === 'pt' ? 'Página não encontrada' : 'Page Not Found')} | STATVS`
    const description = DESCRIPTIONS[lang]
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en'
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'pt' ? 'pt_PT' : 'en')
  }, [location.pathname, location.search])

  return null
}
