# STATVS — Plano de Alterações (pedidos do chefe)

**Estado:** PLANO — nada aplicado ainda. Planeado com Fable 5; execução prevista com Opus 4.8.
**Data:** 3 Jul 2026
**Referência visual:** https://statusconcept.com/ (site WordPress atual — dropdown por categorias, carrossel limpo sem texto, tudo separado)
**Codebase:** `Status-Concept/` (Vite + React, HashRouter). Estilo: tokens em `src/index.css`, já em paleta "clean white luxe" desta sessão.

**Norte do design:** extremamente clean, branco, cada coisa no seu lugar. Em caso de dúvida numa micro-decisão: menos elementos, mais espaço em branco, tipografia a fazer o trabalho.

---

## Contexto verificado (não assumir — já confirmado)

- **Nav atual (desktop)** em `src/components/Header.jsx:91`: `["Furniture", "Projects", "Showrooms", "Contact"]` — links `a.nl` resolvidos por `src/useNavLinks.jsx` (`navMap`).
- **Menu original (statusconcept.com):** STATUS · FURNITURE (Lounge>Sofa Sets>2/3 Seats, Corner Sofas; Dining Sets>Tables/Chairs; Sun Lounger; Bar & Patio; Day Beds; Coffee Tables; Side Tables; Puffs) · SHADE SOLUTIONS (Parasols, Bioclimatic Pergolas, Retractable Pergolas) · OUTDOOR KITCHENS (BBQ Carts, BBQ Components, Outdoor Kitchens, Pizza Ovens) · DECOR · LEISURE · GALLERY · PROFESSIONALS · CATALOGUE · CONTACT US.
- **Carrossel original:** imagens full-bleed **sem texto nenhum**, setas + dots.
- **Categorias reais no nosso catálogo** (`status-concept-products.jsx:79-86`): `lounge, dining, sunlounger, shade, kitchen` (+ chip "all" a remover). Não temos dados para sub-subcategorias (2 Seats, Corner…) — o dropdown novo fica de **um nível** (mais clean e honesto com os dados).
- **Rota morta:** `/collection` existe em `App.jsx:35` mas **nada aponta para ela** (grep confirmado).
- **Página de produtos:** banner com texto por cima da imagem (`prod-banner-inner`, linhas 159-166); chips de categoria com "All" (`filterMarkup`, 144-155); cards com mini-carrossel por card (`CardCarousel`, 21-51) e card "featured" com tamanho duplo (linha 220).
- **Heroes com texto sobre imagem** (`rd-page-hero` + `rd-hero-inner`): contact, about, projects, glatz, placeholder.
- **TranslationLayer** (`src/components/TranslationLayer.jsx`): dicionário keyed por string EN exata — **cada string alterada no JSX tem de ser atualizada no dicionário PT**, senão a tradução parte-se silenciosamente.

---

## As 10 alterações

### 1. Nav: "Products" em vez de "Furniture" + dropdown de produtos
*(pedidos: "products instead of furniture" + "fazer um dropdown para os produtos como no status original")*

- `Header.jsx:91` — nav passa a `["Products", "Projects", "Showrooms", "Contact"]`.
- **"Products" ganha dropdown** (novo, no Header — não usar o mecanismo `a.nl`/useNavLinks para este item; componente com estado próprio como o dropdown de idioma já existente no Header:96-114):
  - Itens (um nível): **Lounge** → `/products?cat=lounge` · **Dining** → `/products?cat=dining` · **Sun Loungers & Day Beds** → `/products?cat=sunlounger` · **Shade Solutions** → `/products?cat=shade` · **Glatz Parasols** → `/glatz-parasols` · **Outdoor Kitchens** → `/products?cat=kitchen`. O label "Products" em si navega para `/products`.
  - Estilo: painel branco puro, borda hairline `1px var(--mid-grey)`, `--shadow-md`, padding generoso (20px+), itens uppercase 11-12px letter-spacing 2px, hover → `var(--accent)`. Sem ícones, sem imagens no dropdown. Abre em hover E em click/focus (acessível), fecha com Esc/click fora/navegação.
  - Usar `useLocalizedNavigate` (padrão já existente no Footer/MobileMenu) para preservar `/en` `/pt`.
