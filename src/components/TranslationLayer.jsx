import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLangFromPath } from '../utils/language'

const originalText = new WeakMap()

const translations = {
  en: {
    'A Minha Conta': 'My Account',
    'Privacidade e cookies': 'Privacy and cookies',
    'Usamos cookies essenciais para o funcionamento do site e, com o teu consentimento, cookies adicionais para melhorar a experiencia.': 'We use essential cookies for the site to work and, with your consent, additional cookies to improve the experience.',
    'Politica de privacidade': 'Privacy policy',
    'Rejeitar nao essenciais': 'Reject non-essential',
    Aceitar: 'Accept',
  },
  pt: {
    Pages: 'Paginas',
    Homepage: 'Pagina inicial',
    Products: 'Produtos',
    Collection: 'Colecao',
    'Product Detail': 'Detalhe do produto',
    About: 'Sobre',
    Projects: 'Projetos',
    Contact: 'Contacto',
    Favorites: 'Favoritos',
    Login: 'Entrar',
    Furniture: 'Mobiliario',
    Shade: 'Sombra',
    Kitchens: 'Cozinhas',
    Decor: 'Decoracao',
    Showrooms: 'Showrooms',
    'My Account': 'A Minha Conta',
    'OUTDOOR FURNITURE SPECIALISTS': 'ESPECIALISTAS EM MOBILIARIO EXTERIOR',
    'Outdoor Furniture Specialists': 'Especialistas em mobiliario exterior',
    'Luxury outdoor living · Algarve, Portugal': 'Outdoor living de luxo · Algarve, Portugal',
    'Where Design': 'Onde o design',
    'Meets the Sun': 'encontra o sol',
    'Curated outdoor furniture of excellence for the most distinguished residences across the Algarve. From Quinta do Lago to Vilamoura: elegance, crafted for your space.': 'Mobiliario exterior de excelencia para as residencias mais distintas do Algarve. Da Quinta do Lago a Vilamoura: elegancia criada para o seu espaco.',
    Scroll: 'Scroll',
    'Luxury outdoor furniture, shade solutions and bespoke living spaces for the Algarve': 'Mobiliario exterior de luxo, solucoes de sombra e espacos personalizados para o Algarve',
    'Explore collections': 'Explorar colecoes',
    'Visit showroom': 'Visitar showroom',
    'Featured Collections': 'Colecoes em destaque',
    'Curated outdoor living systems for refined Algarve homes': 'Sistemas de outdoor living selecionados para casas sofisticadas no Algarve',
    'View all products': 'Ver todos os produtos',
    'Outdoor Categories': 'Categorias exteriores',
    'Complete solutions for every outdoor moment': 'Solucoes completas para cada momento exterior',
    'Why Status Concept': 'Porque escolher a Status Concept',
    'Local expertise, international quality': 'Conhecimento local, qualidade internacional',
    'Learn more': 'Saber mais',
    'Recent Projects': 'Projetos recentes',
    'Outdoor spaces shaped around real Algarve homes': 'Espacos exteriores pensados para casas reais no Algarve',
    'View all': 'Ver todos',
    'After Care': 'After Care',
    'After Care & Valet Service': 'After Care e servico valet',
    'Keep every piece as beautiful as day one': 'Mantenha cada peca tao bonita como no primeiro dia',
    'Discover after care': 'Descobrir after care',
    'Visit Our Showrooms': 'Visite os nossos showrooms',
    'Two Algarve locations designed for inspiration': 'Duas localizacoes no Algarve pensadas para inspirar',
    'Products /': 'Produtos /',
    All: 'Todos',
    Lounge: 'Lounge',
    Dining: 'Refeicao',
    'Sun Loungers': 'Espreguicadeiras',
    'Day Beds': 'Daybeds',
    'Coffee Tables': 'Mesas de centro',
    'Side Tables': 'Mesas de apoio',
    'Bar & Patio': 'Bar e patio',
    'Parasols & Pergolas': 'Chapeus de sol e pergolas',
    'Outdoor Cooking': 'Cozinha exterior',
    'Carpets & Vases': 'Tapetes e vasos',
    'Sound & Games': 'Som e jogos',
    Puffs: 'Puffs',
    'Modular Kitchen': 'Cozinha modular',
    Filter: 'Filtro',
    Filters: 'Filtros',
    Close: 'Fechar',
    Featured: 'Destaques',
    Name: 'Nome',
    'View mode': 'Modo de vista',
    'Grid view': 'Vista em grelha',
    'List view': 'Vista em lista',
    'Shade Solutions': 'Solucoes de sombra',
    'Furniture Series': 'Series de mobiliario',
    'Choose a kitchen collection': 'Escolha uma colecao de cozinha',
    'products shown': 'produtos apresentados',
    'View details': 'Ver detalhes',
    'Add to favorites': 'Adicionar aos favoritos',
    View: 'Ver',
    'Back to collections': 'Voltar as colecoes',
    'Back to products': 'Voltar aos produtos',
    'Request quote': 'Pedir proposta',
    'Book showroom': 'Marcar showroom',
    Specs: 'Especificacoes',
    Dimensions: 'Dimensoes',
    Materials: 'Materiais',
    Included: 'Incluido',
    'Same collection': 'Mesma colecao',
    'Pieces that work together': 'Pecas que funcionam em conjunto',
    'Details available on request': 'Detalhes disponiveis sob pedido',
    'Product information available through the showroom team': 'Informacao do produto disponivel atraves da equipa do showroom',
    'Visit, call or start a proposal': 'Visite, ligue ou inicie uma proposta',
    'Featured outdoor projects': 'Projetos exteriores em destaque',
    'Outdoor excellence since 2013': 'Excelencia exterior desde 2013',
    Subscribe: 'Subscrever',
    Solutions: 'Solucoes',
    Company: 'Empresa',
    Gallery: 'Galeria',
    Catalogue: 'Catalogo',
    Parasols: 'Chapeus de sol',
    'Bioclimatic Pergolas': 'Pergolas bioclimaticas',
    'Retractable Pergolas': 'Pergolas retrateis',
    'Outdoor Kitchens': 'Cozinhas exteriores',
    'BBQ Systems': 'Sistemas BBQ',
    'Pizza Ovens': 'Fornos de pizza',
    'Full Kitchens': 'Cozinhas completas',
    Carpets: 'Tapetes',
    'Vases & Statues': 'Vasos e estatuas',
    Leisure: 'Lazer',
    'Sound Systems': 'Sistemas de som',
    'Why Us': 'Porque nos',
    'Privacy and cookies': 'Privacidade e cookies',
    'Accept': 'Aceitar',
    'Reject non-essential': 'Rejeitar nao essenciais',
  },
}

