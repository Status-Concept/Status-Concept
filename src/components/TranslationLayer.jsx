import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLangFromPath } from '../utils/language'

const originalText = new WeakMap()
const lastApplied = new WeakMap()

const translations = {
  en: {
    'A Minha Conta': 'My Account',
    'Privacidade e cookies': 'Privacy and cookies',
    'Usamos cookies essenciais para o funcionamento do site e, com o teu consentimento, cookies adicionais para melhorar a experiencia.': 'We use essential cookies for the site to work and, with your consent, additional cookies to improve the experience.',
    'Politica de privacidade': 'Privacy policy',
    'Rejeitar nao essenciais': 'Reject non-essential',
    Aceitar: 'Accept',
    // Client area (Portuguese-authored)
    'Area de cliente': 'Client area',
    Resumo: 'Overview',
    Perfil: 'Profile',
    Favoritos: 'Favorites',
    Comparador: 'Comparator',
    'Terminar sessao': 'Log out',
    'Bem-vindo,': 'Welcome,',
    'Aqui podes acompanhar favoritos, dados pessoais e futuros pedidos de orcamento.': 'Track your favorites, personal details and future quote requests here.',
    'Favoritos guardados': 'Saved favorites',
    'Ver favoritos': 'View favorites',
    'Abrir comparador': 'Open comparator',
    Completo: 'Complete',
    Parcial: 'Partial',
    'Editar dados': 'Edit details',
    Orcamentos: 'Quotes',
    'Em breve, os pedidos feitos no site aparecerao aqui com estado, notas e historico.': 'Soon, orders placed on the site will appear here with status, notes and history.',
    'Dados pessoais': 'Personal details',
    'Mantem os teus dados atualizados para futuras propostas e contactos da equipa Statvs.': 'Keep your details up to date for future quotes and contact from the Statvs team.',
    Nome: 'Name',
    Telefone: 'Phone',
    'Guardar alteracoes': 'Save changes',
    'A processar...': 'Saving...',
    'Favoritos persistentes': 'Saved favorites',
    'Os favoritos ficam associados a tua conta quando tens sessao iniciada.': 'Favorites stay linked to your account while you are signed in.',
    'Limpar todos': 'Clear all',
    'Ainda nao guardaste favoritos': 'You have not saved any favorites yet',
    'Explora produtos e toca no coracao para os guardar aqui.': 'Browse products and tap the heart to save them here.',
    'Ver produtos': 'View products',
    // Comparator
    'Comparar produtos': 'Compare products',
    Ate: 'Up to',
    'produtos da mesma categoria, lado a lado.': 'products from the same category, side by side.',
    'Como usar': 'How to use',
    'Transferir Excel': 'Download Excel',
    'A preparar...': 'Preparing...',
    'Limpar tudo': 'Clear all',
    Colecao: 'Collection',
    Categoria: 'Category',
    Fornecedor: 'Supplier',
    Descricao: 'Description',
    'Comparar (': 'Compare (',
    '+ Adicionar produto': '+ Add product',
    'O comparador esta vazio': 'The comparator is empty',
    'No catalogo, toca no botao de setas de um produto para o adicionar aqui.': 'In the catalog, tap the arrows button on a product to add it here.',
    // Comparator tutorial
    'Bem-vindo ao comparador': 'Welcome to the comparator',
    'Aqui podes comparar ate 3 produtos da mesma categoria, lado a lado.': 'Compare up to 3 products from the same category, side by side.',
    'A tua comparacao': 'Your comparison',
    'Cada coluna e um produto. As linhas mostram colecao, fornecedor, SKU e descricao para comparares rapidamente.': 'Each column is a product. The rows show collection, supplier, SKU and description for a quick comparison.',
    'Adicionar produtos': 'Adding products',
    'No catalogo, usa o botao de setas nos cartoes de produto para adicionar ao comparador. So aceita produtos da mesma categoria, ate 3.': 'In the catalog, use the arrows button on product cards to add to the comparator. Same category only, up to 3.',
    'Exportar para Excel': 'Export to Excel',
    'Este botao transfere a comparacao como folha de calculo Excel, pronta a partilhar.': 'This button downloads the comparison as an Excel spreadsheet, ready to share.',
    Limpar: 'Clear',
    'Remove produtos individualmente no topo de cada coluna, ou limpa a comparacao toda aqui.': 'Remove products individually at the top of each column, or clear the whole comparison here.',
    Sair: 'Exit',
    Seguinte: 'Next',
    Anterior: 'Previous',
    Concluir: 'Finish',
    // Toasts
    'Removido do comparador.': 'Removed from comparator.',
    'Adicionado ao comparador.': 'Added to comparator.',
    'So podes comparar produtos da mesma categoria.': 'You can only compare products from the same category.',
    'So podes comparar 3 produtos no comparador.': 'You can only compare 3 products at a time.',
    'Sessao terminada.': 'Session ended.',
    'Nao foi possivel terminar sessao.': 'Could not end the session.',
    'Perfil atualizado.': 'Profile updated.',
    'Nao foi possivel atualizar o perfil.': 'Could not update the profile.',
    'O nome e obrigatorio.': 'Name is required.',
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
    // Chrome + footer + product/detail gaps
    'Skip to content': 'Saltar para o conteudo',
    'All Products': 'Todos os produtos',
    'All Categories': 'Todas as categorias',
    'Privacy Policy': 'Politica de privacidade',
    'Cookie Policy': 'Politica de cookies',
    Terms: 'Termos',
    '© 2026 Statvs. All rights reserved.': '© 2026 Statvs. Todos os direitos reservados.',
    'Select Size': 'Escolher tamanho',
    'Sun Loungers & Day Beds': 'Espreguicadeiras e daybeds',
    'No pieces in this collection yet. Browse all products or contact the showroom.': 'Ainda nao ha pecas nesta colecao. Explore todos os produtos ou contacte o showroom.',
    // Category descriptions
    'Browse luxury outdoor furniture, shade and kitchen pieces selected for the Algarve lifestyle.': 'Explore mobiliario exterior de luxo, sombra e cozinhas selecionados para o estilo de vida algarvio.',
    'Sofas, lounge sets and armchairs made for long Algarve afternoons.': 'Sofas, conjuntos de lounge e poltronas para longas tardes algarvias.',
    'Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner.': 'Conjuntos de refeicao, mesas e cadeiras para refeicoes no terraco, do pequeno-almoco ao jantar.',
    'Poolside loungers and day beds built for Algarve summers.': 'Espreguicadeiras e daybeds junto a piscina, para os veroes algarvios.',
    'Glatz parasols, bioclimatic pergolas and retractable systems for gardens, terraces and outdoor rooms.': 'Chapeus de sol Glatz, pergolas bioclimaticas e sistemas retrateis para jardins, terracos e salas exteriores.',
    'Explore Draco Grills and Bull modular outdoor kitchens, from full islands to single components.': 'Explore cozinhas modulares Draco Grills e Bull, de ilhas completas a componentes individuais.',
    // Kitchen collection descriptions
    'Nero black stainless steel modules with granite tops, high-output BBQs, fridges, sinks, storage and corner units.': 'Modulos em aco inox preto Nero com tampos de granito, BBQs de alta potencia, frigorificos, lava-loicas, arrumacao e modulos de canto.',
    'Black-finish reclaimed teak kitchen modules with ceramic tops, premium BBQ cabinets, fridges and modular add-ons.': 'Modulos de cozinha em teca recuperada de acabamento preto, tampos ceramicos, armarios de BBQ premium, frigorificos e extras modulares.',
    'Natural reclaimed teak outdoor kitchen modules with ceramic tops, stainless steel BBQs and practical storage units.': 'Modulos de cozinha exterior em teca natural recuperada, tampos ceramicos, BBQs em aco inox e arrumacao pratica.',
    'American-built Bull outdoor kitchen islands, BBQ carts, components and pizza ovens.': 'Ilhas de cozinha exterior Bull de fabrico americano, carrinhos de BBQ, componentes e fornos de pizza.',
  },
}

function translateTextNode(node, lang) {
  if (!node.parentElement) return
  if (node.parentElement.closest('script, style, noscript, svg, textarea, [data-no-translate]')) return

  // Re-capture the original whenever the node changed outside this layer
  // (e.g. React re-rendered dynamic text); otherwise the first cached value
  // would be re-applied forever and dynamic text would freeze.
  if (!originalText.has(node) || (lastApplied.has(node) && lastApplied.get(node) !== node.nodeValue)) {
    originalText.set(node, node.nodeValue)
  }

  const original = originalText.get(node)
  const trimmed = original.trim()
  if (!trimmed) return

  const replacement = translations[lang]?.[trimmed] || trimmed
  const leading = original.match(/^\s*/)?.[0] || ''
  const trailing = original.match(/\s*$/)?.[0] || ''
  const nextValue = `${leading}${replacement}${trailing}`

  if (node.nodeValue !== nextValue) node.nodeValue = nextValue
  lastApplied.set(node, nextValue)
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