- `useNavLinks.jsx:5-12` — `navMap`: mudar chave `Furniture` → `Products` (manter destino `/products`). Nota: o handler resolve por `textContent` — em PT o texto renderizado é "Produtos", por isso adicionar também `Produtos: '/products'` ao navMap (e verificar que Showrooms/Contact/Projects têm equivalente PT no navMap: adicionar `Projetos`, `Contacto` — bug latente existente).
- `MobileMenu.jsx:49` — `{l:"Furniture", …}` → `{l:"Products", s:["Lounge","Dining","Sun Loungers","Day Beds"]}` e `NAV_ROUTES["Products"] = "/products"`. Acrescentar "Glatz Parasols" ao grupo Shade Solutions.
- `Footer.jsx:40` — coluna `{t:"Furniture", …}` → `{t:"Products", …}`.
- TranslationLayer PT: `Products: 'Produtos'` já existe; confirmar itens do dropdown têm chave PT (Lounge, Dining=Refeições, Sun Loungers=Espreguiçadeiras…, já existem).

### 2. Remover "collections" da UI
*(pedido: "remove collections")*

O conceito "collection" desaparece da interface (fica só nos dados):
- **Hero homepage** (`status-concept-homepage.jsx:53`): CTA secundário "Explore the collection" → **"Explore products"** (PT: "Explorar produtos"). Atualizar dicionário.
- **Products page:**
  - Toolbar `rd-select` (linhas 188-192): remover `<option value="collection">Collection</option>`; remover o branch `sortBy === "collection"` (linha 115).
  - Card grid meta (linha 242): `{product.collectionName || product.collection}` → `{product.categoryLabel || product.category}`.
  - Card list kicker (linha 255): idem.
  - **Cozinhas** — passo "Choose a kitchen collection" (linhas 200-212): substituir o ecrã intermédio de "collections" por **chips simples de gama** acima da grelha (Black Stainless Steel · Carbon Line Teak · Teak), default = primeira gama selecionada (nunca grelha mista), sem a palavra "collection" em lado nenhum. Remover "Back to collections" (linha 186) e o texto "Choose a kitchen collection" (linha 181).
- **Product detail** (`status-concept-product-detail.jsx:293`): "Same collection" → **"Related products"** (PT: "Produtos relacionados").
- **App.jsx:35**: remover a rota `/collection` + import `Collection` (rota morta). Não apagar o ficheiro da página (histórico), só desligar.
- **Glatz page** (`status-concept-glatz.jsx`): grep por "collection" e trocar wording visível por "range"/"series" (EN) / "gama" (PT).
- TranslationLayer: remover/atualizar chaves `'Same collection'`, `'Choose a kitchen collection'`, `'Back to collections'`, `Colecao/Coleção` sort, e adicionar as novas.
- **Não mexer** nos campos `collection` dos dados nem no CompareContext (usa categoria para agrupar — verificar que não usa collection; se usar, manter interno).

### 3. Heroes das páginas: tirar TODO o texto de cima das imagens
*(pedido: "nas hero images tirar todo o texto")*

Padrão novo (aplicar igual em todas): **imagem limpa full-bleed sem overlay nenhum** + bloco de título em branco puro POR BAIXO da imagem (h1 mantém-se por SEO/acessibilidade, mas fora da imagem).

- **Products** (`status-concept-products.jsx:159-166`): remover `prod-banner-inner` (kicker "Products / X", h1, copy) de cima da imagem. O título da categoria passa para o toolbar que já existe por baixo (reforçar: kicker pequeno + h1). A imagem `prod-banner` fica pura; reduzir altura se necessário para não parecer vazia (~40-48vh).
- **Contact** (`status-concept-contact.jsx:38-45`), **About**, **Projects**, **Glatz**, **Placeholder**: mesmo tratamento — remover `rd-hero-inner` de cima da imagem; título + lede num bloco branco imediatamente a seguir (`padding: 48px, max-width var(--max-width)`).
- **Homepage**: o carrossel já não tem texto em cima (o headline está numa faixa por baixo). Mantém-se o headline (não está "na hero image") — ver §5 para o fundo. ⚠️ Se o chefe quiser zero texto também aí, é apagar a section das linhas 46-55; **não fazer por defeito**, anotar como decisão pendente.
- CSS: as regras `.rd-hero-inner`/`.prod-banner-inner` podem ficar (inofensivas) ou limpar — preferir limpar.

