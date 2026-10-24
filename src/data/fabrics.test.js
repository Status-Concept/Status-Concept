import { expect, it } from 'vitest'
import { fabricOptionsByModel, fabrics, ropes, finishLibrary } from './fabrics'

it('keeps the approved brief separate from unrelated supplier finishes', () => {
  expect(fabrics.map(finish => finish.name).sort()).toEqual(['Lead Chine', 'Lungo 002', 'Nature Grey', 'Savane Whisper', 'Sooty'].sort())
  expect(ropes.map(finish => finish.name)).toEqual(['Biscuit', 'Carbon Grey'])
  expect(finishLibrary.base.map(finish => finish.name)).toEqual(['White', 'Charcoal', 'Permateak'])
  expect(finishLibrary.base.every(finish => finish.supplier === 'Divano' && finish.material === 'Aluminium' && !finish.image && !finish.models)).toBe(true)
  expect(finishLibrary.base.every(finish => finish.availableOn === 'All Divano models')).toBe(true)
  expect(fabrics.find(finish => finish.name === 'Sooty')).toMatchObject({ manufacturer: 'Sunbrella', range: 'Solids', code: '3758' })
  expect(fabrics.find(finish => finish.name === 'Savane Whisper')).toMatchObject({ manufacturer: 'Sunbrella', range: 'Savane', code: 'J349' })
  expect(fabrics.filter(finish => finish.image).map(finish => finish.name)).toEqual(['Lungo 002'])
  expect(ropes.every(finish => !finish.image && !finish.grade)).toBe(true)
})

it('preserves every specified fabric combination plus universal Lead Chine without adding excluded models', () => {
  expect(fabricOptionsByModel).toEqual({
    berlin: ['Lead Chine', 'Sooty', 'Nature Grey'],
    sicily: ['Savane Whisper', 'Lungo 002', 'Lead Chine'],
    luanda: ['Lead Chine', 'Nature Grey'],
    antigua: ['Lead Chine', 'Nature Grey'],
    oxford: ['Savane Whisper', 'Lead Chine'],
    bali: ['Lead Chine', 'Nature Grey', 'Sooty'],
    gibraltar: ['Lead Chine', 'Nature Grey', 'Sooty'],
    crete: ['Lead Chine'],
  })
})
