// Glatz parasol range — Status Concept is a direct Glatz supplier.
// Source: second-brain/products/glatz-shade.md (gathered from glatz.com, June 2026)
import sombranoImg from '../assets/images/glatz/sombrano-s-plus-3.webp'
import sombranoDetail1 from '../assets/images/glatz/sombrano-s-plus-1.jpg'
import sombranoDetail2 from '../assets/images/glatz/sombrano-s-plus-2.jpg'
import sunwingImg from '../assets/images/glatz/sunwing-casa-3.webp'
import sunwingLife1 from '../assets/images/glatz/sunwing-casa-1.jpg'
import sunwingLife2 from '../assets/images/glatz/sunwing-casa-2.jpg'
import pendalexImg from '../assets/images/glatz/pendalex-p-plus-3.webp'
import ambienteImg from '../assets/images/glatz/ambiente-nova-1.webp'
import fortanoImg from '../assets/images/glatz/fortano-4.webp'
import vitaSferaImg from '../assets/images/glatz/vita-sfera-3.jpg'
import aluTwistImg from '../assets/images/glatz/alu-twist-1.webp'
import aluSmartImg from '../assets/images/glatz/alu-smart-1.webp'
import piazzaImg from '../assets/images/glatz/piazza-1.jpg'
import teakwoodImg from '../assets/images/glatz/teakwood-1.webp'
import alexoImg from '../assets/images/glatz/alexo-1.webp'
import vitaTornaImg from '../assets/images/glatz/vita-torna-1.jpg'
import vitaPianaImg from '../assets/images/glatz/vita-piana-1.webp'
import fortinoProImg from '../assets/images/glatz/fortino-pro-4.webp'
import fortelloLedImg from '../assets/images/glatz/fortello-led-1.webp'
import fortelloProImg from '../assets/images/glatz/fortello-pro-4.webp'
import forteroProImg from '../assets/images/glatz/fortero-pro-4.webp'
import castelloProImg from '../assets/images/glatz/castello-pro-1.webp'
import palazzoStyleImg from '../assets/images/glatz/palazzo-style-1.webp'
import palazzoNoblesseImg from '../assets/images/glatz/palazzo-noblesse-1.webp'
import palazzoRoyalImg from '../assets/images/glatz/palazzo-royal-1.webp'

const FABRIC_SPECS = [
  { label: 'Fabric colours', value: '70 colours, 3 quality classes' },
  { label: 'UV protection', value: '>98% — SPF 50 equivalent (SQTS certified)' },
]

const GLATZ_MATERIALS = [
  'Swiss design and engineering — Glatz AG, Frauenfeld',
  'Wind-tunnel tested before release',
  '70 fabric colours in classes 5 / 4 / 2 (all >98% UV protection)',
  'PFAS-free textiles',
  'Original Glatz bases, ground sockets, covers and spare parts available',
]

const model = (entry) => ({
  collection: 'Glatz',
  collectionName: 'Glatz',
  category: 'shade',
  tag: '',
  ...entry,
})

