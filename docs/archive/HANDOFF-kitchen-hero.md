# Contexto — Feature "hero de cozinha montada" no projeto Status-Concept

> Documento de handoff para continuar esta tarefa noutra conversa. Cola o conteúdo
> (ou aponta para este ficheiro) na nova sessão e preenche a secção final "O que quero agora".

## Projeto
- Pasta: `C:\Users\diogo\Videos\second brain\Status-Concept`
- Stack: **Vite + React 19**, React Router v7 com **HashRouter** (as rotas vivem em `/#/...`,
  ex.: `/#/product/<id>`). URLs por path (sem `#`) caem na homepage — **NÃO é bug**.
- Dev server: `npm run dev` → http://localhost:5173
- Site: "STATVS — Luxury Outdoor Living, Algarve" (mobiliário de exterior: Furniture,
  Shade/parasóis Glatz, Kitchens/cozinhas modulares Draco, Decor).

## Objetivo da tarefa
Na secção **Kitchens**, ao clicar num **módulo** (→ página de detalhe do produto), deve
aparecer uma **hero image a mostrar a cozinha toda montada** da coleção desse módulo.
(Interpretação escolhida: hero no topo da página de detalhe do módulo de cozinha.)

## Modelo de dados das cozinhas
- 3 coleções (slugs): `black-stainless-steel`, `carbon-line-teak`, `teak`.
- `src/data/kitchenProducts.js` → `kitchenProducts[]`, `kitchenCollectionMeta[]`,
  `kitchenProductDetails` (gerado; cada um tem `collectionSlug`).
- As fotos de produto são **fotos de estúdio de módulos isolados** (scrape Draco Grills).
  A ÚNICA cena real de cozinha montada é `src/assets/images/kitchen/kitchen-hero.jpg`
  (cozinha de **teca**). Para black/carbon **não existe** cena montada (confirmado na árvore
  de origem `Produtos-Status-Concept/modular kitchen/` — só fotos de estúdio).

## O QUE JÁ ESTÁ FEITO (funciona, build passa ✓)
1. `src/data/kitchenProducts.js`: importa `kitchen-hero.jpg` e exporta:
   ```js
   export const kitchenCollectionHeroes = { teak: kitchenHeroImg }
   ```
2. `src/pages/status-concept-product-detail.jsx`:
   - import inclui `kitchenCollectionHeroes`;
   - `const kitchenHero = product.category === "kitchen" ? kitchenCollectionHeroes[product.collectionSlug || passedProduct?.collection] : null;`
   - renderiza `<section className="rd-kitchen-hero">` full-bleed no topo do `<Layout>`
     (antes do `<main className="rd-detail-layout">`), só quando `kitchenHero` existe.
     Conteúdo: kicker "{coleção} · Modular Outdoor Kitchen", h2 "The complete {coleção} kitchen",
     lede a referir o nome do módulo.
3. `src/index.css`: estilos `.rd-kitchen-hero` (full-bleed ~56vh, gradiente escuro, texto
   branco) + regra responsiva em `max-width: 760px`.

Verificado ao vivo: módulo de **teca** mostra a hero corretamente; módulos **black/carbon**
NÃO mostram hero (gate intencional, para não pôr uma cozinha de teca atrás de módulos pretos).
`npm run build` compila sem erros.

## ITEM EM ABERTO (o que falta)
Gerar 2 cenas de cozinha montada com IA para **Black Stainless Steel** e **Carbon Line Teak**
(decisão do utilizador: gerar com IA).
- Já preparado: `scripts/generate-kitchen-heroes.mjs` (Node + `@google/genai`, já instalado).
  Gera `black-steel-hero.png` e `carbon-line-hero.png` para `src/assets/images/kitchen/`,
  usando modelos de imagem Gemini (`gemini-3-pro-image` → `gemini-3.1-flash-image` →
  `gemini-2.5-flash-image`, 16:9).
- Correr com: `node --env-file=.env scripts/generate-kitchen-heroes.mjs`
  (ou com `GEMINI_API_KEY` já no ambiente).

### BLOQUEIO atual
A geração de imagem Gemini exige **paid tier da API** (billing num projeto Google Cloud).
As chaves testadas devolvem `free_tier ... limit: 0` nos modelos de imagem (os modelos de
**texto** funcionam → chave válida). Atenção: **Gemini Advanced (subscrição da app) ≠ Gemini
API paid tier (billing do projeto)**. É preciso ativar billing da API em
https://aistudio.google.com/apikey (ou https://console.cloud.google.com/billing) para o
projeto da chave.
- A `GEMINI_API_KEY` já está configurada globalmente em `~/.claude/.env` e via `setx`
  (não é preciso repor — a chave não é incluída aqui por segurança).

## PRÓXIMOS PASSOS
1. Ativar billing da API Gemini OU arranjar as 2 imagens por outra via (gerar noutro tool /
   fotos reais).
2. Quando as imagens existirem, ligá-las ao mapa:
   ```js
   import blackSteelHeroImg from '../assets/images/kitchen/black-steel-hero.png'
   import carbonLineHeroImg from '../assets/images/kitchen/carbon-line-hero.png'
   export const kitchenCollectionHeroes = {
     teak: kitchenHeroImg,
     'black-stainless-steel': blackSteelHeroImg,
     'carbon-line-teak': carbonLineHeroImg,
   }
   ```
3. Verificar cada coleção no browser (via `window.location.hash = '#/product/<id>'`) e correr
   `npm run build`.

Decisão pendente oferecida: entretanto usar a cena de teca como placeholder nas 3 coleções,
ou manter só teca.

## Notas de ambiente
- Windows 11, PowerShell + Git Bash. **Python NÃO disponível**. **Node v24** disponível.
  Sem ImageMagick.
- Preview MCP a correr para Status-Concept na porta 5173 (o serverId muda por sessão).
- Para navegar no preview usar hash (`#/...`); a homepage pode não montar as secções de baixo
  sem scroll em headless.

## Ficheiros relevantes
- `src/data/kitchenProducts.js` — mapa `kitchenCollectionHeroes` (editar aqui para ligar imagens)
- `src/pages/status-concept-product-detail.jsx` — render da banda hero
- `src/index.css` — estilos `.rd-kitchen-hero`
- `scripts/generate-kitchen-heroes.mjs` — gerador das cenas IA
- `src/assets/images/kitchen/kitchen-hero.jpg` — cena real de teca (já usada)

## O que quero agora
<!-- ESCREVE AQUI o que queres fazer na nova conversa — ex.: "gerar as 2 imagens com a skill X",
     "melhorar o visual da hero com a skill de design", etc. -->
