# Pesquisa de produto e benchmark — STATVS / Status Concept

Data: 15 de julho de 2026  
Âmbito: descoberta de produto, pesquisa global e experiência do catálogo de mobiliário de exterior premium.

## Sumário executivo

A versão anterior da STATVS não tinha pesquisa global. O visitante precisava de conhecer a taxonomia do catálogo, abrir `Products` e percorrer categorias, mesmo quando já sabia o nome, material ou tipo de peça que procurava.

O padrão mais forte no segmento combina três ideias: entrada global no cabeçalho, sugestões instantâneas agrupadas e uma página de resultados que permite refinar sem criar um beco sem saída. A [Tribù](https://app.tribu.com/en/search/) pesquisa produtos, coleções e projetos; a [Kettal](https://www.kettal.com/) agrupa produtos, coleções e conteúdo institucional; a [RH Outdoor](https://rh.com/us/en/catalog/category/products.jsp/cat22720015/category%3Acat22720015) acrescenta filtros muito profundos, adequados à sua escala mas excessivos para a STATVS.

A solução implementada adapta estes padrões ao modelo de negócio da STATVS: showroom e pedido de proposta, não checkout. Pesquisa nomes, coleções, categorias, materiais, especificações e SKU em inglês ou português, apresenta resultados enquanto se escreve, suporta teclado e mantém sempre um caminho para a equipa do showroom.

## Concorrentes e referências

| Referência | Posicionamento / alcance | Estrutura de descoberta observada | Preço / licença |
|---|---|---|---|
| [Tribù](https://app.tribu.com/en/search/) | Marca premium internacional [V] | Pesquisa global; grupos de produtos, coleções e projetos; ação para ver todos [V] | Site proprietário; n/d |
| [Kettal](https://www.kettal.com/) | Marca premium internacional [V] | Campo global “What are you looking for?”; produtos, coleções e “About us” [V] | Site proprietário; n/d |
| [RH Outdoor](https://rh.com/us/en/catalog/category/products.jsp/cat22720015/category%3Acat22720015) | Grande retalhista premium [V] | Facetas por tipo, coleção, material, estilo e forma [V] | Site proprietário; n/d |
| [Gloster](https://www.gloster.com/en-us/) | Marca internacional de mobiliário exterior [V] | Coleções, procura de lojas e planeador 2D/3D como caminhos complementares [V] | Site proprietário; n/d |
| [Manutti](https://www.manutti.com/en) | Marca premium internacional [V] | Navegação por coleções e produtos com forte orientação visual [V] | Site proprietário; n/d |
| [Ethimo](https://www.ethimo.com/en) | Marca premium internacional [V] | Conteúdo editorial, coleções e catálogo visual [V] | Site proprietário; n/d |
| [Dunas Living](https://dunas-living.com/) | Referência local do Algarve [V] | Marca/showroom com experiência visual; pesquisa de catálogo menos proeminente [V] | Site proprietário; n/d |
| [Algolia Ecommerce Search](https://www.algolia.com/doc/guides/solutions/ecommerce/search) | Referência técnica de pesquisa [V] | Autocomplete, resultados refináveis e recuperação sem resultados [V] | Serviço SaaS; planos variáveis |

`[V]` = verificado diretamente na fonte ligada. `[?]` = inferência que exigiria validação adicional. Não foram inventados dados de tráfego, receita ou quota de mercado.

## Matriz de funcionalidades

| Funcionalidade | STATVS atual | Tribù | Kettal | RH Outdoor | Prioridade STATVS |
|---|---:|---:|---:|---:|---:|
| Pesquisa global no cabeçalho | ✅ | ✅ | ✅ | ✅ | Alta |
| Sugestões instantâneas | ✅ | ✅ | ✅ | ✅ | Alta |
| Produtos + coleções/categorias | ✅ | ✅ | ✅ | ✅ | Alta |
| Conteúdo/serviços na pesquisa | ✅ | ✅ | ✅ | Parcial | Alta |
| Pesquisa por material e SKU | ✅ | [?] | [?] | ✅ | Alta |
| Sinónimos PT/EN | ✅ | [?] | [?] | [?] | Alta |
| Navegação integral por teclado | ✅ | [?] | [?] | [?] | Alta |
| URL de pesquisa partilhável | ✅ | ✅ | ✅ | ✅ | Média |
| Filtro de categoria nos resultados | ✅ | ✅ | ✅ | ✅, muito profundo | Alta |
| Recuperação sem resultados | ✅ | [?] | [?] | ✅ | Alta |
| Histórico/personalização | — | [?] | [?] | [?] | Baixa |
| Pesquisa visual por fotografia | — | — | — | — | Exploratória |

## Lacunas encontradas no produto original

1. Não existia ponto de entrada de pesquisa no cabeçalho.
2. O catálogo não aceitava pesquisa por texto nem URLs com `q=`.
3. Um utilizador não conseguia procurar material, SKU, coleção ou linguagem natural portuguesa sobre dados maioritariamente em inglês.
4. A descoberta estava limitada à categoria; serviços como After Care, projetos e showrooms não eram recuperáveis.
5. Não havia estado de “sem resultados” porque não havia pesquisa; o novo estado precisava de recomendações e contacto, não uma página morta.
6. O menu móvel fechado permanecia na árvore de acessibilidade.

## Evidência de usabilidade

A investigação atual da [Baymard sobre tipos de consulta em ecommerce](https://baymard.com/blog/ecommerce-search-query-types) indica que muitos sites ainda falham pesquisas por nome exato, tipo de produto, categoria e conteúdo não-produto. As suas [boas práticas de autocomplete](https://baymard.com/blog/autocomplete-design) recomendam uma lista controlada, separação clara de escopos, realce do resultado ativo, teclado e baixo ruído visual. Para mobile, a [análise de pesquisa e navegação](https://baymard.com/blog/mobile-ecommerce-search-and-navigation) reforça a importância de preservar espaço e tornar a pesquisa imediatamente utilizável.

Implicação para a STATVS: copiar as dezenas de facetas da RH criaria complexidade sem benefício. Um catálogo curado beneficia mais de pesquisa global, cinco escopos claros e assistência humana quando a intenção é ambígua.

## Funcionalidades inovadoras a explorar

1. **Pesquisa por contexto do projeto** — consultas como “terraço pequeno perto do mar” combinadas com materiais e recomendações da equipa.
2. **Pesquisa visual** — carregar uma fotografia do espaço ou de uma peça e encontrar formas/materiais semelhantes.
3. **Modo “construir ambiente”** — guardar lounge, mesa, sombra e cozinha numa única seleção partilhável com o showroom.
4. **Disponibilidade por showroom** — indicar onde uma peça pode ser experimentada, quando os dados operacionais estiverem disponíveis.
5. **Resultados editoriais locais** — ligar pesquisas como “maresia”, “inverno” ou “manutenção” ao After Care e a guias do Algarve.

## Top 5 recomendado

1. **Pesquisa global federada** — concluída; maior redução de fricção para intenção conhecida.
2. **Sinónimos PT/EN e pesquisa profunda** — concluída; adapta o catálogo internacional ao mercado local.
3. **Resultados partilháveis com refino por categoria** — concluída; útil para cliente, designer e equipa comercial.
4. **Disponibilidade no showroom** — próximo passo, dependente de dados fiáveis de exposição/stock.
5. **Construção de ambientes partilháveis** — evolução natural dos favoritos para pedidos de proposta mais completos.

## Decisões de adaptação

- Mantida a linguagem visual editorial da STATVS: tipografia ampla, tons neutros, linhas finas e movimento discreto.
- Evitada uma solução externa nesta fase: o catálogo atual cabe num índice local, rápido e sem novo custo operacional.
- O painel é carregado apenas quando aberto; a página inicial não inclui os dados completos do catálogo no carregamento inicial.
- A pesquisa conduz a detalhe, catálogo ou contacto. Não simula preço, stock ou checkout que a operação não disponibiliza.
