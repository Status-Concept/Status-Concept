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
    Pages: 'Páginas',
    Homepage: 'Página inicial',
    Products: 'Produtos',
    Collection: 'Coleção',
    'Product Detail': 'Detalhe do produto',
    About: 'Sobre',
    Projects: 'Projetos',
    Contact: 'Contacto',
    Favorites: 'Favoritos',
    Login: 'Entrar',
    Furniture: 'Mobiliário',
    Shade: 'Sombra',
    Kitchens: 'Cozinhas',
    Showrooms: 'Showrooms',
    'My Account': 'A Minha Conta',
    'OUTDOOR FURNITURE SPECIALISTS': 'ESPECIALISTAS EM MOBILIÁRIO DE EXTERIOR',
    'Outdoor Furniture Specialists': 'Especialistas em mobiliário de exterior',
    'Luxury outdoor living · Algarve, Portugal': 'Outdoor living de luxo · Algarve, Portugal',
    // Hero (repositioned)
    'Outdoor furniture specialists · Algarve': 'Especialistas em mobiliário de exterior · Algarve',
    "The Algarve's outdoor rooms,": 'Os espaços exteriores do Algarve,',
    'furnished and cared for.': 'mobilados e cuidados.',
    "Lounge, dining, shade and outdoor kitchens from Europe's finest makers — with seasonal After Care that keeps every piece as it arrived.": 'Lounge, refeições, sombra e cozinhas de exterior das melhores marcas europeias — com After Care sazonal que mantém cada peça como no primeiro dia.',
    'Book a showroom visit': 'Marcar visita ao showroom',
    'Explore the collection': 'Explorar a coleção',
    'Explore products': 'Explorar produtos',
    'Related products': 'Produtos relacionados',
    'Glatz Parasols': 'Chapéus de sol Glatz',
    'Explore each outdoor category — furniture, shade and kitchens — selected for the Algarve lifestyle.': 'Explore cada categoria de exterior — mobiliário, sombra e cozinhas — selecionada para o estilo de vida algarvio.',
    'No pieces in this category yet. Contact the showroom.': 'Ainda não há peças nesta categoria. Contacte o showroom.',
    'Where Design': 'Onde o design',
    'Meets the Sun': 'encontra o sol',
    'Curated outdoor furniture of excellence for the most distinguished residences across the Algarve. From Quinta do Lago to Vilamoura: elegance, crafted for your space.': 'Mobiliário exterior de excelência para as residências mais distintas do Algarve. Da Quinta do Lago à Vilamoura: elegância criada para o seu espaço.',
    Scroll: 'Scroll',
    'Luxury outdoor furniture, shade solutions and bespoke living spaces for the Algarve': 'Mobiliário exterior de luxo, soluções de sombra e espaços personalizados para o Algarve',
    'Explore collections': 'Explorar coleções',
    'Visit showroom': 'Visitar showroom',
    // Homepage intro (rewritten)
    'Every piece in our showrooms earns its place: fabrics that shrug off ten summers of sun, frames that ignore salt air, makers who obsess over the last millimetre.': 'Cada peça nos nossos showrooms merece o seu lugar: tecidos que resistem a dez verões de sol, estruturas que ignoram a maresia, fabricantes obcecados pelo último milímetro.',
    'Featured Collections': 'Coleções em destaque',
    'Curated outdoor living systems for refined Algarve homes': 'Sistemas de outdoor living selecionados para casas sofisticadas no Algarve',
    'View all products': 'Ver todos os produtos',
    'Outdoor Categories': 'Categorias exteriores',
    'Complete solutions for every outdoor moment': 'Soluções completas para cada momento exterior',
    'Why Status Concept': 'Porque escolher a Status Concept',
    'Local expertise, international quality': 'Conhecimento local, qualidade internacional',
    // Why Statvs (rewritten)
    'Ten years of': 'Dez anos de',
    'Algarve terraces.': 'terraços algarvios.',
    "Vale do Lobo, Quinta do Lago, Vilamoura, Tavira — since 2013 we've furnished the coast's most demanding outdoor spaces, and we still maintain many of them each season.": 'Vale do Lobo, Quinta do Lago, Vilamoura, Tavira — desde 2013 mobilamos os espaços exteriores mais exigentes da costa, e continuamos a cuidar de muitos deles a cada estação.',
    'Our story': 'A nossa história',
    'Learn more': 'Saber mais',
    'Recent Projects': 'Projetos recentes',
    'Outdoor spaces shaped around real Algarve homes': 'Espaços exteriores pensados para casas reais no Algarve',
    'View all': 'Ver todos',
    'After Care': 'After Care',
    // After Care banner (repositioned)
    'Delivered. Then looked after.': 'Entregue. Depois, cuidado.',
    'Seasonal cleaning, maintenance and winter care by our own team — so the terrace is ready the day you arrive, not a project when you do.': 'Limpeza sazonal, manutenção e cuidados de inverno pela nossa própria equipa — para que o terraço esteja pronto no dia em que chega, e não um projeto quando chega.',
    'See the After Care plans': 'Ver os planos de After Care',
    'After Care & Valet Service': 'After Care e serviço valet',
    'Keep every piece as beautiful as day one': 'Mantenha cada peça tão bonita como no primeiro dia',
    'Discover after care': 'Descobrir After Care',
    'Visit Our Showrooms': 'Visite os nossos showrooms',
    'Two Algarve locations designed for inspiration': 'Duas localizações no Algarve pensadas para inspirar',
    'Get directions': 'Como chegar',
    'Get directions →': 'Como chegar →',
    // Newsletter (rewritten)
    'Notes from the showroom': 'Notas do showroom',
    'Products /': 'Produtos /',
    All: 'Todos',
    Lounge: 'Lounge',
    Dining: 'Refeições',
    'Sun Loungers': 'Espreguiçadeiras',
    'Day Beds': 'Daybeds',
    'Coffee Tables': 'Mesas de centro',
    'Side Tables': 'Mesas de apoio',
    'Bar & Patio': 'Bar e pátio',
    'Parasols & Pergolas': 'Chapéus de sol e pérgolas',
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
    'Shade Solutions': 'Soluções de sombra',
    'Furniture Series': 'Séries de mobiliário',
    'Choose a kitchen collection': 'Escolha uma coleção de cozinha',
    'products shown': 'produtos apresentados',
    'View details': 'Ver detalhes',
    'Add to favorites': 'Adicionar aos favoritos',
    View: 'Ver',
    'Back to collections': 'Voltar às coleções',
    'Back to products': 'Voltar aos produtos',
    'Request quote': 'Pedir proposta',
    'Book showroom': 'Marcar showroom',
    Specs: 'Especificações',
    Dimensions: 'Dimensões',
    Materials: 'Materiais',
    Included: 'Incluído',
    'Same collection': 'Mesma coleção',
    'Pieces that work together': 'Peças que funcionam em conjunto',
    'Details available on request': 'Detalhes disponíveis sob pedido',
    'Product information available through the showroom team': 'Informação do produto disponível através da equipa do showroom',
    'Visit, call or start a proposal': 'Visite, ligue ou inicie uma proposta',
    'Featured outdoor projects': 'Projetos exteriores em destaque',
    'Outdoor excellence since 2013': 'Excelência exterior desde 2013',
    Subscribe: 'Subscrever',
    Solutions: 'Soluções',
    Company: 'Empresa',
    Gallery: 'Galeria',
    Catalogue: 'Catálogo',
    Parasols: 'Chapéus de sol',
    'Bioclimatic Pergolas': 'Pérgolas bioclimáticas',
    'Retractable Pergolas': 'Pérgolas retráteis',
    'Outdoor Kitchens': 'Cozinhas exteriores',
    'BBQ Systems': 'Sistemas BBQ',
    'Pizza Ovens': 'Fornos de pizza',
    'Full Kitchens': 'Cozinhas completas',
    Carpets: 'Tapetes',
    'Vases & Statues': 'Vasos e estátuas',
    Leisure: 'Lazer',
    'Sound Systems': 'Sistemas de som',
    'Why Us': 'Porque nós',
    'Privacy and cookies': 'Privacidade e cookies',
    'Accept': 'Aceitar',
    'Reject non-essential': 'Rejeitar não essenciais',
    // Chrome + footer + product/detail gaps
    'Skip to content': 'Saltar para o conteúdo',
    'All Products': 'Todos os produtos',
    'All Categories': 'Todas as categorias',
    'Privacy Policy': 'Política de privacidade',
    'Cookie Policy': 'Política de cookies',
    Terms: 'Termos',
    '© 2026 Statvs. All rights reserved.': '© 2026 Statvs. Todos os direitos reservados.',
    // Footer tagline (rewritten)
    'Outdoor furniture specialists since 2013. Two Algarve showrooms, European makers, and After Care that continues long after delivery.': 'Especialistas em mobiliário de exterior desde 2013. Dois showrooms no Algarve, fabricantes europeus e After Care que continua muito depois da entrega.',
    'Select Size': 'Escolher tamanho',
    'Sun Loungers & Day Beds': 'Espreguiçadeiras e daybeds',
    'No pieces in this collection yet. Browse all products or contact the showroom.': 'Ainda não há peças nesta coleção. Explore todos os produtos ou contacte o showroom.',
    // Category descriptions
    'Browse luxury outdoor furniture, shade and kitchen pieces selected for the Algarve lifestyle.': 'Explore mobiliário exterior de luxo, sombra e cozinhas selecionados para o estilo de vida algarvio.',
    'Sofas, lounge sets and armchairs made for long Algarve afternoons.': 'Sofás, conjuntos de lounge e poltronas para longas tardes algarvias.',
    'Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner.': 'Conjuntos de refeição, mesas e cadeiras para refeições no terraço, do pequeno-almoço ao jantar.',
    'Poolside loungers and day beds built for Algarve summers.': 'Espreguiçadeiras e daybeds junto à piscina, para os verões algarvios.',
    'Glatz parasols, bioclimatic pergolas and retractable systems for gardens, terraces and outdoor rooms.': 'Chapéus de sol Glatz, pérgolas bioclimáticas e sistemas retráteis para jardins, terraços e salas exteriores.',
    'Draco Grills modular outdoor kitchens in Black Stainless Steel, Carbon Line Teak and natural Teak.': 'Cozinhas modulares Draco Grills em aço inox preto, Carbon Line Teak e teca natural.',
    // Kitchen collection descriptions
    'Nero black stainless steel modules with granite tops, high-output BBQs, fridges, sinks, storage and corner units.': 'Módulos em aço inox preto Nero com tampos de granito, BBQs de alta potência, frigoríficos, lava-loiças, arrumação e módulos de canto.',
    'Black-finish reclaimed teak kitchen modules with ceramic tops, premium BBQ cabinets, fridges and modular add-ons.': 'Módulos de cozinha em teca recuperada de acabamento preto, tampos cerâmicos, armários de BBQ premium, frigoríficos e extras modulares.',
    'Natural reclaimed teak outdoor kitchen modules with ceramic tops, stainless steel BBQs and practical storage units.': 'Módulos de cozinha exterior em teca natural recuperada, tampos cerâmicos, BBQs em aço inox e arrumação prática.',
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
