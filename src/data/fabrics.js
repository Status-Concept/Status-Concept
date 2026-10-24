// Model finishes confirmed by the user; stock is checked by the showroom team.
// Cannes, Fiji and Ibiza are excluded from this revision at the user's request.
export const fabricOptionsByModel = Object.fromEntries(Object.entries({
  berlin: ['Lead Chine', 'Sooty', 'Nature Grey'],
  sicily: ['Savane Whisper', 'Lungo 002'],
  luanda: ['Lead Chine', 'Nature Grey'],
  antigua: ['Lead Chine', 'Nature Grey'],
  oxford: ['Savane Whisper'],
  bali: ['Lead Chine', 'Nature Grey', 'Sooty'],
  gibraltar: ['Lead Chine', 'Nature Grey', 'Sooty'],
  crete: ['Lead Chine'],
}).map(([model, colours]) => [model, [...new Set([...colours, 'Lead Chine'])]]))

export const fabrics = [...new Set(Object.values(fabricOptionsByModel).flat())].map(name => ({
  name, kind: 'fabric', manufacturer: 'Sunbrella',
  ...(name === 'Sooty' ? {
    range: 'Solids', code: '3758',
    source: 'https://sunbrella.dickson-constant.com/en/solids-sooty-3758.html',
  } : {}),
  ...(name === 'Savane Whisper' ? {
    range: 'Savane', code: 'J349',
    source: 'https://sunbrella.dickson-constant.com/es/savane-whisper-j349.html',
  } : {}),
  ...(name === 'Lungo 002' ? {
    image: '/materials/divano/lungo-002.webp', grade: 4,
    source: 'https://divanolounge.online/', supplier: 'Divano',
  } : {}),
}))
export const ropes = ['Biscuit', 'Carbon Grey'].map(name => ({ name, kind: 'rope', supplier: 'Able' }))
export const finishLibrary = {
  fabric: fabrics, rope: ropes,
  base: ['White', 'Charcoal', 'Permateak'].map(name => ({
    name, kind: 'base', supplier: 'Divano', material: 'Aluminium', availableOn: 'All Divano models',
  })),
}
