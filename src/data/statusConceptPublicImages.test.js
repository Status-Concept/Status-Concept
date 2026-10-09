import { describe, expect, it } from 'vitest'
import source from './statusConceptImages.json'
import publicImages from './statusConceptPublicImages.json'

describe('public image library', () => {
  it('preserves approved imagery without shipping local source metadata', () => {
    const approved = source.filter((record) => !/^04 - WHATSAPP/i.test(record.originalFolder || '') && !/^04 - WHATSAPP/i.test(record.sourceReferencePath || ''))
    expect(publicImages.map((record) => record.id)).toEqual(approved.map((record) => record.id))
    for (const record of publicImages) {
      expect(Object.keys(record).sort()).toEqual(['id', 'name', 'productName', 'imageFile', 'letter', 'source', 'src'].sort())
      expect(record.src.startsWith('/status-concept-images/')).toBe(true)
    }
  })
})