export const glatzProducts = [
  // ——— Side-mast (cantilever) ———
  model({ id: 'glatz-sombrano-s-plus', name: 'Sombrano S+', img: sombranoImg, tag: 'Popular', desc: 'The flagship side-mast parasol — synchronous crank opening, 54° tilt and 360° rotation on a pedal base.' }),
  model({ id: 'glatz-sunwing-casa', name: 'Sunwing Casa', img: sunwingImg, desc: 'The handy all-round side-mast parasol — twin cranks for opening and stepless 45° tilt.' }),
  model({ id: 'glatz-pendalex-p-plus', name: 'Pendalex P+', img: pendalexImg, desc: 'The multifunctional all-rounder among side-mast parasols.' }),
  model({ id: 'glatz-ambiente-nova', name: 'Ambiente Nova', img: ambienteImg, desc: 'The queen of the side-mast parasols — generous shade with refined detailing.' }),
  model({ id: 'glatz-fortano', name: 'Fortano', img: fortanoImg, desc: 'The windproof side-mast parasol, built for exposed coastal terraces.' }),
  model({ id: 'glatz-vita-sfera', name: 'Vita Sfera', img: vitaSferaImg, tag: 'New', desc: 'The aesthete with a floating design, from the VITA collection.' }),
  // ——— Aluminium centre-pole ———
  model({ id: 'glatz-alu-twist', name: 'Alu-Twist', img: aluTwistImg, desc: 'The clever, convenient centre-pole parasol for everyday use.' }),
  model({ id: 'glatz-alu-smart', name: 'Alu-Smart', img: aluSmartImg, desc: 'The small and flexible centre-pole parasol for balconies and bistro tables.' }),
  model({ id: 'glatz-vita-torna', name: 'Vita Torna', img: vitaTornaImg, desc: 'The ergonomically complete design purist from the VITA collection.' }),
  model({ id: 'glatz-vita-piana', name: 'Vita Piana', img: vitaPianaImg, desc: 'The modern compact parasol with a minimalist design.' }),
  // ——— Wood / wood look ———
  model({ id: 'glatz-piazza', name: 'Piazza', img: piazzaImg, desc: 'The wind-resistant parasol in an elegant wood look.' }),
  model({ id: 'glatz-teakwood', name: 'Teakwood', img: teakwoodImg, desc: 'The elegant masterpiece in precious timber.' }),
  model({ id: 'glatz-alexo', name: 'Alexo', img: alexoImg, desc: 'The classic Glatz parasol, in production since 1931.' }),
  // ——— Contract: windproof ———
  model({ id: 'glatz-fortino-pro', name: 'Fortino Pro', img: fortinoProImg, desc: 'The compact version of the windproof, corrosion-resistant contract parasol.' }),
  model({ id: 'glatz-fortello-led', name: 'Fortello LED', img: fortelloLedImg, desc: 'The windproof night owl — integrated LED lighting for evening hospitality.' }),
  model({ id: 'glatz-fortello-pro', name: 'Fortello Pro', img: fortelloProImg, desc: 'The windproof garden parasol for demanding commercial use.' }),
  model({ id: 'glatz-fortero-pro', name: 'Fortero Pro', img: forteroProImg, desc: 'The medium-size windproof favourite for cafés and restaurants.' }),
  // ——— Contract: giant ———
  model({ id: 'glatz-castello-pro', name: 'Castello Pro', img: castelloProImg, desc: 'The versatile giant allrounder for cafés and restaurants.' }),
  model({ id: 'glatz-palazzo-style', name: 'Palazzo Style', img: palazzoStyleImg, desc: 'The stylish giant parasol, steady even in headwinds.' }),
  model({ id: 'glatz-palazzo-noblesse', name: 'Palazzo Noblesse', img: palazzoNoblesseImg, desc: 'The giant parasol for the ambitious — large-scale shade with presence.' }),
  model({ id: 'glatz-palazzo-royal', name: 'Palazzo Royal', img: palazzoRoyalImg, desc: 'A Swiss masterpiece in shading for large gatherings.' }),
]

const detail = ({ id, name, tagline, images, type, specs = [], tag = '' }) => ({
  id,
  name,
  collection: 'Glatz',
  collectionSlug: 'glatz',
  category: 'shade',
  tag,
  tagline,
  images,
  specs: [
    { label: 'Type', value: type },
    { label: 'Origin', value: 'Swiss made — Glatz AG, since 1895' },
    ...specs,
    ...FABRIC_SPECS,
  ],
  materials: GLATZ_MATERIALS,
})

