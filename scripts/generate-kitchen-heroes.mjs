// Generate assembled-kitchen hero scenes for the kitchen collections that lack
// a real lifestyle photo (Black Stainless Steel, Carbon Line Teak), using the
// Gemini image model ("Nano Banana"). Teak already has a real photo (kitchen-hero.jpg).
//
// Usage:
//   node --env-file=.env scripts/generate-kitchen-heroes.mjs
// Requires GEMINI_API_KEY in the env (e.g. Status-Concept/.env).
//
// Output: src/assets/images/kitchen/black-steel-hero.png
//         src/assets/images/kitchen/carbon-line-hero.png

import { GoogleGenAI } from '@google/genai'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'src', 'assets', 'images', 'kitchen')

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('GEMINI_API_KEY not set. Add it to Status-Concept/.env and run with: node --env-file=.env scripts/generate-kitchen-heroes.mjs')
  process.exit(1)
}

const SHARED = `Wide 16:9 cinematic hero photograph, premium editorial outdoor-living look,
soft natural daylight, shallow depth of field. An upscale Algarve garden terrace:
warm wood-slat and stone wall behind, lush greenery, stone-paved floor, a hint of
lounge seating to one side. Absolutely NO text, NO logos, NO watermarks, NO people.
Photorealistic, magazine quality.`

const SCENES = [
  {
    file: 'black-steel-hero.png',
    prompt: `A complete, fully assembled BLACK STAINLESS STEEL modular outdoor kitchen as one
continuous run: matte black 304 stainless steel cabinets with light granite worktops,
a built-in gas barbecue with a closed hood in the centre, a glass-front drinks fridge,
a sink module and storage drawers. Sleek, modern, luxury. ${SHARED}`,
  },
  {
    file: 'carbon-line-hero.png',
    prompt: `A complete, fully assembled CARBON LINE outdoor kitchen as one continuous run:
charcoal-black reclaimed teak slatted cabinets with light ceramic worktops, a built-in
black stainless steel barbecue with a closed hood, a fridge cabinet, a sink module and
an island unit. Dark, warm, sophisticated luxury. ${SHARED}`,
  },
]

// Candidate image-capable models, tried in order until one returns image bytes.
// gemini-3-pro-image = "Nano Banana Pro" (best quality); flash models as fallback.
const MODELS = [
  'gemini-3-pro-image',
  'gemini-3.1-flash-image',
  'gemini-2.5-flash-image',
]

const ai = new GoogleGenAI({ apiKey })

function extractImage(resp) {
  const parts = resp?.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.inlineData?.data) {
      return { data: part.inlineData.data, mime: part.inlineData.mimeType || 'image/png' }
    }
  }
  return null
}

async function generate(scene) {
  for (const model of MODELS) {
    try {
      const resp = await ai.models.generateContent({
        model,
        contents: scene.prompt,
        config: { responseModalities: ['IMAGE', 'TEXT'], imageConfig: { aspectRatio: '16:9' } },
      })
      const img = extractImage(resp)
      if (img) {
        const out = join(OUT_DIR, scene.file)
        writeFileSync(out, Buffer.from(img.data, 'base64'))
        console.log(`  ✓ ${scene.file}  (model: ${model}, ${img.mime})`)
        return true
      }
      console.warn(`  · ${model} returned no image for ${scene.file}, trying next model…`)
    } catch (err) {
      console.warn(`  · ${model} failed (${err?.message || err}), trying next model…`)
    }
  }
  console.error(`  ✗ Could not generate ${scene.file} with any model.`)
  return false
}

mkdirSync(OUT_DIR, { recursive: true })
console.log('Generating kitchen hero scenes…')
let ok = 0
for (const scene of SCENES) {
  if (await generate(scene)) ok++
}
console.log(`Done: ${ok}/${SCENES.length} scenes generated into ${OUT_DIR}`)
process.exit(ok === SCENES.length ? 0 : 1)