function translateTextNode(node, lang) {
  if (!node.parentElement) return
  if (node.parentElement.closest('script, style, noscript, svg, textarea, [data-no-translate]')) return

  if (!originalText.has(node)) originalText.set(node, node.nodeValue)

  const original = originalText.get(node)
  const trimmed = original.trim()
  if (!trimmed) return

  const replacement = translations[lang]?.[trimmed] || trimmed
  const leading = original.match(/^\s*/)?.[0] || ''
  const trailing = original.match(/\s*$/)?.[0] || ''
  const nextValue = `${leading}${replacement}${trailing}`

  if (node.nodeValue !== nextValue) node.nodeValue = nextValue
}

function applyTranslations(lang) {
  const root = document.getElementById('root')
  if (!root) return

  document.documentElement.lang = lang

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach((node) => translateTextNode(node, lang))
}

export default function TranslationLayer() {
  const location = useLocation()
  const lang = getLangFromPath(location.pathname)

  useEffect(() => {
    let applying = false
    const run = () => {
      if (applying) return
      applying = true
      applyTranslations(lang)
      applying = false
    }

    run()
    const observer = new MutationObserver(run)
    const root = document.getElementById('root')
    if (root) observer.observe(root, { childList: true, subtree: true, characterData: true })

    return () => observer.disconnect()
  }, [lang, location.pathname, location.search])

  return null
}