export const glatzProductDetails = {
  'glatz-sombrano-s-plus': detail({
    id: 'glatz-sombrano-s-plus',
    name: 'Sombrano S+',
    tag: 'Popular',
    type: 'Side-mast (cantilever) parasol',
    tagline: 'The flagship parasol. A turn of the crank is all it takes to enjoy stylish 360° solar protection — synchronous opening, 54° tilt in both directions and pedal-operated rotation.',
    images: [sombranoImg, sombranoDetail1, sombranoDetail2],
    specs: [
      { label: 'Sizes', value: 'Ø350 / Ø400 · 300×300 / 350×350 · 400×300 cm' },
      { label: 'Frame', value: '8 ribs, aluminium — oval mast 66×95×3 mm' },
      { label: 'Function', value: 'Crank opening · 54° tilt · 360° pedal rotation' },
      { label: 'Frame colours', value: 'Natural anodised or anthracite' },
      { label: 'Price', value: 'From €1,395 (excl. base)' },
    ],
  }),
  'glatz-sunwing-casa': detail({
    id: 'glatz-sunwing-casa',
    name: 'Sunwing Casa',
    type: 'Side-mast (cantilever) parasol',
    tagline: 'Always there when you need shade — but never in your way. One crank opens it, a second tilts the floating canopy steplessly up to 45°.',
    images: [sunwingImg, sunwingLife1, sunwingLife2],
    specs: [
      { label: 'Sizes', value: 'Ø300 / Ø330 · 270×270 · 300×240 cm' },
      { label: 'Frame', value: '8 ribs, aluminium — round mast 55×2.5 mm' },
      { label: 'Function', value: 'Crank opening · stepless 45° tilt · 360° rotation' },
      { label: 'Frame colours', value: 'Anodised or anthracite' },
      { label: 'Price', value: 'From €695 (excl. base)' },
    ],
  }),
  'glatz-pendalex-p-plus': detail({ id: 'glatz-pendalex-p-plus', name: 'Pendalex P+', type: 'Side-mast (cantilever) parasol', tagline: 'The multifunctional all-rounder among side-mast parasols.', images: [pendalexImg] }),
  'glatz-ambiente-nova': detail({ id: 'glatz-ambiente-nova', name: 'Ambiente Nova', type: 'Side-mast (cantilever) parasol', tagline: 'The queen of the side-mast parasols — generous shade with refined detailing.', images: [ambienteImg] }),
  'glatz-fortano': detail({ id: 'glatz-fortano', name: 'Fortano', type: 'Windproof side-mast parasol', tagline: 'The windproof side-mast parasol, built for exposed coastal terraces.', images: [fortanoImg] }),
  'glatz-vita-sfera': detail({ id: 'glatz-vita-sfera', name: 'Vita Sfera', tag: 'New', type: 'Side-mast parasol — VITA collection', tagline: 'The aesthete with a floating design.', images: [vitaSferaImg] }),
  'glatz-alu-twist': detail({ id: 'glatz-alu-twist', name: 'Alu-Twist', type: 'Aluminium centre-pole parasol', tagline: 'The clever, convenient parasol for everyday use.', images: [aluTwistImg] }),
  'glatz-alu-smart': detail({ id: 'glatz-alu-smart', name: 'Alu-Smart', type: 'Aluminium centre-pole parasol', tagline: 'The small and flexible parasol for balconies and bistro tables.', images: [aluSmartImg] }),
  'glatz-vita-torna': detail({ id: 'glatz-vita-torna', name: 'Vita Torna', type: 'Centre-pole parasol — VITA collection', tagline: 'The ergonomically complete design purist.', images: [vitaTornaImg] }),
  'glatz-vita-piana': detail({ id: 'glatz-vita-piana', name: 'Vita Piana', type: 'Centre-pole parasol — VITA collection', tagline: 'The modern compact parasol with a minimalist design.', images: [vitaPianaImg] }),
  'glatz-piazza': detail({ id: 'glatz-piazza', name: 'Piazza', type: 'Wood-look centre-pole parasol', tagline: 'The wind-resistant parasol in an elegant wood look.', images: [piazzaImg] }),
  'glatz-teakwood': detail({ id: 'glatz-teakwood', name: 'Teakwood', type: 'Timber centre-pole parasol', tagline: 'The elegant masterpiece in precious timber.', images: [teakwoodImg] }),
  'glatz-alexo': detail({ id: 'glatz-alexo', name: 'Alexo', type: 'Classic centre-pole parasol', tagline: 'The classic Glatz parasol, in production since 1931.', images: [alexoImg] }),
  'glatz-fortino-pro': detail({ id: 'glatz-fortino-pro', name: 'Fortino Pro', type: 'Windproof contract parasol', tagline: 'The compact version of the windproof, corrosion-resistant contract parasol.', images: [fortinoProImg] }),
  'glatz-fortello-led': detail({ id: 'glatz-fortello-led', name: 'Fortello LED', type: 'Windproof contract parasol with LED', tagline: 'The windproof night owl — integrated LED lighting for evening hospitality.', images: [fortelloLedImg] }),
  'glatz-fortello-pro': detail({ id: 'glatz-fortello-pro', name: 'Fortello Pro', type: 'Windproof contract parasol', tagline: 'The windproof garden parasol for demanding commercial use.', images: [fortelloProImg] }),
  'glatz-fortero-pro': detail({ id: 'glatz-fortero-pro', name: 'Fortero Pro', type: 'Windproof contract parasol', tagline: 'The medium-size windproof favourite for cafés and restaurants.', images: [forteroProImg] }),
  'glatz-castello-pro': detail({ id: 'glatz-castello-pro', name: 'Castello Pro', type: 'Giant contract parasol', tagline: 'The versatile giant allrounder for cafés and restaurants.', images: [castelloProImg] }),
  'glatz-palazzo-style': detail({ id: 'glatz-palazzo-style', name: 'Palazzo Style', type: 'Giant contract parasol', tagline: 'The stylish giant parasol, steady even in headwinds.', images: [palazzoStyleImg] }),
  'glatz-palazzo-noblesse': detail({ id: 'glatz-palazzo-noblesse', name: 'Palazzo Noblesse', type: 'Giant contract parasol', tagline: 'The giant parasol for the ambitious — large-scale shade with presence.', images: [palazzoNoblesseImg] }),
  'glatz-palazzo-royal': detail({ id: 'glatz-palazzo-royal', name: 'Palazzo Royal', type: 'Giant contract parasol', tagline: 'A Swiss masterpiece in shading for large gatherings.', images: [palazzoRoyalImg] }),
}