### 4. Carrossel de categorias: tirar o "All" + landing por categorias
*(pedidos: "no carrossel tirar o all" + "separate everything / everything has its own place")*

- `status-concept-products.jsx:80` — remover a entrada `{ key: "all", … }` do array `categories`.
- **Novo comportamento de `/products` sem `?cat=`:** em vez da grelha mista "All Products", mostrar uma **landing de categorias**: grelha limpa de 5 tiles grandes (Lounge · Dining · Sun Loungers · Shade · Outdoor Kitchens), cada um = imagem + nome, fundo branco, hairlines. Cada categoria tem o seu lugar; não existe vista mista.
  - `validCategories` (linha 67): tirar `"all"`; param inválido/ausente → estado "landing" (novo), não "all".
  - O `filterMarkup` (chips com imagem, linhas 144-155) passa a ser usado **dentro de cada categoria** como navegação entre categorias (sem chip All), em versão mais discreta — ou remove-se e fica só o back-link; preferência: manter chips discretos no topo da vista de categoria (troca rápida), SEM "All".
  - Back-link (linha 173-175): "← All Categories" → **"← Products"**, volta à landing.
- Ajustar `categoryAliases` fallback (linha 72): resolved inválido → landing.
- Homepage CTAs que apontam para `/products` continuam válidos (caem na landing).

### 5. Fundo branco + separação total
*(pedidos: "trocar fundo para branco" + "separate everything" + "extremamente clean")*

- **Homepage** (`status-concept-homepage.jsx`): faixa do headline (linha 46, `background: var(--light-grey)`) → `var(--white)`; secção After Care (linha 87, `--light-grey`) → branco; newsletter (linha 148, `--off-white`) → branco. Separação entre secções passa a ser feita por **hairline `1px solid var(--light-grey)`** + espaçamento (subir `--section-padding` mínimo de 60px→80px se necessário).
- **index.css:** `.rd-section.alt` (linha ~105) → fundo branco com hairlines topo/fundo; verificar outros `background: var(--light-grey)`/`--off-white` em secções de página (products toolbar, contact split, etc.) → branco. `--light-grey`/`--mid-grey` continuam a existir **só para bordas, hovers e placeholders de imagem**.
- Cards de produto: fundo branco puro, borda hairline, sem sombra em repouso (sombra só em hover, subtil).
- Manter footer escuro (contraste âncora) — o pedido é sobre o corpo do site.

### 6. Carrossel da homepage: clean como o original
*(pedidos: "no carrossel… clean (usar o exemplo do statusconcept.com)" + "nas hero images tirar todo o texto")*

- Zero texto/overlay nas imagens (já cumprido — garantir que nada é adicionado).
- **Adicionar setas** ‹ › como no original: finas, brancas, sem círculo de fundo (ou círculo ghost `rgba(255,255,255,.25)` com blur), posicionadas nas margens laterais, 44px de área de toque, `aria-label="Previous/Next slide"`.
- Dots: manter os existentes (já são discretos, canto inferior direito) — mover para centro-baixo como no original é opcional; preferir **centro-baixo** para paridade com a referência.
- Pausa no hover das setas/dots opcional; manter `prefers-reduced-motion` (já respeitado, linha 21).

### 7. Produtos mais fáceis de identificar
*(pedido: "os produtos têm de ser mais fáceis de identificar")*

