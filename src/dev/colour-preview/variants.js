import { fabricOptionsByModel } from '../../data/fabrics'
import { colourTargets } from './targets'

const images = import.meta.glob('./images/*.webp', { eager: true, query: '?url', import: 'default' })
const revisedConfigurations = new Set(['antigua', 'antigua-xl', 'oxford', 'oxford-modular', 'oxford-daybed', 'gibraltar', 'crete', 'luanda', 'sicily', 'sicily-centre'])
// Approximate preview tones approved for local review only, not supplier swatches.
export const previewColours = {
  'Lead Chine': '#666765', 'Sooty': '#343536', 'Nature Grey': '#b6b1a7',
  'Savane Whisper': '#ded8ca', 'Lungo 002': '#d4cfbf',
}
const modelNames = { berlin: 'Berlin', sicily: 'Sicily', luanda: 'Luanda', antigua: 'Antigua', oxford: 'Oxford', bali: 'Bali', gibraltar: 'Gibraltar', crete: 'Crete Daybed' }
export const colourConfigurations = colourTargets.map(target => ({
  ...target, name: modelNames[target.model],
  colours: fabricOptionsByModel[target.model].map(name => ({
    name, hex: previewColours[name],
    image: images[`./images/${target.key}-${(name === 'Savane Whisper' ? 'Savanna Whisper' : name).toLowerCase().replaceAll(' ', '-')}${target.key === 'gibraltar' ? '-v4' : revisedConfigurations.has(target.key) ? '-v3' : ''}.webp`],
  })),
}))

export const colourModels = Object.entries(modelNames).map(([key, name]) => {
  const configurations = colourConfigurations.filter(target => target.model === key)
  return { ...configurations[0], key, name, configurations }
})
