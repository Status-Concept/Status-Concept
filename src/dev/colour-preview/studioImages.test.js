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