- **Um card = uma imagem.** Remover o `CardCarousel` (setas + dots dentro de cada card = ruído; o original mostra uma imagem limpa por produto). Linha 233-236: usar sempre `product.img`. O componente `CardCarousel` (linhas 21-51) deixa de ser usado na grelha — apagar se não usado noutro lado.
- **Nome em destaque:** subir tamanho/peso do `h3` do card (ff, ~17-18px), categoria como kicker pequeno uppercase por cima do nome (`categoryLabel`).
- **Tirar a descrição dos cards em grelha** (linha 240) — fica só na vista lista e no detalhe. Card = imagem, kicker categoria, nome. Nada mais.
- **Grelha uniforme:** remover a lógica do card `featured` de tamanho duplo (linha 220, classe `featured`) — todos os cards iguais, aspect ratio consistente. Manter as classes de fit (`contain`/`wide`) só para o object-fit da imagem.
- Tags "Popular/New": manter mas mínimas (texto pequeno uppercase, sem cor de fundo forte) — ou remover se colidir com "extremamente clean"; **recomendação: remover dos cards**, manter no detalhe.
- Botões favorito/comparar nos cards: manter mas só visíveis em hover (desktop) para limpar a grelha; sempre visíveis em mobile.

### 8. TranslationLayer — sincronizar TODAS as strings alteradas

Qualquer string EN alterada/nova nos pontos acima entra no dicionário `pt`:
- `'Explore products': 'Explorar produtos'`
- `'Related products': 'Produtos relacionados'`
- Labels novos da landing de categorias e chips de gama de cozinha (Black Stainless Steel etc. — nomes próprios, podem ficar `data-no-translate` ou iguais)
- `'← Products'` / back-link
- Remover chaves órfãs: `'Same collection'`, `'Choose a kitchen collection'`, `'Back to collections'`, `'All Products'` (se a vista deixar de existir), `'All Categories'`, sort `Collection`.
- Verificar que `Products`, `Projetos`, `Contacto`, `Produtos` funcionam no `navMap` do `useNavLinks` (ver §1 — o clique em PT resolve pelo texto traduzido).

### 9. Limpezas associadas (baixo risco, mesmo espírito)

- Remover opção de sort redundante se sobrar só "Featured/Name" com pouca utilidade — manter as duas.
- `Footer.jsx`: nada além do rename da coluna (§1).
- Marquee da homepage (linhas 137-145): manter (é textura, não texto de hero) — **decisão pendente** se o chefe considerar ruído; anotar.

### 10. Verificação (obrigatória antes de entregar)

1. `npm run build` limpo.
2. Preview: `/#/en/` — hero sem texto sobre imagens, setas funcionam, secções todas brancas com hairlines.
3. `/#/en/products` — landing de 5 categorias (sem All); entrar em Lounge → só lounge; chips sem All; cards: 1 imagem, kicker categoria, nome; sem "collection" em lado nenhum (grep ao DOM).
4. `/#/en/products?cat=kitchen` — chips de gama, sem ecrã "choose a collection".
5. Dropdown "Products" no header: hover + click + Esc + navegação fecha; itens navegam com prefixo de língua.
6. `/#/pt/…` — tudo traduzido com diacríticos; navMap PT funciona (clicar "Produtos" no nav navega).
7. Product detail — "Related products", galeria intacta (extras mantêm-se no detalhe: o pedido de 1 imagem é nos CARDS, não no detalhe).
8. Mobile menu — "Products" renomeado, rotas ok.
9. Console sem erros; grep final no código por `Same collection|Choose a kitchen|All Categories|"all"` na página de produtos.

---

## Decisões pendentes para o chefe (não bloqueiam a execução)

1. Headline "The Algarve's outdoor rooms…" por baixo do carrossel: manter (recomendado — está em branco, não sobre a imagem) ou remover para hero 100% imagem?
2. Marquee de badges na homepage: manter ou remover?
3. Tags "Popular/New" nos cards: plano remove-as dos cards (recomendado) — confirmar.

## Ordem de execução sugerida (Opus)

§5 fundo branco (CSS base) → §3 heroes → §6 carrossel → §1 nav+dropdown → §4 landing categorias + All → §2 collections → §7 cards → §8 traduções → §10 verificação.
Commit único no fim (ou por secção se preferires reverter granularmente — recomendado: 3 commits: "white base + heroes + carousel", "nav dropdown + products IA", "cards + collections cleanup").
