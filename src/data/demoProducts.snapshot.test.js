import { describe, expect, it } from 'vitest'
import { demoProductIds } from './demoProducts'
import { approvedDemoProductIds } from './demoProducts.snapshot'

describe('public demonstration catalogue baseline', () => {
  it('keeps the approved public IDs unchanged while drafts remain private', () => {
    expect([...demoProductIds]).toEqual(approvedDemoProductIds)
  })
})
