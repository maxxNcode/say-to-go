import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processLocation } from '../geocoding'
import * as env from '../env'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.spyOn(env, 'NOMINATIM_HEADERS', 'get').mockReturnValue({ 'User-Agent': 'test' })

describe('geocoding', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('uses suggestion map for known locations', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { display_name: 'Paris, France', lat: '48.8566', lon: '2.3522', type: 'city', importance: 0.9 },
      ],
    })

    const result = await processLocation('paris')
    expect(result.displayName).toContain('Paris')
    expect(mockFetch.mock.calls[0][0]).toContain('Eiffel%20Tower')
  })

  it('throws when location not found', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] })
    await expect(processLocation('xyznonexistent123')).rejects.toThrow('Could not find location')
  })

  it('throws on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429 })
    // Use a suggestion that won't be cached from prior tests
    await expect(processLocation('nonexistent-city-xyz')).rejects.toThrow('Geocoding failed: 429')
  })
})
