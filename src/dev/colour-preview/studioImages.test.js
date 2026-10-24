import { expect, it } from 'vitest'
import sharp from 'sharp'
import { resolve } from 'node:path'
import { colourConfigurations } from './variants'

it('keeps white headroom above the Gibraltar parasol in the original and all three finishes', async () => {
  const gibraltar = colourConfigurations.find(item => item.key === 'gibraltar')
  const images = [gibraltar.original, ...gibraltar.colours.map(colour => colour.image)]
  expect(images).toHaveLength(4)
  for (const image of images) {
    expect(image).toContain('-v4.webp')
    const file = resolve('src/dev/colour-preview/images', image.split('/').at(-1))
    const metadata = await sharp(file).metadata()
    const strip = await sharp(file).extract({ left: 0, top: 0, width: metadata.width, height: 3 }).toBuffer()
    const top = await sharp(strip).stats()
    expect(top.channels.slice(0, 3).every(channel => channel.mean > 248 && channel.stdev < 4)).toBe(true)
  }
})

it('uses the corrected Luanda Lounge fabric previews with the dark accent cushion recoloured', async () => {
  const luanda = colourConfigurations.find(item => item.key === 'luanda-lounge')
  expect(luanda.colours.map(colour => colour.name)).toEqual(['Lead Chine', 'Nature Grey'])
  for (const colour of luanda.colours) {
    expect(colour.image).toContain('-v3.webp')
    const file = resolve('src/dev/colour-preview/images', colour.image.split('/').at(-1))
    const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true })
    const original = await sharp(resolve('src/dev/colour-preview/images', `${luanda.key}-${colour.name.toLowerCase().replaceAll(' ', '-')}.webp`)).metadata()
    expect([info.width, info.height]).toEqual([original.width, original.height])
    const cushionPixels = []
    for (let y = 215; y < 255; y += 1) {
      for (let x = 625; x < 665; x += 1) {
        const offset = (y * info.width + x) * info.channels
        cushionPixels.push((data[offset] + data[offset + 1] + data[offset + 2]) / 3)
      }
    }
    const meanBrightness = cushionPixels.reduce((sum, value) => sum + value, 0) / cushionPixels.length
    expect(meanBrightness).toBeGreaterThan(colour.name === 'Lead Chine' ? 80 : 130)
  }
})
