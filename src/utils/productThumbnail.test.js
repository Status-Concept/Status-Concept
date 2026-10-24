import { expect, it } from 'vitest'
import sharp from 'sharp'
import { frameProductImage } from '../../scripts/build-product-thumbnails.mjs'
import { productThumbnail } from './productThumbnail'
import { productThumbnails } from '../data/productThumbnails.generated'

it.each(['#fff', { r: 0, g: 0, b: 0, alpha: 0 }])('enlarges a tiny product on %j into a white square without stretching it', async (background) => {
  const source = await sharp({ create: { width: 1000, height: 1000, channels: 4, background } })
    .composite([{ input: { create: { width: 100, height: 30, channels: 3, background: '#222' } }, left: 450, top: 600 }]).png().toBuffer()
  const { buffer, width, height } = await frameProductImage(source)
  expect(width).toBe(1056)
  expect(Math.abs(height / width - 0.3)).toBeLessThan(0.01)
  expect(await sharp(buffer).metadata()).toMatchObject({ width: 1200, height: 1200 })
})

it('uses the shared thumbnail and preserves unknown product images', () => {
  expect(productThumbnail({ id: 'hawaii-able' })).toBe(productThumbnails['hawaii-able'])
  expect(productThumbnail({ id: 'unknown', img: '/original.webp' })).toBe('/original.webp')
})

it('keeps white borders and a consistent canvas for every generated product thumbnail', async () => {
  expect(Object.keys(productThumbnails).length).toBeGreaterThan(150)
  for (const image of new Set(Object.values(productThumbnails))) {
    const { data, info } = await sharp(`public${image}`).raw().toBuffer({ resolveWithObject: true })
    expect([info.width, info.height]).toEqual([1200, 1200])
    for (const [x, y] of [[0, 0], [1199, 1199], [600, 0], [0, 600]]) {
      const offset = (y * info.width + x) * info.channels
      expect(Math.min(...data.subarray(offset, offset + 3))).toBeGreaterThan(250)
    }
  }
})
