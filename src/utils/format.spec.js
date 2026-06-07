import { describe, it, expect } from 'vitest'
import { getAssetUrl } from './format'

describe('format utils', () => {
  describe('getAssetUrl', () => {
    it('should return empty string for null path', () => {
      expect(getAssetUrl(null)).toBe('')
    })

    it('should replace r2.dev with custom domain', () => {
      const input = 'https://something.r2.dev/my-image.jpg'
      const output = getAssetUrl(input)
      expect(output).toContain('https://618002.xyz/my-image.jpg')
    })

    it('should handle relative paths for inventory assets', () => {
      const input = 'tools/inventory/item1.png'
      const output = getAssetUrl(input)
      expect(output).toContain('https://618002.xyz/tools/inventory/item1.png')
    })

    it('should fallback to api for unknown relative paths', () => {
      const input = 'some/other/path.png'
      const output = getAssetUrl(input)
      expect(output).toBe('/api/some/other/path.png')
    })

    it('should add fingerprint to custom domain assets', () => {
      const input = 'https://618002.xyz/test.jpg'
      const output = getAssetUrl(input)
      expect(output).toMatch(/\?v=\d+$/)
    })
  })
})
