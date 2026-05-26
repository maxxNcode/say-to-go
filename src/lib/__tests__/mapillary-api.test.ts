import { describe, it, expect, vi, beforeEach } from 'vitest'
import { findImage } from '../mapillary/api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.mock('../env', () => ({
  getAccessToken: () => 'test-token',
}))

describe('mapillary api', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns image when found', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ id: '123' }],
      }),
    })

    const result = await findImage(48.8566, 2.3522)
    expect(result).toEqual({ id: '123', lat: 48.8566, lon: 2.3522 })
  })

  it('returns null when no images found', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ data: [] }) })
    const result = await findImage(0, 0)
    expect(result).toBeNull()
  })

  it('throws on 400 with OAuth error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'OAuthException: Invalid token',
    })

    await expect(findImage(48.8566, 2.3522)).rejects.toThrow('Mapillary API token is invalid or expired.')
  })
})
